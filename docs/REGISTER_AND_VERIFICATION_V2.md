# Register & Verification – Documentation for V2.0

This document describes the **registration flow**, **email verification flow**, **UI behavior**, **logic**, and **endpoints** so V2.0 can reuse them with a new design without breaking sync.

---

## 1. Endpoints

| Method | Path | Purpose |
|--------|------|--------|
| POST | `/api/register` | Create account; backend sends verification email. |
| GET | `/api/verify-email?token=<token>` | Verify email with link token. |
| POST | `/api/resend-verification` | Resend verification email. |
| GET | `/api/user` | Current session (used after verification; **disabled on verify page**). |

All requests must use **credentials: "include"** (cookies). Base URL: same as in docs/API_REFERENCE.md.

---

## 2. Register

### 2.1 Request body (RegisterData)

Send as JSON. **Required:**

- `firstName` (string, min 2)
- `lastName` (string, min 2)
- `email` (string, valid email)
- `password` (string, min 6)

**Optional:**

- `birthDate` (string, e.g. `yyyy-MM-dd`, or null)
- `country`, `city` (string | null)
- `currentSector`, `preferredSector` (string; required in current UI schema)
- `referralSource` (string | null)
- `isTeamLeader` (boolean, default false)
- `inviteCode` (string) – when joining via invite; if present, treat as member (not team leader)
- `role` – set to `"teamleader"` if isTeamLeader, else `"user"`
- `denomination`, `churchName`, `churchLocation` – required in UI when isTeamLeader

**Validation (client-side, for reference):**

- If `isTeamLeader` is true: require `denomination`, `churchName`, `churchLocation`.
- If user has invite code: force `isTeamLeader = false` and `role = "user"`.
- Terms acceptance: require acceptTerms === true (message: "Je moet akkoord gaan met de algemene voorwaarden en het privacybeleid").

### 2.2 Response and behavior

- **Success:** Backend creates user and sends verification email. Response may be the created user object or include a `message` (e.g. `"Verification code sent to email"` or `"E-mailadres bestaat al"`).
- **Sync after success:**
  1. Invalidate session: `queryClient.invalidateQueries({ queryKey: ["/api/user"] })`.
  2. Show toast: e.g. "Registratie succesvol! Controleer je e-mail voor de verificatielink om je account te activeren." (duration e.g. 5s).
  3. Redirect to auth with verify-email context so user can check email or request a new link:
     - Navigate to: `/auth?redirect=verify-email&email=<email>` when backend indicates verification was sent (e.g. message === "Verification code sent to email" or "E-mailadres bestaat al").
     - Use the **email from the registration payload** (or response) in the URL so the verify-email tab can show/prefill it; avoid relying only on React state to avoid stale closure.
- **Error:** Show toast with backend message. Special case: if message is "E-mailadres bestaat al", show "E-mailadres bestaat al" (and optionally redirect to verify-email with that email so they can request a new link).

### 2.3 UI / flow summary

- Form: tabs or steps for Login | Register (and Verify email, Forgot password, Reset password).
- Register form fields: firstName, lastName, email, password, birthDate, currentSector, preferredSector, referralSource, isTeamLeader (checkbox), optional denomination/churchName/churchLocation (when isTeamLeader), inviteCode (optional), acceptTerms (required checkbox).
- On submit: validate, then POST `/api/register` with the payload above. On success → toast + redirect to `/auth?redirect=verify-email&email=<email>`. On error → toast (and optionally redirect to verify-email for "email already exists").

---

## 3. Email verification

### 3.1 Verify page (link from email)

- **Route:** `/verify` with query `token=<token>` (e.g. `/verify?token=abc123`). Token may be URL-encoded; decode before use.
- **Session during verify:** Do **not** call GET `/api/user` while the user is on `/verify`. This avoids race conditions and 401 during verification. In the current app this is done with `enabled: !isOnVerifyPage()` on the session query, where `isOnVerifyPage()` is `pathname === "/verify"`.

**Flow:**

1. User lands on `/verify?token=...`.
2. If **no token:** redirect immediately to `/auth?activeTab=login` (replace).
3. If **token present:**  
   - **Optional:** Check sessionStorage for `verified:<token>` === `"true"`. If already verified, skip API call: invalidate `/api/user`, redirect to `/auth?activeTab=login`.  
   - Else call **GET** `/api/verify-email?token=<token>` (encode token in URL).
4. **On verify success:**  
   - Store in sessionStorage: `verified:<token>` = `"true"` (so refresh/link click doesn’t call API again).  
   - Invalidate queries for `["/api/user"]`.  
   - Toast: "E-mail geverifieerd!"  
   - Redirect to `/auth?activeTab=login` (replace).
5. **On verify error:**  
   - If sessionStorage already has this token as verified: treat as success (invalidate `/api/user`, redirect to login, no error toast).  
   - Else: show user-friendly error toast (see below), then redirect to `/auth?activeTab=login` (replace).

**Duplicate calls:** Ensure the verify API is only called once per token (e.g. ref or flag so that after the first mutate you don’t call again on re-render).

**User-facing errors:** Map backend errors to short Dutch messages, e.g.:

- 404 or "User not found" → "Gebruiker niet gevonden. Neem contact op met de beheerder."
- "Missing token" → "Verificatietoken ontbreekt. Controleer de link en probeer het opnieuw."
- 400 / invalid / expired → "De verificatielink is ongeldig of verlopen. Log in om een nieuwe link aan te vragen."

