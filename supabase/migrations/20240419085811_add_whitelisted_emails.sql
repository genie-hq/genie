create policy "Allow select for current user" on "public"."users" as permissive for
select
    to authenticated using ((auth.uid() = id));

create policy "Allow update for current user" on "public"."users" as permissive for
update
    to authenticated using ((auth.uid() = id));

create table "public"."whitelisted_emails" ("email" text not null);

alter table
    "public"."whitelisted_emails" enable row level security;

CREATE UNIQUE INDEX whitelisted_emails_pkey ON public.whitelisted_emails USING btree (email);

alter table
    "public"."whitelisted_emails"
add
    constraint "whitelisted_emails_pkey" PRIMARY KEY using index "whitelisted_emails_pkey";

grant delete on table "public"."whitelisted_emails" to "anon";

grant
insert
    on table "public"."whitelisted_emails" to "anon";

grant references on table "public"."whitelisted_emails" to "anon";

grant
select
    on table "public"."whitelisted_emails" to "anon";

grant trigger on table "public"."whitelisted_emails" to "anon";

grant truncate on table "public"."whitelisted_emails" to "anon";

grant
update
    on table "public"."whitelisted_emails" to "anon";

grant delete on table "public"."whitelisted_emails" to "authenticated";

grant
insert
    on table "public"."whitelisted_emails" to "authenticated";

grant references on table "public"."whitelisted_emails" to "authenticated";

grant
select
    on table "public"."whitelisted_emails" to "authenticated";

grant trigger on table "public"."whitelisted_emails" to "authenticated";

grant truncate on table "public"."whitelisted_emails" to "authenticated";

grant
update
    on table "public"."whitelisted_emails" to "authenticated";

grant delete on table "public"."whitelisted_emails" to "service_role";

grant
insert
    on table "public"."whitelisted_emails" to "service_role";

grant references on table "public"."whitelisted_emails" to "service_role";

grant
select
    on table "public"."whitelisted_emails" to "service_role";

grant trigger on table "public"."whitelisted_emails" to "service_role";

grant truncate on table "public"."whitelisted_emails" to "service_role";

grant
update
    on table "public"."whitelisted_emails" to "service_role";