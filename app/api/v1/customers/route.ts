import { requireStaff } from '@/lib/api/auth';
import { route, ok, pagination } from '@/lib/api/http';
import type { GuestListItem } from '@/lib/guests/types';

/**
 * GET /api/v1/customers
 * List guests for the Filtering & Intelligence table. Staff (ADMIN | REVENUE_MANAGER).
 * Joins customers → their bookings → property, and shapes each into a GuestListItem.
 * Query: limit, offset
 */

interface RawBooking {
  booking_id: string;
  pms_reservation_id: string | null;
  booking_source: string | null;
  room_category: string | null;
  services_used: string[] | null;
  booking_date: string;
  check_in_date: string;
  check_out_date: string;
  total_revenue_lkr: number | null;
  is_cancelled: boolean;
  properties: { property_name: string } | null;
}

interface RawCustomer {
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  nationality: string | null;
  country_of_residence: string | null;
  tier_label: string;
  bookings: RawBooking[] | null;
}

function shape(c: RawCustomer): GuestListItem {
  const bookings = c.bookings ?? [];
  // Most-recent stay first (check-in date desc).
  const sorted = [...bookings].sort((a, b) => (a.check_in_date < b.check_in_date ? 1 : -1));
  const latest = sorted[0];
  const today = new Date().toISOString().slice(0, 10);

  const hotelOf = (b: RawBooking) => b.properties?.property_name ?? 'Unknown';
  const refOf = (b: RawBooking) => b.pms_reservation_id ?? b.booking_id;

  const guestType: GuestListItem['guestType'] =
    c.tier_label === 'Gold' || c.tier_label === 'Platinum'
      ? 'VIP Guest'
      : bookings.length > 1
        ? 'Repeat Guest'
        : 'New Guest';

  return {
    id: c.customer_id,
    name: `${c.first_name} ${c.last_name}`.trim(),
    email: c.email,
    phone: c.phone ?? '',
    bookingReference: latest ? refOf(latest) : '',
    country: c.nationality ?? c.country_of_residence ?? 'Unknown',
    hotel: latest ? hotelOf(latest) : 'Unknown',
    checkIn: latest?.check_in_date ?? '',
    checkOut: latest?.check_out_date ?? '',
    bookingSource: latest?.booking_source ?? 'Direct Website',
    futureBooking: bookings.some((b) => b.check_in_date > today) ? 'Yes' : 'No',
    guestType,
    roomCategory: latest?.room_category ?? 'Standard',
    loyaltyStatus: c.tier_label,
    servicesUsed: Array.from(new Set(bookings.flatMap((b) => b.services_used ?? []))),
    totalSpend: bookings
      .filter((b) => !b.is_cancelled)
      .reduce((s, b) => s + (b.total_revenue_lkr ?? 0), 0),
    hotelHistory: sorted.map((b) => ({ hotel: hotelOf(b), date: b.check_in_date })),
    bookingHistory: sorted.map((b) => ({ ref: refOf(b), date: b.booking_date, amount: b.total_revenue_lkr ?? 0 })),
  };
}

export const GET = route(async (req) => {
  const { supabase } = await requireStaff();
  const { limit, offset } = pagination(req);

  const { data, count, error } = await supabase
    .from('customers')
    .select(
      `customer_id, first_name, last_name, email, phone, nationality, country_of_residence, tier_label,
       bookings ( booking_id, pms_reservation_id, booking_source, room_category, services_used,
                  booking_date, check_in_date, check_out_date, total_revenue_lkr, is_cancelled,
                  properties ( property_name ) )`,
      { count: 'exact' },
    )
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);

  const guests = ((data ?? []) as unknown as RawCustomer[]).map(shape);
  return ok({ data: guests, pagination: { limit, offset, total: count ?? 0 } });
});
