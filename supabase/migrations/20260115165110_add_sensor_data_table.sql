create type "public"."sensor_type" as enum ('ph', 'dissolved_oxygen', 'turbidity', 'conductivity', 'flow_rate');

create table "public"."sensor_data" (
  "id" uuid not null default gen_random_uuid(),
  "type" public.sensor_type not null,
  "unit" text not null,
  "value" double precision not null,
  "recorded_at" timestamp with time zone not null,
  "created_at" timestamp with time zone not null default now()
);

alter table "public"."sensor_data" enable row level security;

CREATE UNIQUE INDEX sensor_data_pkey ON public.sensor_data USING btree (id);

alter table "public"."sensor_data" add constraint "sensor_data_pkey" PRIMARY KEY using index "sensor_data_pkey";

grant delete on table "public"."sensor_data" to "anon";

grant insert on table "public"."sensor_data" to "anon";

grant references on table "public"."sensor_data" to "anon";

grant select on table "public"."sensor_data" to "anon";

grant trigger on table "public"."sensor_data" to "anon";

grant truncate on table "public"."sensor_data" to "anon";

grant update on table "public"."sensor_data" to "anon";

grant delete on table "public"."sensor_data" to "authenticated";

grant insert on table "public"."sensor_data" to "authenticated";

grant references on table "public"."sensor_data" to "authenticated";

grant select on table "public"."sensor_data" to "authenticated";

grant trigger on table "public"."sensor_data" to "authenticated";

grant truncate on table "public"."sensor_data" to "authenticated";

grant update on table "public"."sensor_data" to "authenticated";

grant delete on table "public"."sensor_data" to "postgres";

grant insert on table "public"."sensor_data" to "postgres";

grant references on table "public"."sensor_data" to "postgres";

grant select on table "public"."sensor_data" to "postgres";

grant trigger on table "public"."sensor_data" to "postgres";

grant truncate on table "public"."sensor_data" to "postgres";

grant update on table "public"."sensor_data" to "postgres";

grant delete on table "public"."sensor_data" to "service_role";

grant insert on table "public"."sensor_data" to "service_role";

grant references on table "public"."sensor_data" to "service_role";

grant select on table "public"."sensor_data" to "service_role";

grant trigger on table "public"."sensor_data" to "service_role";

grant truncate on table "public"."sensor_data" to "service_role";

grant update on table "public"."sensor_data" to "service_role";

create policy "Allow authenticated users to view sensor data"
on "public"."sensor_data"
as permissive
for select
to authenticated
using (true);
