-- MotoMatch – Datenbankschema (Phase 2, M7)
-- =========================================
-- Bildet das Domain-Modell aus src/data/schema.ts ab (Spaltennamen in snake_case).
-- Einspielen: im Supabase-Dashboard im SQL-Editor ausführen oder mit der Supabase-CLI
-- («supabase db push»). Danach die Daten mit «npm run seed» einfüllen.
--
-- Grundsätze
-- - Text-IDs (Slugs) als Primärschlüssel: URLs und JSON-Dateien passen 1:1.
-- - Verschachtelte Felder werden zu Spalten, Estimated<T> zu Wert + Art, Listen zu text[].
-- - Berechnete Werte (PS, Leistungsgewicht, Reichweite, Führerausweis) werden nicht
--   gespeichert – die Logik gibt es nur einmal, in src/lib/.
-- - Sicherheit: Row Level Security auf allen Tabellen. Die öffentliche Rolle darf nur
--   lesen; Schreibrechte gibt es keine (Änderungen nur über Dashboard oder Seed-Skript).

-- ---------------------------------------------------------------------------
-- Hersteller und Extras-Katalog
-- ---------------------------------------------------------------------------

create table public.manufacturers (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (length(name) > 0),
  country text not null check (country ~ '^[A-Z]{2}$')
);

create table public.features (
  key text primary key check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  label text not null check (length(label) > 0),
  feature_group text not null
    check (feature_group in ('comfort', 'safety', 'chassis', 'electronics', 'technology')),
  icon text not null check (length(icon) > 0),
  description text check (description is null or length(description) > 0),
  -- Reihenfolge wie in features.json (bestimmt die Reihenfolge auf der Seite)
  position smallint not null default 0
);

-- ---------------------------------------------------------------------------
-- Modelle und Generationen
-- ---------------------------------------------------------------------------

create table public.models (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  manufacturer_id text not null references public.manufacturers (id),
  name text not null check (length(name) > 0),
  category text not null check (
    category in (
      'naked', 'supersport', 'sport', 'touring', 'adventure',
      'enduro', 'supermoto', 'cruiser', 'retro', 'scooter'
    )
  ),
  tagline text check (tagline is null or length(tagline) > 0)
);

create table public.generations (
  -- <modell-id>-<erstes Baujahr>, z. B. yamaha-mt-07-2025
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  model_id text not null references public.models (id) on delete cascade,
  year_from smallint not null check (year_from between 1950 and 2100),
  -- NULL = aktuell erhältlich
  year_to smallint check (year_to between 1950 and 2100),
  changes text[],
  colors text[],

  -- Motor
  displacement_cc integer not null check (displacement_cc > 0),
  cylinders smallint not null check (cylinders > 0),
  engine_layout text not null check (length(engine_layout) > 0),
  cooling text not null check (cooling in ('air', 'liquid', 'air-oil')),
  power_kw numeric(6, 2) not null check (power_kw > 0),
  power_rpm integer check (power_rpm > 0),
  torque_nm numeric(6, 1) not null check (torque_nm > 0),
  torque_rpm integer check (torque_rpm > 0),

  -- Fahrleistungen: Wert und Art der Quelle (Estimated<T>)
  top_speed_kmh numeric(5, 1) check (top_speed_kmh > 0),
  top_speed_kind text check (top_speed_kind in ('official', 'tested', 'estimate')),
  accel_0_100_s numeric(4, 2) check (accel_0_100_s > 0),
  accel_0_100_kind text check (accel_0_100_kind in ('official', 'tested', 'estimate')),

  -- Fahrwerk
  weight_kg numeric(5, 1) not null check (weight_kg > 0),
  weight_note text,
  seat_height_mm integer not null check (seat_height_mm > 0),
  tank_l numeric(4, 1) not null check (tank_l > 0),
  consumption_l100km numeric(4, 2) check (consumption_l100km > 0),
  gears smallint not null check (gears > 0),
  drive text not null check (drive in ('chain', 'shaft', 'belt')),

  -- Drosselung, Elektronik, Preis
  throttle_available boolean not null,
  throttled_power_kw numeric(6, 2) check (throttled_power_kw > 0),
  throttle_note text,
  quickshifter text not null check (quickshifter in ('standard', 'optional', 'none')),
  blipper text not null check (blipper in ('standard', 'optional', 'none')),
  price_chf numeric(10, 2) not null check (price_chf > 0),
  price_as_of date not null,
  price_note text,

  -- Redaktionelle Wertungen 1–10
  score_tuning_visual smallint not null check (score_tuning_visual between 1 and 10),
  score_tuning_performance smallint not null check (score_tuning_performance between 1 and 10),
  score_sound smallint not null check (score_sound between 1 and 10),
  profile_beginner smallint not null check (profile_beginner between 1 and 10),
  profile_city smallint not null check (profile_city between 1 and 10),
  profile_touring smallint not null check (profile_touring between 1 and 10),
  profile_sport smallint not null check (profile_sport between 1 and 10),
  profile_offroad smallint not null check (profile_offroad between 1 and 10),

  -- Texte, Sound, Medien
  tuning_note text not null check (length(tuning_note) > 0),
  sound_description text not null check (length(sound_description) > 0),
  sound_audio_src text,
  noise_db_a numeric(5, 1) check (noise_db_a > 0),
  youtube_review_url text check (youtube_review_url like 'https://%'),
  image_hero text,
  image_gallery text[],
  image_credit text,

  data_status text not null check (data_status in ('verified', 'needsVerification')),
  last_checked date not null,

  constraint generations_years check (year_to is null or year_to >= year_from),
  constraint generations_top_speed_pair check ((top_speed_kmh is null) = (top_speed_kind is null)),
  constraint generations_accel_pair check ((accel_0_100_s is null) = (accel_0_100_kind is null)),
  constraint generations_throttle check (throttle_available or throttled_power_kw is null),
  constraint generations_throttled_below_power check (
    throttled_power_kw is null or throttled_power_kw < power_kw
  )
);

