create table "public"."branches" (
    "id" uuid not null default gen_random_uuid(),
    "repository_id" uuid not null default gen_random_uuid(),
    "name" text not null
);


alter table "public"."branches" enable row level security;

create table "public"."github_accounts" (
    "id" uuid not null default gen_random_uuid(),
    "username" text not null,
    "user_id" uuid not null default gen_random_uuid()
);


alter table "public"."github_accounts" enable row level security;

create table "public"."repositories" (
    "id" uuid not null default gen_random_uuid(),
    "github_account_id" uuid not null default gen_random_uuid(),
    "name" text not null
);


alter table "public"."repositories" enable row level security;

create table "public"."test_cases" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "status" text not null,
    "code" text not null,
    "name" text not null
);


alter table "public"."test_cases" enable row level security;

create table "public"."test_cases_versions" (
    "test_file_version_id" uuid not null default gen_random_uuid(),
    "test_case_id" uuid not null default gen_random_uuid()
);


alter table "public"."test_cases_versions" enable row level security;

create table "public"."test_file_versions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "test_file_id" uuid not null default gen_random_uuid()
);


alter table "public"."test_file_versions" enable row level security;

create table "public"."test_files" (
    "branch_id" uuid not null default gen_random_uuid(),
    "path" text not null,
    "name" text not null,
    "test_library_id" uuid not null default gen_random_uuid(),
    "language" text not null default 'typescript'::text,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now(),
    "id" uuid not null default gen_random_uuid()
);


alter table "public"."test_files" enable row level security;

create table "public"."test_libraries" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null
);


alter table "public"."test_libraries" enable row level security;

alter table "public"."users" alter column "display_name" set not null;

CREATE UNIQUE INDEX branches_pkey ON public.branches USING btree (id);

CREATE UNIQUE INDEX github_accounts_pkey ON public.github_accounts USING btree (id);

CREATE UNIQUE INDEX github_accounts_username_key ON public.github_accounts USING btree (username);

CREATE UNIQUE INDEX repositories_pkey ON public.repositories USING btree (id);

CREATE UNIQUE INDEX test_cases_pkey ON public.test_cases USING btree (id);

CREATE UNIQUE INDEX test_cases_versions_pkey ON public.test_cases_versions USING btree (test_file_version_id, test_case_id);

CREATE UNIQUE INDEX test_file_versions_pkey ON public.test_file_versions USING btree (id);

CREATE UNIQUE INDEX test_files_pkey ON public.test_files USING btree (id);

CREATE UNIQUE INDEX test_libraries_name_key ON public.test_libraries USING btree (name);

CREATE UNIQUE INDEX test_libraries_pkey ON public.test_libraries USING btree (id);

alter table "public"."branches" add constraint "branches_pkey" PRIMARY KEY using index "branches_pkey";

alter table "public"."github_accounts" add constraint "github_accounts_pkey" PRIMARY KEY using index "github_accounts_pkey";

alter table "public"."repositories" add constraint "repositories_pkey" PRIMARY KEY using index "repositories_pkey";

alter table "public"."test_cases" add constraint "test_cases_pkey" PRIMARY KEY using index "test_cases_pkey";

alter table "public"."test_cases_versions" add constraint "test_cases_versions_pkey" PRIMARY KEY using index "test_cases_versions_pkey";

alter table "public"."test_file_versions" add constraint "test_file_versions_pkey" PRIMARY KEY using index "test_file_versions_pkey";

alter table "public"."test_files" add constraint "test_files_pkey" PRIMARY KEY using index "test_files_pkey";

alter table "public"."test_libraries" add constraint "test_libraries_pkey" PRIMARY KEY using index "test_libraries_pkey";