Then redirect to `/auth?activeTab=login`.

### 3.2 Resend verification

- **Endpoint:** POST `/api/resend-verification`  
- **Body:** `{ email: string }` (trimmed, required).
- **Validation:** Non-empty email; valid email format. If invalid, show toast and do not call API.
- **On success:**  
  - Toast with backend `message` or "Verificatietepost is verzonden".  
  - Backend may return a new `code` (token). If so, store it (e.g. in state) and show a link: `/verify?token=<code>` so the user can open the link without checking email (e.g. "Klik hier als je de verificatielink niet hebt ontvangen").
- **On error:** Toast with backend message or "Verificatiemail is niet verzonden". If backend returns 400 with a JSON `message`, parse and show that.

---

## 4. Auth page URL params and tabs

V2 should respect these so register and verification stay in sync:

| Param | Purpose |
|-------|--------|
| `activeTab` | Which tab to show: `login` \| `register` \| `verify-email` \| `forgot-password` \| `reset-password` |
| `redirect` | Context: `verify-email` \| `forgot-password` \| `reset-password` or path to go after login |
| `email` | Prefill or context for verify-email (and resend). Set after register: `?redirect=verify-email&email=...` |
| `token` | For reset password; used in reset form |

**Tab selection rules (priority):**

1. If `redirect=verify-email` or `email` is present → show **verify-email** tab.
2. Else if `redirect=forgot-password` and `forgot-password-email` present → show **forgot-password** tab.
3. Else if `redirect=reset-password` and `token` present → show **reset-password** tab.
4. Else if `activeTab` is set (e.g. `activeTab=login` after verification) → use it.
5. Default can be `register` or `login` depending on product choice.

**After verification:** Redirect to `/auth?activeTab=login` so the user lands on login, not register.

**When user is already logged in:** If GET `/api/user` returns a user, redirect to home (or `redirect` path), but **do not** redirect when `redirect` is `verify` or `reset-password` (so those flows can finish).

---

## 5. Verify-email tab on auth page

Two variants:

**A) User has `email` in URL (e.g. from register redirect)**  
- Show: "Controleer je inbox", short text that a verification link was sent.  
- Button: "Verificatielink opnieuw verzenden" → call resend with URL `email` (or prefill).  
- If backend returns a new token/code, show link: "Klik [hier](/verify?token=...)" to open verify page.

**B) No email in URL (user opened "Account verifiëren?" manually)**  
- Form: single field **email**.  
- Submit → same as "Verificatielink opnieuw verzenden" (call resend with that email).  
- On success, if backend returns a token/code, show the same "Klik hier" link to `/verify?token=...`.

Link to verify must open in same tab or new tab consistently (current app uses `target="_blank"` for the "hier" link; either way, ensure token is in the URL).

---

## 6. Session and query sync (no breaking)

- **Default:** Session is loaded with GET `/api/user` (e.g. React Query with `queryKey: ["/api/user"]`, `credentials: "include"`, 401 → treat as not logged in).
- **On verify page:** Disable this query (`enabled: false` when pathname is `/verify`) so verification is not disturbed.
- **After register:** Invalidate `["/api/user"]` (no need to set data; user is not logged in until they verify and log in).
- **After verify success (or already verified):** Invalidate `["/api/user"]` then redirect to login so that when they log in, a fresh session is fetched.
- **After login:** Set or invalidate so `["/api/user"]` holds the user; then redirect by role as in V2_MIGRATION_GUIDE.

This keeps register → verify → login in sync without double-fetches or 401s on the verify page.

---

## 7. V2 checklist (register + verification)

- [ ] **Register:** POST `/api/register` with same body shape; handle success (toast + redirect to `/auth?redirect=verify-email&email=<email>`); handle "email already exists" and optional redirect to verify-email.
- [ ] **Verify page:** Route `/verify?token=...`; no GET `/api/user` while on `/verify`; GET `/api/verify-email?token=...` once per token; sessionStorage for `verified:<token>` to avoid duplicate calls and show success on refresh; on success/error redirect to `/auth?activeTab=login`; user-friendly error messages.
- [ ] **Resend:** POST `/api/resend-verification` with `{ email }`; validate email; show link to `/verify?token=<code>` when backend returns a code.
- [ ] **Auth URL params:** Support `activeTab`, `redirect`, `email`, `token` and set tab from them (verify-email when redirect=verify-email or email present; login when activeTab=login after verify).
- [ ] **Verify-email tab:** Two variants (with email from URL vs form); resend button and optional "open link" when code is returned.
- [ ] **No redirect when already logged in** if redirect is `verify` or `reset-password`.

---

## 8. File reference (current app)

| Purpose | File |
|--------|------|
| Register/verify/resend logic, session query, disable on verify page | `client/src/hooks/use-auth.tsx` |
| Auth page: tabs, register form, verify-email tab, URL param handling | `client/src/pages/auth-page.tsx` |
| Verify page: token from URL, single verify call, redirect to auth | `client/src/pages/verify.tsx` |
| Register schema (zod), constants (sectors, denominations) | `client/src/pages/auth-page.tsx`, `shared/schema.ts` |

Using this document together with **docs/API_REFERENCE.md** and **docs/V2_MIGRATION_GUIDE.md** will keep the V2 register and verification UI, logic, and endpoints in sync without breaking the flow.
