alter table "public"."user_installation_info" drop constraint "user_installation_pkey";

drop index if exists "public"."user_installation_pkey";

alter table "public"."user_installation_info" add column "expired_at" timestamp without time zone;

alter table "public"."user_installation_info" disable row level security;

CREATE UNIQUE INDEX user_installation_info_pkey ON public.user_installation_info USING btree (id);

alter table "public"."user_installation_info" add constraint "user_installation_info_pkey" PRIMARY KEY using index "user_installation_info_pkey";


