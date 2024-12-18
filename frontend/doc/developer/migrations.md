# Creating Migrations

While customizing the CRM, you will probably need to update the database schema. You can do this using [Supabase migrations](https://supabase.com/docs/reference/cli/supabase-migration-new).

## Creating Migrations Locally

You can create a new migration locally using the following command:

```sh
npx supabase migration new <migration_name>
```

This will create a new migration file in the `supabase/migrations` directory. You can then update this file with the necessary changes to the database schema.

Then, apply the migrations locally using the following command:

```sh
npx supabase migration up
```

When you are ready to apply the migrations to the remote Supabase instance, push the migrations using the following command:

```sh
npx supabase db push
```

## Alternative: Creating Migrations Remotely

You can also change the schema using the Supabase Dashboard.

When it's done, generate a new migration file based on the new schema using the following command:

```sh
npx supabase db diff | npx supabase migration new <migration_name>
```

Then, apply the migrations locally using the following command:

```sh
npx supabase migration up
```

## Updating The Import Feature

From the frontend UI, users can import contacts and companies via a csv file.

If you change the data structure for a contact, don't forget to modify the sample CSV file located at `src/contacts/contacts_export.csv`. You'll also need to modify the import function found in `src/contacts/useContactImport.tsx`.
