alter table "public"."user_installation_info" drop column "expired_at";

alter table "public"."user_installation_info" add column "expires_at" timestamp without time zone;


