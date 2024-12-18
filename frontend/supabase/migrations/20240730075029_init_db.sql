create table "public"."patientMessages" (
    "id" bigint generated by default as identity not null,
    "patient_id" bigint not null,
    "text" text,
    "date" timestamp with time zone default now(),
    "dentist_id" bigint,
    "status" text,
    "attachments" jsonb[]
);

alter table "public"."patientMessages" enable row level security;

create table "public"."patients" (
    "id" bigint generated by default as identity not null,
    "first_name" text,
    "last_name" text,
    "email" text,
    "phone_number" text,
    "smile_goals" text,
    "first_seen" timestamp with time zone,
    "last_seen" timestamp with time zone,
    "category": text,
    "stage" text,
    "tags" bigint[],
    "dentist_id" bigint,
);

alter table "public"."patients" enable row level security;

create table "public"."consultNotes" (
    "id" bigint generated by default as identity not null,
    "consult_id" bigint not null,
    "type" text,
    "text" text,
    "date" timestamp with time zone default now(),
    "dentist_id" bigint,
    "attachments" jsonb[]
);

alter table "public"."consultNotes" enable row level security;

create table "public"."consults" (
    "id" bigint generated by default as identity not null,
    "contact_id" bigint,
    "category" text,
    "description" text,
    "amount" bigint,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "archived_at" timestamp with time zone default null,
    "expected_visit_date" timestamp with time zone default null,
    "dentist_id" bigint,
    "index" smallint
);


alter table "public"."consults" enable row level security;

create table "public"."dentists" (
    "id" bigint generated by default as identity not null,
    "first_name" text not null,
    "last_name" text not null,
    "email" text not null,
    "administrator" boolean not null,
    "user_id" uuid not null,
    "avatar" jsonb,
    "disabled" boolean not null default FALSE
);


alter table "public"."dentists" enable row level security;

create table "public"."tags" (
    "id" bigint generated by default as identity not null,
    "name" text not null,
    "color" text not null
);


alter table "public"."tags" enable row level security;

create table "public"."tasks" (
    "id" bigint generated by default as identity not null,
    "patient_id" bigint not null,
    "type" text,
    "text" text,
    "due_date" timestamp with time zone not null,
    "done_date" timestamp with time zone
);


alter table "public"."tasks" enable row level security;

CREATE UNIQUE INDEX "patientMessages_pkey" ON public."patientMessages" USING btree (id);

CREATE UNIQUE INDEX patients_pkey ON public.patients USING btree (id);

CREATE UNIQUE INDEX "consultNotes_pkey" ON public."consultNotes" USING btree (id);

CREATE UNIQUE INDEX consults_pkey ON public.consults USING btree (id);

CREATE UNIQUE INDEX dentists_pkey ON public.dentists USING btree (id);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);

alter table "public"."patientMessages" add constraint "patientMessages_pkey" PRIMARY KEY using index "patientMessages_pkey";

alter table "public"."patients" add constraint "patients_pkey" PRIMARY KEY using index "patients_pkey";

alter table "public"."consultNotes" add constraint "consultNotes_pkey" PRIMARY KEY using index "consultNotes_pkey";

alter table "public"."consults" add constraint "consults_pkey" PRIMARY KEY using index "consults_pkey";

alter table "public"."dentists" add constraint "dentists_pkey" PRIMARY KEY using index "dentists_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."tasks" add constraint "tasks_pkey" PRIMARY KEY using index "tasks_pkey";

alter table "public"."patientMessages" add constraint "patientMessages_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES patients(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."patientMessages" validate constraint "patientMessages_patient_id_fkey";

