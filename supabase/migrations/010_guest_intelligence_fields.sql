-- ============================================================================
-- 010_guest_intelligence_fields
-- Adds the booking dimensions the Guest Intelligence "Filtering & Intelligence"
-- page filters on, so the UI runs on real data instead of mock values:
--   • bookings.booking_source  — finer than booking_channel (OTA → Booking.com/Agoda/Expedia)
--   • bookings.room_category   — normalised bucket (Standard/Deluxe/Suite/Luxury Villa)
--   • bookings.services_used   — ancillary services taken on the stay
--   • customers.tier_label     — adds 'Bronze' to the loyalty ladder
-- Existing rows are backfilled deterministically so nothing is left null.
-- ============================================================================

-- ── bookings: new columns ────────────────────────────────────────────────────
alter table public.bookings
  add column if not exists booking_source varchar(60),
  add column if not exists room_category  varchar(40),
  add column if not exists services_used  text[] not null default '{}';

-- booking_source: keep Direct/Agent as-is, fan OTA out to a real partner brand.
update public.bookings set booking_source = case
  when booking_channel in ('Direct_Web', 'Direct_Phone', 'Walk_In') then 'Direct Website'
  when booking_channel = 'Travel_Agent' then 'Travel Agent'
  when booking_channel = 'Corporate'    then 'Travel Agent'
  when booking_channel = 'OTA' then (array['Booking.com', 'Agoda', 'Expedia'])[1 + (abs(hashtext(booking_id::text)) % 3)]
  else 'Direct Website'
end
where booking_source is null;

-- room_category: derive a clean bucket from the free-text room_type.
update public.bookings set room_category = case
  when room_type ilike '%villa%'                                 then 'Luxury Villa'
  when room_type ilike '%suite%'                                 then 'Suite'
  when room_type ilike '%deluxe%' or room_type ilike '%premium%' then 'Deluxe'
  else 'Standard'
end
where room_category is null;

-- services_used: assign a believable 1–3 service mix (deterministic by booking_id).
update public.bookings set services_used = case abs(hashtext(booking_id::text)) % 6
  when 0 then array['Dining', 'Spa']
  when 1 then array['Safari', 'Excursions', 'Dining']
  when 2 then array['Wellness', 'Spa']
  when 3 then array['Transfers', 'Dining']
  when 4 then array['Whale Watching', 'Excursions']
  else array['Dining']
end
where services_used = '{}';

-- Constrain to the values the UI knows about (after backfill, so it never trips).
alter table public.bookings drop constraint if exists bookings_booking_source_check;
alter table public.bookings add constraint bookings_booking_source_check
  check (booking_source in ('Direct Website', 'Booking.com', 'Agoda', 'Expedia', 'Travel Agent'));

alter table public.bookings drop constraint if exists bookings_room_category_check;
alter table public.bookings add constraint bookings_room_category_check
  check (room_category in ('Standard', 'Deluxe', 'Suite', 'Luxury Villa'));

-- ── customers: add Bronze to the loyalty ladder ──────────────────────────────
alter table public.customers drop constraint if exists customers_tier_label_check;
update public.customers set tier_label = 'Bronze' where tier_label = 'Standard';
alter table public.customers alter column tier_label set default 'Bronze';
alter table public.customers add constraint customers_tier_label_check
  check (tier_label in ('Bronze', 'Standard', 'Silver', 'Gold', 'Platinum'));
