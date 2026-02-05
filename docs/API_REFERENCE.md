# API Reference (for V2 reuse)

Use these exact endpoints and shapes in the Next.js v2 app. Base URL: dev = relative `/api` (proxy to backend); prod = `VITE_BACKEND_URL` or `https://api.bedieningenprofiel.nl` (no trailing slash). All requests: `credentials: "include"`.

---

## Auth & user

| Method | Path | Body / query | Notes |
|--------|------|--------------|--------|
| GET | `/api/user` | — | Current user; 401 = not logged in |
| POST | `/api/login` | `{ email, password }` | Returns user |
| POST | `/api/register` | `{ firstName, lastName, email, password, ... }` | Optional: birthDate, country, city, currentSector, preferredSector, referralSource, isTeamLeader, inviteCode, role, denomination, churchName, churchLocation |
| POST | `/api/logout` | — | |
| GET | `/api/verify-email` | `?token=` | |
| POST | `/api/resend-verification` | `{ email }` | |
| PATCH | `/api/user/profile` | Profile fields | |
| DELETE | `/api/users/delete-user` | — | |
| POST | `/api/forgot-password` | `{ email }` | |
| POST | `/api/reset-password` | `{ newPassword, token }` | |

---

## User profile & results

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/users/:id/profile` | User profile + role scores |
| GET | `/api/user/results` | Current user results |
| GET | `/api/users/:id/export` | User report (e.g. PDF) |

---

## Questionnaire

| Method | Path | Body | Notes |
|--------|------|------|--------|
| GET | `/api/questionnaire` | — | Returns questions (e.g. questions[] with id, statementA, statementB) |
| POST | `/api/questionnaire/start` | — | Returns { id, answers? } |
| POST | `/api/questionnaire/:userAnswerId/answers` | `{ answers: [{ questionId, value }], completed: boolean }` | value 0–6 |

---

## Guest questionnaire

| Method | Path | Body |
|--------|------|------|
| POST | `/api/profile/submit-guest/:inviteCode` | Guest profile + answers |

---

## Teams

| Method | Path | Body |
|--------|------|------|
| GET | `/api/users/:id/teams` | — |
| GET | `/api/user/teams` | — |
| GET | `/api/teams/by-invite/:inviteCode` | — |
| GET | `/api/teams/:id/members` | — |
| GET | `/api/teams/:id/results` | — |
| GET | `/api/teams/:id/export` | — |
| POST | `/api/teams` | `{ name, ... }` |
| POST | `/api/teams/join/:inviteCode` | — |
| POST | `/api/teams/:id/add-member` | `{ userId }` (or as backend expects) |

---

## Churches

| Method | Path | Body / query |
|--------|------|--------------|
| GET | `/api/churches/my` | — |
| GET | `/api/churches/my-churches` | — |
| GET | `/api/churches/by-invite/:inviteCode` | — |
| GET | `/api/churches/stats` | `?churchId=` |
| GET | `/api/churches/:id/dashboard` | — |
| GET | `/api/churches/:id/members` | — |
| GET | `/api/churches/:id/logo` | — |
| POST | `/api/churches` | Create payload |
| PATCH | `/api/churches/:id` | Update payload |
| POST | `/api/churches/join/:inviteCode` | — |
| POST | `/api/churches/:id/generate-invite-code` | — |
| DELETE | `/api/churches/:id/members/:userId` | — |

---

## Subscription

| Method | Path | Body |
|--------|------|------|
| GET | `/api/subscription/status` | — |
| POST | `/api/subscription/create-checkout-session` | e.g. { planId, ... } |

---

## Upload

| Method | Path | Body |
|--------|------|------|
| POST | `/api/upload/profile` | FormData (file) |

---

## Recommendations (if used)

| Method | Path |
|--------|------|
| GET | `/api/users/:id/recommendations` | |

---

When implementing v2, keep these paths and shapes unchanged. See **docs/V2_MIGRATION_GUIDE.md** for logic and Cursor prompts.
