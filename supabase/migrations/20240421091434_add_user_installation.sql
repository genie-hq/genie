create table "public"."user_installation_info" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "access_token" character varying,
    "user_id" uuid,
    "installation_id" bigint not null
);


alter table "public"."user_installation_info" enable row level security;

CREATE UNIQUE INDEX user_installation_pkey ON public.user_installation_info USING btree (id, installation_id);

alter table "public"."user_installation_info" add constraint "user_installation_pkey" PRIMARY KEY using index "user_installation_pkey";

alter table "public"."user_installation_info" add constraint "public_user_installation_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."user_installation_info" validate constraint "public_user_installation_user_id_fkey";

grant delete on table "public"."user_installation_info" to "anon";

grant insert on table "public"."user_installation_info" to "anon";

grant references on table "public"."user_installation_info" to "anon";

grant select on table "public"."user_installation_info" to "anon";

grant trigger on table "public"."user_installation_info" to "anon";

grant truncate on table "public"."user_installation_info" to "anon";

grant update on table "public"."user_installation_info" to "anon";

grant delete on table "public"."user_installation_info" to "authenticated";

grant insert on table "public"."user_installation_info" to "authenticated";

grant references on table "public"."user_installation_info" to "authenticated";

grant select on table "public"."user_installation_info" to "authenticated";

grant trigger on table "public"."user_installation_info" to "authenticated";

grant truncate on table "public"."user_installation_info" to "authenticated";

grant update on table "public"."user_installation_info" to "authenticated";

grant delete on table "public"."user_installation_info" to "service_role";

grant insert on table "public"."user_installation_info" to "service_role";

grant references on table "public"."user_installation_info" to "service_role";

grant select on table "public"."user_installation_info" to "service_role";

grant trigger on table "public"."user_installation_info" to "service_role";

grant truncate on table "public"."user_installation_info" to "service_role";

grant update on table "public"."user_installation_info" to "service_role";

alter table "public"."user_installation_info" alter column "installation_id" set data type character varying using "installation_id"::character varying;

alter table "public"."user_installation_info" drop constraint "user_installation_pkey";

drop index if exists "public"."user_installation_pkey";

alter table "public"."user_installation_info" add column "expired_at" timestamp without time zone;

alter table "public"."user_installation_info" disable row level security;

CREATE UNIQUE INDEX user_installation_info_pkey ON public.user_installation_info USING btree (id);

alter table "public"."user_installation_info" add constraint "user_installation_info_pkey" PRIMARY KEY using index "user_installation_info_pkey";

alter table "public"."user_installation_info" drop column "expired_at";

alter table "public"."user_installation_info" add column "expires_at" timestamp without time zone;