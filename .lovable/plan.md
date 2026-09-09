# Admin page: see everyone who signed up

Your sign-ups are being saved — there are 8 accounts, including yours. The app just has no screen that shows them, because each person can only see their own details by design. This adds a private admin screen for you.

## What you'll get

- A new page at `/admin`, reachable only when you are signed in as livegigltd@gmail.com.
- A table of everyone who has signed up: first name, last name, email, date joined, last sign-in.
- A total count at the top, newest sign-ups first, plus a simple search box to filter by name or email.
- Anyone else who tries to open the page sees "Not authorised" and is sent back to their dashboard.
- A discreet "Admin" link in the header, shown only to you.

## How access is controlled

Admin status is stored in the backend, not in the browser, so it cannot be faked by editing the page. Your account is marked as the admin; more admins can be added later without code changes.

## Technical details

- New `app_role` enum (`admin`, `user`) and `user_roles` table (`user_id`, `role`), with grants, RLS enabled, and a policy letting users read their own roles.
- `has_role(_user_id uuid, _role app_role)` security-definer function to avoid recursive RLS.
- Seed row granting `admin` to user `8d756494-841b-45ea-865b-45a9475d947e` (livegigltd@gmail.com).
- `admin_list_users()` security-definer function returning id, email, first_name, last_name, created_at, last_sign_in_at by joining `auth.users` with `profiles`; it raises an exception unless `has_role(auth.uid(), 'admin')`. Needed because emails live in the auth schema and are not client-readable. Execute granted to `authenticated` only.
- New `src/pages/Admin.tsx` using the existing glass-card styling, route added in `App.tsx`, and an `useIsAdmin` check used by both the page guard and the header link.
