alter table "public"."sensor_data" alter column "type" set data type text using "type"::text;
alter table "public"."sensor_data" alter column "type" set not null;

drop type if exists "public"."sensor_type";
