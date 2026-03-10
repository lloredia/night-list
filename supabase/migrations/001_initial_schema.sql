-- ============================================================
-- Night List — Initial Production Schema
-- ============================================================
-- Coordinate system: 460×440 reference canvas (matches iOS BlueprintView)

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_net";

-- ============================================================
-- ENUMS
-- ============================================================

create type user_role as enum ('guest', 'promoter', 'owner', 'admin');
create type table_type as enum ('vip', 'premium', 'bar', 'booth');
create type booking_status as enum ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show');
create type payment_status as enum ('unpaid', 'deposit_held', 'paid', 'refunded', 'partially_refunded', 'failed');
create type promoter_status as enum ('active', 'inactive', 'suspended');

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================

create table public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  role           user_role not null default 'guest',
  full_name      text,
  phone          text,
  avatar_url     text,
  stripe_customer_id text unique,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ============================================================
-- VENUES
-- ============================================================

create table public.venues (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null references public.profiles(id) on delete cascade,
  name           text not null,
  slug           text not null unique,
  area           text not null,
  vibe           text,
  description    text,
  address        text,
  phone          text,
  website        text,
  instagram      text,
  cover_image_url text,
  accent_color   text not null default '#C9A84C',
  min_spend      integer not null default 0,
  open_until     text,
  tags           text[] default '{}',
  venue_types    text[] default '{}',
  promo_text     text,
  is_published   boolean not null default false,
  -- Stripe
  stripe_account_id text unique,
  -- Policies
  max_party_size    integer default 20,
  min_advance_hrs   integer default 2,
  cancellation_hrs  integer default 24,
  no_show_fee_pct   integer default 50,
  dress_code_enforced boolean default true,
  age_verification    boolean default true,
  guest_list_only     boolean default false,
  -- Hours (stored as JSONB: [{day, open, close, closed}])
  operating_hours  jsonb default '[]',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index venues_owner_id_idx on public.venues(owner_id);
create index venues_slug_idx on public.venues(slug);

-- ============================================================
-- FLOOR PLAN TABLES
-- ============================================================

create table public.venue_tables (
  id              uuid primary key default gen_random_uuid(),
  venue_id        uuid not null references public.venues(id) on delete cascade,
  label           text not null,
  type            table_type not null default 'vip',
  price           integer not null default 0,   -- minimum spend in cents
  capacity        integer not null default 4,
  min_bottles     integer not null default 1,
  dress_code      text,
  arrival_deadline text,
  promo_text      text,
  is_active       boolean not null default true,
  -- Floor plan layout (460×440 reference canvas)
  layout_x        numeric not null default 0,
  layout_y        numeric not null default 0,
  layout_width    numeric not null default 80,
  layout_height   numeric not null default 60,
  -- Fixture flag (stage, bar, dance floor — not bookable)
  is_fixture      boolean not null default false,
  fixture_label   text,
  sort_order      integer default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index venue_tables_venue_id_idx on public.venue_tables(venue_id);

-- ============================================================
-- EVENTS (optional event-specific pricing/availability)
-- ============================================================

create table public.events (
  id              uuid primary key default gen_random_uuid(),
  venue_id        uuid not null references public.venues(id) on delete cascade,
  name            text not null,
  description     text,
  event_date      date not null,
  doors_open      time,
  doors_close     time,
  cover_charge    integer default 0,
  is_published    boolean default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index events_venue_id_idx on public.events(venue_id);
create index events_date_idx on public.events(event_date);

-- ============================================================
-- PROMOTERS
-- ============================================================

create table public.promoters (
  id              uuid primary key default gen_random_uuid(),
  venue_id        uuid not null references public.venues(id) on delete cascade,
  profile_id      uuid references public.profiles(id) on delete set null,
  name            text not null,
  email           text not null,
  phone           text,
  slug            text not null,              -- unique booking link slug
  commission_rate numeric(5,2) not null default 10.00,  -- percentage
  status          promoter_status not null default 'active',
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique(venue_id, slug),
  unique(venue_id, email)
);

create index promoters_venue_id_idx on public.promoters(venue_id);
create index promoters_slug_idx on public.promoters(slug);

-- ============================================================
-- TABLE LOCKS (optimistic concurrency — prevents double booking)
-- ============================================================
-- When a guest selects a table, we lock it for N minutes.
-- If they don't complete checkout, the lock expires automatically.

create table public.table_locks (
  id              uuid primary key default gen_random_uuid(),
  table_id        uuid not null references public.venue_tables(id) on delete cascade,
  event_date      date not null,
  locked_by       uuid references public.profiles(id) on delete cascade,
  session_token   text,                        -- for anonymous locks
  locked_until    timestamptz not null,
  created_at      timestamptz not null default now(),
  unique(table_id, event_date)                 -- only one lock per table per date
);

create index table_locks_table_id_idx on public.table_locks(table_id);
create index table_locks_expiry_idx on public.table_locks(locked_until);

-- ============================================================
-- BOOKINGS
-- ============================================================

create table public.bookings (
  id              uuid primary key default gen_random_uuid(),
  -- Relationships
  venue_id        uuid not null references public.venues(id),
  table_id        uuid not null references public.venue_tables(id),
  guest_id        uuid not null references public.profiles(id),
  promoter_id     uuid references public.promoters(id) on delete set null,
  event_id        uuid references public.events(id) on delete set null,
  -- Booking details
  confirmation_code text not null unique,
  event_date      date not null,
  party_size      integer not null,
  special_requests text,
  -- Financials (stored in cents)
  minimum_spend   integer not null,
  deposit_amount  integer not null default 0,
  -- Status
  status          booking_status not null default 'pending',
  payment_status  payment_status not null default 'unpaid',
  -- Stripe
  stripe_payment_intent_id  text unique,
  stripe_charge_id          text,
  -- Timestamps
  checked_in_at   timestamptz,
  cancelled_at    timestamptz,
  cancellation_reason text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- Constraint: one confirmed booking per table per date
  -- (enforced via unique partial index below)
  constraint valid_party_size check (party_size > 0 and party_size <= 100),
  constraint valid_deposit check (deposit_amount >= 0)
);

-- Prevent double bookings: only one active booking per table per date
create unique index bookings_no_double_book_idx
  on public.bookings(table_id, event_date)
  where status not in ('cancelled', 'no_show');

create index bookings_venue_id_idx on public.bookings(venue_id);
create index bookings_guest_id_idx on public.bookings(guest_id);
create index bookings_promoter_id_idx on public.bookings(promoter_id);
create index bookings_event_date_idx on public.bookings(event_date);
create index bookings_status_idx on public.bookings(status);
create index bookings_confirmation_code_idx on public.bookings(confirmation_code);

-- ============================================================
-- COMMISSIONS
-- ============================================================

create table public.commissions (
  id              uuid primary key default gen_random_uuid(),
  booking_id      uuid not null references public.bookings(id) on delete cascade,
  promoter_id     uuid not null references public.promoters(id),
  venue_id        uuid not null references public.venues(id),
  rate            numeric(5,2) not null,
  gross_amount    integer not null,    -- booking minimum spend in cents
  commission_amount integer not null,  -- calculated amount in cents
  is_paid         boolean default false,
  paid_at         timestamptz,
  created_at      timestamptz not null default now()
);

create index commissions_promoter_id_idx on public.commissions(promoter_id);
create index commissions_venue_id_idx on public.commissions(venue_id);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamps
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply to all tables with updated_at
create trigger trg_profiles_updated_at before update on public.profiles for each row execute function update_updated_at();
create trigger trg_venues_updated_at before update on public.venues for each row execute function update_updated_at();
create trigger trg_venue_tables_updated_at before update on public.venue_tables for each row execute function update_updated_at();
create trigger trg_events_updated_at before update on public.events for each row execute function update_updated_at();
create trigger trg_promoters_updated_at before update on public.promoters for each row execute function update_updated_at();
create trigger trg_bookings_updated_at before update on public.bookings for each row execute function update_updated_at();

-- Generate confirmation codes
create or replace function generate_confirmation_code()
returns text as $$
declare
  code text;
  exists boolean;
begin
  loop
    code := 'NL-' || upper(substring(md5(random()::text) from 1 for 6));
    select exists(select 1 from public.bookings where confirmation_code = code) into exists;
    exit when not exists;
  end loop;
  return code;
end;
$$ language plpgsql;

-- Lock a table for checkout (returns error if already locked/booked)
create or replace function lock_table(
  p_table_id uuid,
  p_event_date date,
  p_user_id uuid,
  p_session_token text default null,
  p_lock_minutes integer default 10
)
returns jsonb as $$
declare
  v_lock table_locks%rowtype;
  v_booking_exists boolean;
begin
  -- Check for existing confirmed booking
  select exists(
    select 1 from public.bookings
    where table_id = p_table_id
      and event_date = p_event_date
      and status not in ('cancelled', 'no_show')
  ) into v_booking_exists;

  if v_booking_exists then
    return jsonb_build_object('success', false, 'error', 'table_already_booked');
  end if;

  -- Delete expired locks
  delete from public.table_locks
  where table_id = p_table_id and event_date = p_event_date and locked_until < now();

  -- Try to insert lock (will fail if active lock exists due to unique constraint)
  begin
    insert into public.table_locks(table_id, event_date, locked_by, session_token, locked_until)
    values (p_table_id, p_event_date, p_user_id, p_session_token, now() + (p_lock_minutes || ' minutes')::interval)
    returning * into v_lock;

    return jsonb_build_object('success', true, 'lock_id', v_lock.id, 'locked_until', v_lock.locked_until);
  exception when unique_violation then
    -- Check if the existing lock belongs to this user
    select * into v_lock from public.table_locks
    where table_id = p_table_id and event_date = p_event_date and locked_until >= now();

    if v_lock.locked_by = p_user_id or v_lock.session_token = p_session_token then
      -- Extend own lock
      update public.table_locks set locked_until = now() + (p_lock_minutes || ' minutes')::interval
      where id = v_lock.id returning * into v_lock;
      return jsonb_build_object('success', true, 'lock_id', v_lock.id, 'locked_until', v_lock.locked_until);
    end if;

    return jsonb_build_object('success', false, 'error', 'table_locked_by_another_user');
  end;
end;
$$ language plpgsql security definer;

-- Create booking (atomic — acquires lock, creates booking, releases lock)
create or replace function create_booking(
  p_table_id uuid,
  p_venue_id uuid,
  p_guest_id uuid,
  p_event_date date,
  p_party_size integer,
  p_promoter_slug text default null,
  p_special_requests text default null
)
returns jsonb as $$
declare
  v_table venue_tables%rowtype;
  v_promoter promoters%rowtype;
  v_booking bookings%rowtype;
  v_code text;
  v_lock_result jsonb;
begin
  -- Validate table
  select * into v_table from public.venue_tables where id = p_table_id and venue_id = p_venue_id and is_active = true and is_fixture = false;
  if not found then
    return jsonb_build_object('success', false, 'error', 'table_not_found');
  end if;

  -- Validate party size
  if p_party_size > v_table.capacity then
    return jsonb_build_object('success', false, 'error', 'party_size_exceeds_capacity');
  end if;

  -- Acquire lock
  v_lock_result := lock_table(p_table_id, p_event_date, p_guest_id);
  if not (v_lock_result->>'success')::boolean then
    return v_lock_result;
  end if;

  -- Resolve promoter
  if p_promoter_slug is not null then
    select * into v_promoter from public.promoters
    where venue_id = p_venue_id and slug = p_promoter_slug and status = 'active';
  end if;

  -- Generate confirmation code
  v_code := generate_confirmation_code();

  -- Insert booking
  begin
    insert into public.bookings(
      venue_id, table_id, guest_id, promoter_id, confirmation_code,
      event_date, party_size, minimum_spend, special_requests, status, payment_status
    )
    values (
      p_venue_id, p_table_id, p_guest_id, v_promoter.id, v_code,
      p_event_date, p_party_size, v_table.price, p_special_requests, 'pending', 'unpaid'
    )
    returning * into v_booking;
  exception when unique_violation then
    return jsonb_build_object('success', false, 'error', 'table_already_booked');
  end;

  -- Create commission record if promoter exists
  if v_promoter.id is not null then
    insert into public.commissions(booking_id, promoter_id, venue_id, rate, gross_amount, commission_amount)
    values (v_booking.id, v_promoter.id, p_venue_id, v_promoter.commission_rate,
            v_table.price, round(v_table.price * v_promoter.commission_rate / 100));
  end if;

  -- Release lock (booking confirmed)
  delete from public.table_locks where table_id = p_table_id and event_date = p_event_date;

  return jsonb_build_object(
    'success', true,
    'booking_id', v_booking.id,
    'confirmation_code', v_code,
    'minimum_spend', v_table.price,
    'status', v_booking.status
  );
end;
$$ language plpgsql security definer;

-- Clean up expired locks (call from a cron job or edge function)
create or replace function cleanup_expired_locks()
returns integer as $$
declare
  deleted_count integer;
begin
  delete from public.table_locks where locked_until < now();
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$ language plpgsql security definer;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.venues enable row level security;
alter table public.venue_tables enable row level security;
alter table public.events enable row level security;
alter table public.promoters enable row level security;
alter table public.table_locks enable row level security;
alter table public.bookings enable row level security;
alter table public.commissions enable row level security;

-- Helper: get current user's role
create or replace function auth_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid()
$$ language sql security definer stable;

-- Helper: is venue owner?
create or replace function is_venue_owner(p_venue_id uuid)
returns boolean as $$
  select exists(select 1 from public.venues where id = p_venue_id and owner_id = auth.uid())
$$ language sql security definer stable;

-- PROFILES
create policy "Users can view their own profile" on public.profiles for select using (id = auth.uid());
create policy "Users can update their own profile" on public.profiles for update using (id = auth.uid());
create policy "Profile created on signup" on public.profiles for insert with check (id = auth.uid());
create policy "Admins can view all profiles" on public.profiles for select using (auth_role() = 'admin');

-- VENUES
create policy "Published venues are public" on public.venues for select using (is_published = true);
create policy "Owners can view their venues" on public.venues for select using (owner_id = auth.uid());
create policy "Owners can create venues" on public.venues for insert with check (owner_id = auth.uid());
create policy "Owners can update their venues" on public.venues for update using (owner_id = auth.uid());
create policy "Admins can manage all venues" on public.venues for all using (auth_role() = 'admin');

-- VENUE TABLES
create policy "Tables of published venues are public" on public.venue_tables for select
  using (exists(select 1 from public.venues where id = venue_id and is_published = true));
create policy "Owners can manage their tables" on public.venue_tables for all
  using (is_venue_owner(venue_id));
create policy "Admins can manage all tables" on public.venue_tables for all using (auth_role() = 'admin');

-- EVENTS
create policy "Published events are public" on public.events for select using (is_published = true);
create policy "Owners can manage their events" on public.events for all using (is_venue_owner(venue_id));

-- PROMOTERS
create policy "Venue owners can manage promoters" on public.promoters for all using (is_venue_owner(venue_id));
create policy "Promoters can view own record" on public.promoters for select using (profile_id = auth.uid());
create policy "Admins can manage all promoters" on public.promoters for all using (auth_role() = 'admin');

-- TABLE LOCKS (needed for booking flow — guests can lock tables)
create policy "Authenticated users can create locks" on public.table_locks for insert with check (auth.uid() is not null);
create policy "Users can view their own locks" on public.table_locks for select using (locked_by = auth.uid());
create policy "System can clean up locks" on public.table_locks for delete using (locked_until < now() or locked_by = auth.uid());

-- BOOKINGS
create policy "Guests can view own bookings" on public.bookings for select using (guest_id = auth.uid());
create policy "Owners can view venue bookings" on public.bookings for select using (is_venue_owner(venue_id));
create policy "Guests can create bookings" on public.bookings for insert with check (guest_id = auth.uid());
create policy "Guests can cancel own bookings" on public.bookings for update
  using (guest_id = auth.uid())
  with check (status = 'cancelled');
create policy "Owners can update booking status" on public.bookings for update using (is_venue_owner(venue_id));
create policy "Admins can manage all bookings" on public.bookings for all using (auth_role() = 'admin');

-- COMMISSIONS
create policy "Promoters view own commissions" on public.commissions for select using (
  exists(select 1 from public.promoters where id = promoter_id and profile_id = auth.uid())
);
create policy "Owners view venue commissions" on public.commissions for select using (is_venue_owner(venue_id));
create policy "Admins manage all commissions" on public.commissions for all using (auth_role() = 'admin');

-- ============================================================
-- REALTIME PUBLICATIONS
-- ============================================================

-- Enable realtime for availability-critical tables
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.table_locks;
alter publication supabase_realtime add table public.venue_tables;

-- ============================================================
-- PROFILE AUTO-CREATION TRIGGER
-- ============================================================

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'guest')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
