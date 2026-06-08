import { requireStaff } from '@/lib/api/auth';
import { route, ok } from '@/lib/api/http';
import type { GuestAnalytics } from '@/lib/dashboard/types';

/**
 * GET /api/v1/guests/analytics
 * Guest analytics aggregated from customers + bookings + properties.
 * Staff (ADMIN | REVENUE_MANAGER).
 */

const MONTHS_SHORT = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface BookingRow {
  customer_id: string;
  property_id: string;
  booking_channel: string;
  booking_date: string;
  check_in_date: string;
  total_revenue_lkr: number;
  is_cancelled: boolean;
}
interface CustomerRow {
  customer_id: string;
  nationality: string | null;
  country_of_residence: string | null;
}

type Channel = 'Direct' | 'OTA' | 'TravelAgent' | 'Other';
function channelOf(c: string): Channel {
  if (c === 'Direct_Web' || c === 'Direct_Phone' || c === 'Walk_In') return 'Direct';
  if (c === 'OTA') return 'OTA';
  if (c === 'Travel_Agent' || c === 'Corporate') return 'TravelAgent';
  return 'Other';
}
const monthKey = (d: string) => d.slice(0, 7); // yyyy-mm
const monthLabel = (key: string) => {
  const [y, m] = key.split('-');
  return `${MONTHS_SHORT[Number(m)]} ${y.slice(2)}`;
};

export const GET = route(async () => {
  const { supabase } = await requireStaff();

  const [{ data: custData, error: custErr }, { data: bookData, error: bookErr }, { data: props }] =
    await Promise.all([
      supabase.from('customers').select('customer_id, nationality, country_of_residence').is('deleted_at', null),
      supabase
        .from('bookings')
        .select('customer_id, property_id, booking_channel, booking_date, check_in_date, total_revenue_lkr, is_cancelled'),
      supabase.from('properties').select('property_id, property_name'),
    ]);
  if (custErr) throw new Error(custErr.message);
  if (bookErr) throw new Error(bookErr.message);

  const customers = (custData ?? []) as CustomerRow[];
  const bookings = (bookData ?? []) as BookingRow[];
  const live = bookings.filter((b) => !b.is_cancelled);
  const nameById = new Map((props ?? []).map((p) => [p.property_id, p.property_name]));
  const today = new Date().toISOString().slice(0, 10);

  // ── KPIs ───────────────────────────────────────────────────────────────────
  const bookingsPerCustomer = new Map<string, number>();
  for (const b of live) bookingsPerCustomer.set(b.customer_id, (bookingsPerCustomer.get(b.customer_id) ?? 0) + 1);
  const returningGuests = [...bookingsPerCustomer.values()].filter((n) => n > 1).length;

  const kpis: GuestAnalytics['kpis'] = {
    totalGuests: customers.length,
    totalBookings: live.length,
    totalRevenueLkr: live.reduce((s, b) => s + (b.total_revenue_lkr ?? 0), 0),
    directBookings: live.filter((b) => channelOf(b.booking_channel) === 'Direct').length,
    otaBookings: live.filter((b) => channelOf(b.booking_channel) === 'OTA').length,
    futureBookings: live.filter((b) => b.check_in_date > today).length,
    returningGuests,
    newGuests: Math.max(0, customers.length - returningGuests),
  };

  // ── Guest growth: bookings per month (last 12) ─────────────────────────────
  const growthMap = new Map<string, number>();
  for (const b of live) growthMap.set(monthKey(b.booking_date), (growthMap.get(monthKey(b.booking_date)) ?? 0) + 1);
  const growthKeys = [...growthMap.keys()].sort().slice(-12);
  const growth = growthKeys.map((k) => ({ month: monthLabel(k), guests: growthMap.get(k)! }));

  // ── Booking source trend by month (last 8) ─────────────────────────────────
  const srcMap = new Map<string, Record<Channel, number>>();
  for (const b of live) {
    const k = monthKey(b.booking_date);
    const row = srcMap.get(k) ?? { Direct: 0, OTA: 0, TravelAgent: 0, Other: 0 };
    row[channelOf(b.booking_channel)]++;
    srcMap.set(k, row);
  }
  const srcKeys = [...srcMap.keys()].sort().slice(-8);
  const bookingSources = srcKeys.map((k) => ({ month: monthLabel(k), ...srcMap.get(k)! }));

  // ── Revenue by hotel ───────────────────────────────────────────────────────
  const revMap = new Map<string, number>();
  for (const b of live) revMap.set(b.property_id, (revMap.get(b.property_id) ?? 0) + (b.total_revenue_lkr ?? 0));
  const revenueByHotel = [...revMap.entries()]
    .map(([id, revenue]) => ({ name: nameById.get(id) ?? 'Property', revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  // ── Nationality distribution ───────────────────────────────────────────────
  const natMap = new Map<string, number>();
  for (const c of customers) {
    const n = c.nationality ?? c.country_of_residence ?? 'Unknown';
    natMap.set(n, (natMap.get(n) ?? 0) + 1);
  }
  const nationalities = [...natMap.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const analytics: GuestAnalytics = { kpis, growth, bookingSources, revenueByHotel, nationalities };
  return ok({ data: analytics });
});
