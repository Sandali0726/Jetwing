// Shape returned by GET /api/v1/customers and consumed by the Filtering &
// Intelligence table. Mirrors the fields the UI renders/filters on.
export interface GuestListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookingReference: string;
  country: string;
  hotel: string;
  checkIn: string;
  checkOut: string;
  bookingSource: string;
  futureBooking: 'Yes' | 'No';
  guestType: 'New Guest' | 'Repeat Guest' | 'VIP Guest';
  roomCategory: string;
  loyaltyStatus: string;
  servicesUsed: string[];
  totalSpend: number; // LKR (sum of non-cancelled booking revenue)
  hotelHistory: { hotel: string; date: string }[];
  bookingHistory: { ref: string; date: string; amount: number }[];
}