-- Extras einer Generation (Serie oder optional; was fehlt, steht nicht in der Tabelle)
create table public.generation_features (
  generation_id text not null references public.generations (id) on delete cascade,
  feature_key text not null references public.features (key),
  availability text not null check (availability in ('standard', 'optional')),
  detail text check (detail is null or length(detail) > 0),
  -- Reihenfolge wie im JSON
  position smallint not null default 0,
  primary key (generation_id, feature_key)
);

-- Quellen einer Generation (nur https-Links)
create table public.generation_sources (
  generation_id text not null references public.generations (id) on delete cascade,
  position smallint not null,
  label text not null check (length(label) > 0),
  url text not null check (url like 'https://%'),
  primary key (generation_id, position)
);

-- ---------------------------------------------------------------------------
-- Indizes auf Filter- und Fremdschlüsselspalten
-- ---------------------------------------------------------------------------

create index models_category_idx on public.models (category);
create index models_manufacturer_idx on public.models (manufacturer_id);
create index generations_model_idx on public.generations (model_id);
create index generations_power_idx on public.generations (power_kw);
create index generations_price_idx on public.generations (price_chf);
create index generation_features_feature_idx on public.generation_features (feature_key);

-- ---------------------------------------------------------------------------
-- Sicherheit: nur lesen
-- ---------------------------------------------------------------------------
-- Row Level Security ist aktiv; es gibt nur Lese-Policies. Zusätzlich entziehen wir der
-- öffentlichen Rolle (anon) und eingeloggten Nutzern (authenticated) alle Rechte ausser
-- Lesen: Selbst wenn später eine Policy falsch gesetzt wird, bleibt Schreiben verboten.
-- «npm run check:rls» prüft beides mit dem öffentlichen Schlüssel.
-- Das Seed-Skript nutzt den geheimen Schlüssel (Rolle service_role, umgeht RLS); ihre
-- Rechte setzen wir ausdrücklich, unabhängig von den Standardrechten des Projekts.

alter table public.manufacturers enable row level security;
alter table public.features enable row level security;
alter table public.models enable row level security;
alter table public.generations enable row level security;
alter table public.generation_features enable row level security;
alter table public.generation_sources enable row level security;

create policy "Alle dürfen lesen" on public.manufacturers for select to anon, authenticated using (true);
create policy "Alle dürfen lesen" on public.features for select to anon, authenticated using (true);
create policy "Alle dürfen lesen" on public.models for select to anon, authenticated using (true);
create policy "Alle dürfen lesen" on public.generations for select to anon, authenticated using (true);
create policy "Alle dürfen lesen" on public.generation_features for select to anon, authenticated using (true);
create policy "Alle dürfen lesen" on public.generation_sources for select to anon, authenticated using (true);

revoke all on
  public.manufacturers, public.features, public.models,
  public.generations, public.generation_features, public.generation_sources
from anon, authenticated;

grant select on
  public.manufacturers, public.features, public.models,
  public.generations, public.generation_features, public.generation_sources
to anon, authenticated;

grant select, insert, update, delete on
  public.manufacturers, public.features, public.models,
  public.generations, public.generation_features, public.generation_sources
to service_role;
