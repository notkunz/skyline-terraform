# Skyline staff admin setup

The admin uses Supabase email/password authentication, a Postgres staff table, and a private `staff-photos` Storage bucket. The browser receives only the project URL and publishable/anon key. Never put a service-role key or an administrator password in this website.

## Configure the project

1. The existing project URL and publishable key are in `supabase-config.js`. Set `adminEmail` there to the email address of a user in this project's **Authentication > Users** list. Your Google/GitHub login to the Supabase dashboard is not automatically an app user. The visible sign-in username defaults to `kunz`; change `adminUsername` in the same file if needed.
2. In **Authentication > Providers > Email**, disable public sign-ups. The admin account must be created manually; do not enable public registration for this staff tool.
3. In **Authentication > Users**, create or prepare the authorized email/password user. Set or reset its password through Supabase's Auth flow/dashboard; the website never stores the password. Use a unique password and rotate any password shared in chat before public deployment.
4. Open the Supabase **SQL Editor** and run all of `supabase-setup.sql`. The script includes the currently configured administrator email (`fkunzy@gmail.com`) in the allowlist. It will stop with an error if that Auth user does not exist, so update that email inside the SQL to match `adminEmail` in `supabase-config.js` if needed.

```sql
insert into public.skyline_admins (user_id)
select id from auth.users where email = 'YOUR_ADMIN_EMAIL'
on conflict (user_id) do nothing;
```

The SQL creates the staff table, private image bucket, row/storage policies, and allowlists the configured admin. Only user IDs in `skyline_admins` can access staff data or photos. If you already ran the earlier SQL version, run the updated file again.

## Values needed to finish configuration

The project URL and publishable/anon key are already configured. To finish, provide the **administrator email address** associated with a user in this project's Authentication list. Do not provide a password or any service-role/secret key. The username alias is changed in `supabase-config.js`; the actual password is created or reset in Supabase Authentication, not in the website code.

Older staff entries saved in this browser are imported into Supabase after the first successful admin sign-in. Sign in from the footer's **Staff admin** link. Portraits remain private and use temporary signed URLs for the card preview and printing.
