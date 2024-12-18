# Inbound Email Configuration

Atomic CRM can receive inbound emails and automatically create or update contacts based on the email content. This feature is useful to keep your CRM up-to-date with the latest interactions with your contacts.

Atomic CRM uses [Postmark](https://postmarkapp.com/) to receive and process inbound emails.

## Postmark Setup

You can use an existing Postmark account or [create a new one](https://account.postmarkapp.com/sign_up). The free tier allows you to send or receive up to 100 emails per month.

To enable inbound email features, you need to create a webhook in Postmark.

1. Go to your [Postmark account](https://account.postmarkapp.com/)
2. Select your **server** (e.g. _My First Server_)
3. Select the **Inbound Stream** (e.g. _Default Inbound Stream_)
4. Go to the **Setup Instructions** tab
5. Get your **server’s inbound email address** (xxxxxxx@inbound.postmarkapp.com)
6. Set your **server’s inbound webhook URL**: `https://<user>:<password>@<project_id>.supabase.co/functions/v1/postmark` (e.g. https://user:pwd@xxxxxxx.supabase.co/functions/v1/postmark)
7. **Save changes**. That's it for the Postmark setup!

> **Note**: The webhook URL includes 3 important pieces:
> - `<user>` and `<password>` are credentials you need to choose to secure the webhook. Please note them down as you will need them in the next step.
> - `<project_id>` is the Supabase project's `SUPABASE_PROJECT_ID`

> **Note**: The server’s inbound email address can be customized by registering a domain to your Postmark account.

## Supabase Setup

Atomic CRM uses a Supabase Edge Function to handle the webhook and process the received emails. You need to configure your Supabase project to handle the incoming requests.

In a terminal, after [linking your Supabase project](./dev-01-supabase-configuration.md#using-an-existing-remote-supabase-instance), run the following commands:

```sh
npx supabase secrets set POSTMARK_WEBHOOK_USER=<user>
npx supabase secrets set POSTMARK_WEBHOOK_PASSWORD=<password>
npx supabase secrets set POSTMARK_WEBHOOK_AUTHORIZED_IPS=<comma-separated list of IPs>
```

These commands will push the secrets to your remote Supabase project.

> **Note:** The list of authorized Postmark IPs can be found in the [Postmark support pages](https://postmarkapp.com/support/article/800-ips-for-firewalls#webhooks).

If you are using this repository's GitHub Actions to automatically deploy to your Supabase instance, you will need to set these secrets in your repository's settings.

```sh
POSTMARK_WEBHOOK_USER=<user>
POSTMARK_WEBHOOK_PASSWORD=<password>
POSTMARK_WEBHOOK_AUTHORIZED_IPS=<comma-separated list of IPs>
```

## Application Configuration

Store the Postmark inbound email address in a `.env` file at the root of the project, so that users can easily find it in the application.

```sh
VITE_INBOUND_EMAIL=xxxxxxxxxxx@inbound.postmarkapp.com
```

## Testing locally

To test inbound email features locally, you will need to do the following:

1. Start the Supabase Edge Functions locally: `make start-supabase-functions`
2. Open your local Supabase instance for public access, e.g. using [ngrok](https://ngrok.com/): `ngrok http 54321`
3. Configure your Postmark server's inbound webhook URL to point to your ngrok URL: `https://testuser:testpwd@<ngrok-url>/functions/v1/postmark` (e.g. https://testuser:testpwd@xxxxxxx.ngrok-free.app/functions/v1/postmark)
4. Send an email to your Postmark server's inbound email address