alter table "public"."patientMessages" add constraint "patientMessages_dentist_id_fkey" FOREIGN KEY (dentist_id) REFERENCES dentists(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."patientMessages" validate constraint "patientMessages_dentist_id_fkey";

alter table "public"."patients" add constraint "patients_dentist_id_fkey" FOREIGN KEY (dentist_id) REFERENCES dentists(id) not valid;

alter table "public"."patients" validate constraint "patients_dentist_id_fkey";

alter table "public"."consultNotes" add constraint "consultNotes_consult_id_fkey" FOREIGN KEY (consult_id) REFERENCES consults(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."consultNotes" validate constraint "consultNotes_consult_id_fkey";

alter table "public"."consultNotes" add constraint "consultNotes_dentist_id_fkey" FOREIGN KEY (dentist_id) REFERENCES dentists(id) not valid;

alter table "public"."consultNotes" validate constraint "consultNotes_dentist_id_fkey";

alter table "public"."consults" add constraint "consults_dentist_id_fkey" FOREIGN KEY (dentist_id) REFERENCES dentists(id) not valid;

alter table "public"."consults" validate constraint "consults_dentist_id_fkey";

alter table "public"."dentists" add constraint "dentists_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."dentists" validate constraint "dentists_user_id_fkey";

alter table "public"."tasks" add constraint "tasks_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES patients(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tasks" validate constraint "tasks_patient_id_fkey";

set check_function_bodies = off;

grant delete on table "public"."patientMessages" to "authenticated";
grant insert on table "public"."patientMessages" to "authenticated";
grant select on table "public"."patientMessages" to "authenticated";
grant update on table "public"."patientMessages" to "authenticated";

grant delete on table "public"."patientMessages" to "service_role";
grant insert on table "public"."patientMessages" to "service_role";
grant references on table "public"."patientMessages" to "service_role";
grant select on table "public"."patientMessages" to "service_role";
grant trigger on table "public"."patientMessages" to "service_role";
grant truncate on table "public"."patientMessages" to "service_role";
grant update on table "public"."patientMessages" to "service_role";

grant delete on table "public"."patients" to "authenticated";
grant insert on table "public"."patients" to "authenticated";
grant select on table "public"."patients" to "authenticated";
grant update on table "public"."patients" to "authenticated";

grant delete on table "public"."patients" to "service_role";
grant insert on table "public"."patients" to "service_role";
grant references on table "public"."patients" to "service_role";
grant select on table "public"."patients" to "service_role";
grant trigger on table "public"."patients" to "service_role";
grant truncate on table "public"."patients" to "service_role";
grant update on table "public"."patients" to "service_role";

grant delete on table "public"."patientMessages" to "authenticated";
grant insert on table "public"."patientMessages" to "authenticated";
grant select on table "public"."patientMessages" to "authenticated";
grant update on table "public"."patientMessages" to "authenticated";

grant delete on table "public"."patientMessages" to "service_role";
grant insert on table "public"."patientMessages" to "service_role";
grant references on table "public"."patientMessages" to "service_role";
grant select on table "public"."patientMessages" to "service_role";
grant trigger on table "public"."patientMessages" to "service_role";
grant truncate on table "public"."patientMessages" to "service_role";
grant update on table "public"."patientMessages" to "service_role";


grant delete on table "public"."consults" to "authenticated";
grant insert on table "public"."consults" to "authenticated";
grant select on table "public"."consults" to "authenticated";
grant update on table "public"."consults" to "authenticated";

grant delete on table "public"."consults" to "service_role";
grant insert on table "public"."consults" to "service_role";
grant references on table "public"."consults" to "service_role";
grant select on table "public"."consults" to "service_role";
grant trigger on table "public"."consults" to "service_role";
grant truncate on table "public"."consults" to "service_role";
grant update on table "public"."consults" to "service_role";

grant delete on table "public"."dentists" to "authenticated";
grant insert on table "public"."dentists" to "authenticated";
grant select on table "public"."dentists" to "authenticated";
grant update on table "public"."dentists" to "authenticated";

grant delete on table "public"."dentists" to "service_role";
grant insert on table "public"."dentists" to "service_role";
grant references on table "public"."dentists" to "service_role";
grant select on table "public"."dentists" to "service_role";
grant trigger on table "public"."dentists" to "service_role";
grant truncate on table "public"."dentists" to "service_role";
grant update on table "public"."dentists" to "service_role";

grant delete on table "public"."tags" to "authenticated";
grant insert on table "public"."tags" to "authenticated";
grant select on table "public"."tags" to "authenticated";
grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";
grant insert on table "public"."tags" to "service_role";
grant references on table "public"."tags" to "service_role";
grant select on table "public"."tags" to "service_role";
grant trigger on table "public"."tags" to "service_role";
grant truncate on table "public"."tags" to "service_role";
grant update on table "public"."tags" to "service_role";

grant delete on table "public"."tasks" to "authenticated";
grant insert on table "public"."tasks" to "authenticated";
grant select on table "public"."tasks" to "authenticated";
grant update on table "public"."tasks" to "authenticated";

grant delete on table "public"."tasks" to "service_role";
grant insert on table "public"."tasks" to "service_role";
grant references on table "public"."tasks" to "service_role";
grant select on table "public"."tasks" to "service_role";
grant trigger on table "public"."tasks" to "service_role";
grant truncate on table "public"."tasks" to "service_role";
grant update on table "public"."tasks" to "service_role";


create policy "Enable insert for authenticated users only"
on "public"."patientMessages"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users"
on "public"."patientMessages"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."patients"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users"
on "public"."patients"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."patients"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."patientMessages"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users"
on "public"."patientMessages"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."consults"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users"
on "public"."consults"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."consults"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."dentists"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable update for authenticated users only"
on "public"."dentists"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable read access for authenticated users"
on "public"."dentists"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."tags"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users"
on "public"."tags"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."tasks"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users"
on "public"."tasks"
as permissive
for select
to authenticated
using (true);


create policy "Patient Messages Delete Policy"
on "public"."patientMessages"
as permissive
for delete
to authenticated
using (true);


create policy "Patient Messages Update policy"
on "public"."patientMessages"
as permissive
for update
to authenticated
using (true);


create policy "Patient Delete Policy"
on "public"."patients"
as permissive
for delete
to authenticated
using (true);


create policy "Consult Notes Delete Policy"
on "public"."consultNotes"
as permissive
for delete
to authenticated
using (true);


create policy "Consult Notes Update Policy"
on "public"."consultNotes"
as permissive
for update
to authenticated
using (true);


create policy "Consults Delete Policy"
on "public"."consults"
as permissive
for delete
to authenticated
using (true);


create policy "Task Delete Policy"
on "public"."tasks"
as permissive
for delete
to authenticated
using (true);


create policy "Task Update Policy"
on "public"."tasks"
as permissive
for update
to authenticated
using (true);


-- Use Postgres to create a bucket.

insert into storage.buckets
  (id, name, public)
values
  ('attachments', 'attachments', true);

CREATE POLICY "Attachments 1mt4rzk_0" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'attachments');
CREATE POLICY "Attachments 1mt4rzk_1" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'attachments');
CREATE POLICY "Attachments 1mt4rzk_3" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'attachments');

-- Use Postgres to create views for contacts.

create view "public"."consults_summary"
    with (security_invoker=on)
    as
select
    p.*,
    c.*,
    count(distinct c.id) as nb_consults
from
    "public"."patients" p
left join
    "public"."consults" c on p.id = c.patient_id
group by
    p.id;



-- Use Postgres to create views for contacts.

create view "public"."tasks_summary"
    with (security_invoker=on)
    as
select
    p.*,
    t.*,
    count(distinct t.id) as nb_tasks
from
    "public"."patients" p
left join
    "public"."tasks" t on p.id = t.patient_id
group by
    p.id;