alter table "public"."branches" add constraint "public_branches_repository_id_fkey" FOREIGN KEY (repository_id) REFERENCES repositories(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."branches" validate constraint "public_branches_repository_id_fkey";

alter table "public"."github_accounts" add constraint "github_accounts_username_key" UNIQUE using index "github_accounts_username_key";

alter table "public"."github_accounts" add constraint "public_github_accounts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."github_accounts" validate constraint "public_github_accounts_user_id_fkey";

alter table "public"."repositories" add constraint "public_repositories_github_account_id_fkey" FOREIGN KEY (github_account_id) REFERENCES github_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."repositories" validate constraint "public_repositories_github_account_id_fkey";

alter table "public"."test_cases_versions" add constraint "public_test_cases_versions_test_case_id_fkey" FOREIGN KEY (test_case_id) REFERENCES test_cases(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."test_cases_versions" validate constraint "public_test_cases_versions_test_case_id_fkey";

alter table "public"."test_cases_versions" add constraint "public_test_cases_versions_test_file_version_id_fkey" FOREIGN KEY (test_file_version_id) REFERENCES test_file_versions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."test_cases_versions" validate constraint "public_test_cases_versions_test_file_version_id_fkey";

alter table "public"."test_file_versions" add constraint "public_test_file_versions_test_file_id_fkey" FOREIGN KEY (test_file_id) REFERENCES test_files(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."test_file_versions" validate constraint "public_test_file_versions_test_file_id_fkey";

alter table "public"."test_files" add constraint "public_test_files_branch_id_fkey" FOREIGN KEY (branch_id) REFERENCES branches(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."test_files" validate constraint "public_test_files_branch_id_fkey";

alter table "public"."test_libraries" add constraint "test_libraries_name_key" UNIQUE using index "test_libraries_name_key";

grant delete on table "public"."branches" to "anon";

grant insert on table "public"."branches" to "anon";

grant references on table "public"."branches" to "anon";

grant select on table "public"."branches" to "anon";

grant trigger on table "public"."branches" to "anon";

grant truncate on table "public"."branches" to "anon";

grant update on table "public"."branches" to "anon";

grant delete on table "public"."branches" to "authenticated";

grant insert on table "public"."branches" to "authenticated";

grant references on table "public"."branches" to "authenticated";

grant select on table "public"."branches" to "authenticated";

grant trigger on table "public"."branches" to "authenticated";

grant truncate on table "public"."branches" to "authenticated";

grant update on table "public"."branches" to "authenticated";

grant delete on table "public"."branches" to "service_role";

grant insert on table "public"."branches" to "service_role";

grant references on table "public"."branches" to "service_role";

grant select on table "public"."branches" to "service_role";

grant trigger on table "public"."branches" to "service_role";

grant truncate on table "public"."branches" to "service_role";

grant update on table "public"."branches" to "service_role";

grant delete on table "public"."github_accounts" to "anon";

grant insert on table "public"."github_accounts" to "anon";

grant references on table "public"."github_accounts" to "anon";

grant select on table "public"."github_accounts" to "anon";

grant trigger on table "public"."github_accounts" to "anon";

grant truncate on table "public"."github_accounts" to "anon";

grant update on table "public"."github_accounts" to "anon";

grant delete on table "public"."github_accounts" to "authenticated";

grant insert on table "public"."github_accounts" to "authenticated";

grant references on table "public"."github_accounts" to "authenticated";

grant select on table "public"."github_accounts" to "authenticated";

grant trigger on table "public"."github_accounts" to "authenticated";

grant truncate on table "public"."github_accounts" to "authenticated";

grant update on table "public"."github_accounts" to "authenticated";

grant delete on table "public"."github_accounts" to "service_role";

grant insert on table "public"."github_accounts" to "service_role";

grant references on table "public"."github_accounts" to "service_role";

grant select on table "public"."github_accounts" to "service_role";

grant trigger on table "public"."github_accounts" to "service_role";

grant truncate on table "public"."github_accounts" to "service_role";

grant update on table "public"."github_accounts" to "service_role";

grant delete on table "public"."repositories" to "anon";

grant insert on table "public"."repositories" to "anon";

grant references on table "public"."repositories" to "anon";

grant select on table "public"."repositories" to "anon";

grant trigger on table "public"."repositories" to "anon";

grant truncate on table "public"."repositories" to "anon";

grant update on table "public"."repositories" to "anon";

grant delete on table "public"."repositories" to "authenticated";

grant insert on table "public"."repositories" to "authenticated";

grant references on table "public"."repositories" to "authenticated";

grant select on table "public"."repositories" to "authenticated";

grant trigger on table "public"."repositories" to "authenticated";

grant truncate on table "public"."repositories" to "authenticated";

grant update on table "public"."repositories" to "authenticated";

grant delete on table "public"."repositories" to "service_role";

grant insert on table "public"."repositories" to "service_role";

grant references on table "public"."repositories" to "service_role";

grant select on table "public"."repositories" to "service_role";

grant trigger on table "public"."repositories" to "service_role";

grant truncate on table "public"."repositories" to "service_role";

grant update on table "public"."repositories" to "service_role";

grant delete on table "public"."test_cases" to "anon";

grant insert on table "public"."test_cases" to "anon";

grant references on table "public"."test_cases" to "anon";

grant select on table "public"."test_cases" to "anon";

grant trigger on table "public"."test_cases" to "anon";

grant truncate on table "public"."test_cases" to "anon";

grant update on table "public"."test_cases" to "anon";

grant delete on table "public"."test_cases" to "authenticated";

grant insert on table "public"."test_cases" to "authenticated";

grant references on table "public"."test_cases" to "authenticated";

grant select on table "public"."test_cases" to "authenticated";

grant trigger on table "public"."test_cases" to "authenticated";

grant truncate on table "public"."test_cases" to "authenticated";

grant update on table "public"."test_cases" to "authenticated";

grant delete on table "public"."test_cases" to "service_role";

grant insert on table "public"."test_cases" to "service_role";

grant references on table "public"."test_cases" to "service_role";

grant select on table "public"."test_cases" to "service_role";

grant trigger on table "public"."test_cases" to "service_role";

grant truncate on table "public"."test_cases" to "service_role";

grant update on table "public"."test_cases" to "service_role";

grant delete on table "public"."test_cases_versions" to "anon";

grant insert on table "public"."test_cases_versions" to "anon";

grant references on table "public"."test_cases_versions" to "anon";

grant select on table "public"."test_cases_versions" to "anon";

grant trigger on table "public"."test_cases_versions" to "anon";

grant truncate on table "public"."test_cases_versions" to "anon";

grant update on table "public"."test_cases_versions" to "anon";

grant delete on table "public"."test_cases_versions" to "authenticated";

grant insert on table "public"."test_cases_versions" to "authenticated";

grant references on table "public"."test_cases_versions" to "authenticated";

grant select on table "public"."test_cases_versions" to "authenticated";

grant trigger on table "public"."test_cases_versions" to "authenticated";

grant truncate on table "public"."test_cases_versions" to "authenticated";

grant update on table "public"."test_cases_versions" to "authenticated";

grant delete on table "public"."test_cases_versions" to "service_role";

grant insert on table "public"."test_cases_versions" to "service_role";

grant references on table "public"."test_cases_versions" to "service_role";

grant select on table "public"."test_cases_versions" to "service_role";

grant trigger on table "public"."test_cases_versions" to "service_role";

grant truncate on table "public"."test_cases_versions" to "service_role";

grant update on table "public"."test_cases_versions" to "service_role";

grant delete on table "public"."test_file_versions" to "anon";

grant insert on table "public"."test_file_versions" to "anon";

grant references on table "public"."test_file_versions" to "anon";

grant select on table "public"."test_file_versions" to "anon";

grant trigger on table "public"."test_file_versions" to "anon";

grant truncate on table "public"."test_file_versions" to "anon";

grant update on table "public"."test_file_versions" to "anon";

grant delete on table "public"."test_file_versions" to "authenticated";

grant insert on table "public"."test_file_versions" to "authenticated";

grant references on table "public"."test_file_versions" to "authenticated";

grant select on table "public"."test_file_versions" to "authenticated";

grant trigger on table "public"."test_file_versions" to "authenticated";

grant truncate on table "public"."test_file_versions" to "authenticated";

grant update on table "public"."test_file_versions" to "authenticated";

grant delete on table "public"."test_file_versions" to "service_role";

grant insert on table "public"."test_file_versions" to "service_role";

grant references on table "public"."test_file_versions" to "service_role";

grant select on table "public"."test_file_versions" to "service_role";

grant trigger on table "public"."test_file_versions" to "service_role";

grant truncate on table "public"."test_file_versions" to "service_role";

grant update on table "public"."test_file_versions" to "service_role";

grant delete on table "public"."test_files" to "anon";

grant insert on table "public"."test_files" to "anon";

grant references on table "public"."test_files" to "anon";

grant select on table "public"."test_files" to "anon";

grant trigger on table "public"."test_files" to "anon";

grant truncate on table "public"."test_files" to "anon";

grant update on table "public"."test_files" to "anon";

grant delete on table "public"."test_files" to "authenticated";

grant insert on table "public"."test_files" to "authenticated";

grant references on table "public"."test_files" to "authenticated";

grant select on table "public"."test_files" to "authenticated";

grant trigger on table "public"."test_files" to "authenticated";

grant truncate on table "public"."test_files" to "authenticated";

grant update on table "public"."test_files" to "authenticated";

grant delete on table "public"."test_files" to "service_role";

grant insert on table "public"."test_files" to "service_role";

grant references on table "public"."test_files" to "service_role";

grant select on table "public"."test_files" to "service_role";

grant trigger on table "public"."test_files" to "service_role";

grant truncate on table "public"."test_files" to "service_role";

grant update on table "public"."test_files" to "service_role";

grant delete on table "public"."test_libraries" to "anon";

grant insert on table "public"."test_libraries" to "anon";

grant references on table "public"."test_libraries" to "anon";

grant select on table "public"."test_libraries" to "anon";

grant trigger on table "public"."test_libraries" to "anon";

grant truncate on table "public"."test_libraries" to "anon";

grant update on table "public"."test_libraries" to "anon";

grant delete on table "public"."test_libraries" to "authenticated";

grant insert on table "public"."test_libraries" to "authenticated";

grant references on table "public"."test_libraries" to "authenticated";

grant select on table "public"."test_libraries" to "authenticated";

grant trigger on table "public"."test_libraries" to "authenticated";

grant truncate on table "public"."test_libraries" to "authenticated";

grant update on table "public"."test_libraries" to "authenticated";

grant delete on table "public"."test_libraries" to "service_role";

grant insert on table "public"."test_libraries" to "service_role";

grant references on table "public"."test_libraries" to "service_role";

grant select on table "public"."test_libraries" to "service_role";

grant trigger on table "public"."test_libraries" to "service_role";

grant truncate on table "public"."test_libraries" to "service_role";

grant update on table "public"."test_libraries" to "service_role";

alter table "public"."users" alter column "display_name" drop not null;
