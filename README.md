While building this Smart Bookmark app, I encountered several common issues that usually occur in real-world Next.js and Supabase projects. Below are the key challenges and how I resolved them:

1 : Initially, after logging in with Google, the app kept refreshing or redirecting back to the login page.
This happened because the redirect URLs were not correctly configured in Supabase and Google Cloud.

I added the correct redirect URLs in:

Supabase → Authentication → URL Configuration

Google Cloud → OAuth redirect settings

After this, login worked correctly and redirected to the dashboard

2 : The app failed to connect to Supabase because environment variables were not being detected.

I created a .env.local file in the project root and added:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

Then restarted the Next.js server to load them.

3: When adding or deleting bookmarks, changes were visible only after refreshing the page.

I enabled Supabase Realtime and subscribed to database changes using:

postgres_changes

Supabase channel subscription

This allowed instant UI updates across multiple tabs.

4 : During deployment, Vercel initially showed the default Next.js page instead of the login page.
