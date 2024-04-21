alter table "public"."test_file_versions" add column "code" text;

alter table "public"."test_files" add column "initial_prompt" text not null;

alter table "public"."test_files" add column "user_id" uuid not null default auth.uid();

alter table "public"."test_files" enable row level security;

alter table "public"."user_installation_info" alter column "access_token" set not null;

alter table "public"."user_installation_info" alter column "expires_at" set not null;

alter table "public"."user_installation_info" alter column "user_id" set not null;

alter table "public"."user_installation_info" enable row level security;

alter table "public"."test_files" add constraint "public_test_files_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."test_files" validate constraint "public_test_files_user_id_fkey";

alter table "public"."test_files" add constraint "test_files_initial_prompt_check" CHECK ((length(initial_prompt) > 0)) not valid;

alter table "public"."test_files" validate constraint "test_files_initial_prompt_check";

create policy "Allow file creator to add versions"
on "public"."test_file_versions"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM test_files tf
  WHERE (tf.id = test_file_versions.test_file_id))))
with check ((EXISTS ( SELECT 1
   FROM test_files tf
  WHERE (tf.id = test_file_versions.test_file_id))));


create policy "Allow users to add test files"
on "public"."test_files"
as permissive
for all
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Allow users to add installations"
on "public"."user_installation_info"
as permissive
for all
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));

alter table "public"."test_files" drop constraint "test_files_initial_prompt_check";

alter table "public"."test_file_versions" add column "prompt" text not null;

alter table "public"."test_files" drop column "initial_prompt";

-- add a trigger to automatically add the test_file_id to the test_file_versions table when new entry is added to test_files
create or replace function add_new_version()
returns trigger as $$
begin
  insert into test_file_versions (test_file_id, code, prompt) values (new.id, '', new.name);
  return new;
end;
$$ language plpgsql;

create trigger add_new_version
after insert on test_files
for each row
execute function add_new_version();
