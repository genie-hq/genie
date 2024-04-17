create table "public"."users" (
    "id" uuid not null default gen_random_uuid(),
    "display_name" text,
    "email" text not null,
    "created_at" timestamp with time zone not null default now()
);

alter table
    "public"."users" enable row level security;

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table
    "public"."users"
add
    constraint "users_pkey" PRIMARY KEY using index "users_pkey";

grant delete on table "public"."users" to "anon";

grant
insert
    on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant
select
    on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant
update
    on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant
insert
    on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant
select
    on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant
update
    on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant
insert
    on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant
select
    on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant
update
    on table "public"."users" to "service_role";
    

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";




set
    check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_user_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$ BEGIN
INSERT INTO public.users (id, email)
VALUES (NEW.id, NEW.email);
RETURN NEW;
END;
$$;

CREATE TRIGGER create_user_profile_tr
AFTER
INSERT
    ON auth.users FOR EACH ROW EXECUTE PROCEDURE create_user_profile();

CREATE OR REPLACE FUNCTION public.update_user_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.users
    SET email = NEW.email
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_profile_tr
AFTER UPDATE OF email
    ON auth.users FOR EACH ROW EXECUTE PROCEDURE update_user_profile();

CREATE OR REPLACE FUNCTION public.delete_user_profile()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.users
    WHERE id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE TRIGGER delete_user_profile_tr
AFTER DELETE
    ON auth.users FOR EACH ROW EXECUTE PROCEDURE delete_user_profile();