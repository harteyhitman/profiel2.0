# V2.0 Migration Guide: APIs, Logic & Endpoints

This document describes the **APIs, endpoints, and business logic** used in the current Frontend (Vite + React) so they can be reused exactly in **version 2.0** (Next.js + module SCSS). Keep the same request/response shapes and backend URLs.

---

## 1. API configuration

- **Base URL**
  - **Development:** Use relative URLs (e.g. `/api/user`) and proxy `/api` to the backend (e.g. `VITE_BACKEND_URL` or `http://localhost:5000`). No `/api` suffix on the base.
  - **Production:** `VITE_BACKEND_URL` or default `https://api.bedieningenprofiel.nl` (no trailing slash, no `/api` suffix).
- **All requests:** `credentials: "include"` (cookies).
- **JSON:** `Content-Type: application/json` for non–FormData bodies.
- **Errors:** Parse `res.ok`; on failure read body (JSON `message`/`error` or plain text) and throw with status and message.

Reference implementation: `client/src/lib/queryClient.ts` (`getApiBase`, `joinApiUrl`, `apiRequest`, `throwIfResNotOk`).

---

## 2. Complete API reference

See **docs/API_REFERENCE.md** for a compact table. Summary by domain:

### Auth & user

| Method | Path | Body / query | Purpose |
|--------|------|--------------|---------|
| GET | `/api/user` | — | Current user (session). 401 → unauthenticated. |
| POST | `/api/login` | `{ email, password }` | Login. Returns user. |
| POST | `/api/register` | See RegisterData below | Register. |
| POST | `/api/logout` | — | Logout. |
| GET | `/api/verify-email?token=...` | — | Verify email. |
| POST | `/api/resend-verification` | `{ email }` | Resend verification email. |
| PATCH | `/api/user/profile` | UpdateUserFormValues | Update current user profile. |
| DELETE | `/api/users/delete-user` | — | Delete current user. |
| POST | `/api/forgot-password` | `{ email }` | Forgot password. |
| POST | `/api/reset-password` | `{ newPassword, token }` | Reset password. |

**RegisterData:** `firstName`, `lastName`, `email`, `password`; optional: `birthDate`, `country`, `city`, `currentSector`, `preferredSector`, `referralSource`, `isTeamLeader`, `inviteCode`, `role`, `denomination`, `churchName`, `churchLocation`.

### User profile & results

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/users/:id/profile` | User profile (and role scores if any). |
| GET | `/api/user/results` | Current user’s results. |
| GET | `/api/users/:id/export` | Export user report (e.g. PDF). |

### Questionnaire

| Method | Path | Body | Purpose |
|--------|------|------|---------|
| GET | `/api/questionnaire` | — | List questions (e.g. `questions[]` with id, statementA, statementB). |
| POST | `/api/questionnaire/start` | — | Start session; returns `{ id, answers? }`. |
| POST | `/api/questionnaire/:userAnswerId/answers` | `{ answers: { questionId, value }[], completed: boolean }` | Submit answers; value 0–6. |

### Guest questionnaire

| Method | Path | Body | Purpose |
|--------|------|------|---------|
| POST | `/api/profile/submit-guest/:inviteCode` | Guest profile + answers | Submit guest questionnaire by invite code. |

### Teams

| Method | Path | Body | Purpose |
|--------|------|------|---------|
| GET | `/api/users/:id/teams` | — | Teams for user. |
| GET | `/api/user/teams` | — | Current user’s teams. |
| GET | `/api/teams/by-invite/:inviteCode` | — | Team by invite code. |
| GET | `/api/teams/:id/members` | — | Team members. |
| GET | `/api/teams/:id/results` | — | Team results. |
| GET | `/api/teams/:id/export` | — | Export team report. |
| POST | `/api/teams` | `{ name, ... }` | Create team. |
| POST | `/api/teams/join/:inviteCode` | — | Join team by invite. |
| POST | `/api/teams/:id/add-member` | `{ userId }` or similar | Add member to team. |

### Churches

| Method | Path | Body / query | Purpose |
|--------|------|--------------|---------|
| GET | `/api/churches/my` | — | Current user’s church. |
| GET | `/api/churches/my-churches` | — | Churches for current user. |
| GET | `/api/churches/by-invite/:inviteCode` | — | Church by invite code. |
| GET | `/api/churches/stats?churchId=` | — | Church stats. |
| GET | `/api/churches/:id/dashboard` | — | Church dashboard. |
| GET | `/api/churches/:id/members` | — | Church members. |
| GET | `/api/churches/:id/logo` | — | Church logo URL. |
| POST | `/api/churches` | Church create payload | Create church. |
| PATCH | `/api/churches/:id` | Church update payload | Update church. |
| POST | `/api/churches/join/:inviteCode` | — | Join church. |
| POST | `/api/churches/:id/generate-invite-code` | — | Generate invite code. |
| DELETE | `/api/churches/:id/members/:userId` | — | Remove member. |

### Subscription

| Method | Path | Body | Purpose |
|--------|------|------|---------|
| GET | `/api/subscription/status` | — | Current subscription status. |
| POST | `/api/subscription/create-checkout-session` | e.g. `{ planId, ... }` | Create checkout session. |

### Upload

| Method | Path | Body | Purpose |
|--------|------|------|---------|
| POST | `/api/upload/profile` | FormData (file) | Upload profile image. |

---

## 3. Core business logic to reuse

### 3.1 Auth flow

- **Session:** GET `/api/user` with `credentials: "include"`. 401 → treat as logged out.
- **Login:** POST `/api/login` → store/update user in client state; redirect by role (e.g. teamleader → teams, user with teamId → results, user → questionnaire).
- **Register:** POST `/api/register` → show “check email” message; optional redirect to verify tab with email in query.
- **Verify:** GET `/api/verify-email?token=...`; optional sessionStorage to avoid duplicate verify calls; then invalidate `/api/user` and redirect to login.
- **Resend verification:** POST `/api/resend-verification` with `{ email }`.
- **Profile update:** PATCH `/api/user/profile`; then invalidate `/api/user`.
- **Logout:** POST `/api/logout`; clear local user state.
- **Delete account:** DELETE `/api/users/delete-user`; then clear/invalidate user.
- **Forgot password:** POST `/api/forgot-password` with `{ email }`.
- **Reset password:** POST `/api/reset-password` with `{ newPassword, token }`.

Implementation reference: `client/src/hooks/use-auth.tsx`.

### 3.2 Questionnaire flow

1. GET `/api/questionnaire` → get questions.
2. POST `/api/questionnaire/start` → get `userAnswerId` (and existing `answers` if resuming).
3. For each batch or on complete: POST `/api/questionnaire/:userAnswerId/answers` with `{ answers: [{ questionId, value }], completed }`. Slider **value 0–6** (0–2 favor statement1, 3 neutral, 4–6 favor statement2).
4. On `completed: true`, invalidate `/api/user/results` and redirect to results/dashboard.

Implementation reference: `client/src/components/questionnaire/question-form.tsx`, `client/src/pages/QuestionnairePage.tsx`.

### 3.3 Questionnaire scoring (client-side)

- **Slider weights:** 0→5, 1→3, 2→1, 3→0, 4→1, 5→3, 6→5. Value 3 = neutral (no points).
- **Per question:** Points go to the role of the favored statement (statement1 vs statement2); max 5 points per question per role.
- **Totals:** Raw scores per role (e.g. 0–200 for 40 questions). Percentages = (roleScore / (questions × 5)) × 100.

Implementation: `client/src/utils/questionnaireScoring.ts` (e.g. `calculateScoresFromResponses`, `SLIDER_WEIGHTS`). See also `SCORING_SYSTEM.md`.

### 3.4 Role calculations (primary/secondary, profile type)

- Input: role scores (apostle, prophet, evangelist, herder, teacher).
- Output: primaryRole, secondaryRole, dominanceRatio, profileType (e.g. balanced / moderate / specialized).

Implementation: `client/src/utils/roleCalculations.ts` (e.g. `calculatePrimaryRole`). Uses `ROLES` from `shared/constants.ts`.

### 3.5 Join team / church

- Resolve invite: GET `/api/teams/by-invite/:code` or GET `/api/churches/by-invite/:code`.
- Join: POST `/api/teams/join/:code` or POST `/api/churches/join/:code`.

Implementation: `client/src/hooks/useJoinTeamOrChurch.tsx`, `client/src/pages/join-team-page.tsx`.

### 3.6 Home redirect logic

After auth load:

- Team leader → `/teams` (or team dashboard).
- User with `teamId` → `/results`.
- User without team → `/questionnaire`.

Reference: `client/src/App.tsx` (e.g. `HomeRedirector`).

---

## 4. Shared types and constants

- **Schema / DB shapes:** `shared/schema.ts` (users, teams, churches, roleScores, teamMembers, insertUserSchema, etc.).
- **Types:** `shared/types.ts` (Role, SubscriptionPlan, QuestionResponse, RoleResults, TeamMember).
- **Constants:** `shared/constants.ts` (ROLES, ROLE_LABELS, ROLE_COLORS, ROLE_DESCRIPTIONS, SUBSCRIPTION_PLANS, PLAN_LIMITS, COUNTRIES, CITIES_BY_COUNTRY, QUESTIONS for the 40 statements).
- **Questionnaire questions:** The 40 questions with statement1/statement2 and roles live in `shared/constants.ts` (QUESTIONS). API questionnaire may use different keys (e.g. statementA/statementB); map as in current app.

Use the same enums and question set in v2 so results stay consistent.

---

## 5. Cursor prompts for V2 implementation

Copy-paste these into Cursor when implementing each area in the Next.js v2 app.

### API client

```
Implement the API client for our Next.js app. Use the same contract as the current app:
- Base URL: in dev use relative /api and proxy to backend (see docs/V2_MIGRATION_GUIDE.md); in prod use env BACKEND_URL or https://api.bedieningenprofiel.nl (no trailing slash, no /api suffix).
- All requests: credentials "include", JSON Content-Type for non-FormData.
- Expose a function like apiRequest(method, url, data?) that joins base + path, throws on !res.ok with parsed message.
- Use docs/API_REFERENCE.md for exact endpoints. Do not change paths or request/response shapes.
```

### Auth (login, register, session, verify, password)

```
Implement auth for Next.js v2 using the same endpoints as the current app:
- Session: GET /api/user with credentials include; 401 = logged out.
- Login: POST /api/login { email, password }; then update session and redirect by role (teamleader → teams, user with teamId → results, user → questionnaire).
- Register: POST /api/register (see RegisterData in docs/V2_MIGRATION_GUIDE.md); show “check email” and optionally redirect to verify tab.
- Verify: GET /api/verify-email?token=...; optionally skip if already verified in sessionStorage; then invalidate session and redirect to login.
- Resend verification: POST /api/resend-verification { email }.
- Profile: PATCH /api/user/profile; logout: POST /api/logout; delete: DELETE /api/users/delete-user.
- Forgot/reset: POST /api/forgot-password { email }; POST /api/reset-password { newPassword, token }.
Reference: docs/V2_MIGRATION_GUIDE.md and client/src/hooks/use-auth.tsx in the legacy repo.
```

### Questionnaire (start, submit, resume)

```
Implement the questionnaire flow in Next.js v2 using the same API and scoring:
- GET /api/questionnaire for questions; POST /api/questionnaire/start for userAnswerId (and existing answers); POST /api/questionnaire/:userAnswerId/answers with { answers: [{ questionId, value }], completed }. Slider value 0–6.
- On completed, invalidate user results and redirect to results/dashboard.
- Reuse the same scoring logic: slider weights 0→5,1→3,2→1,3→0,4→1,5→3,6→5; points to role of favored statement; see client/src/utils/questionnaireScoring.ts and SCORING_SYSTEM.md in the legacy repo.
```

### Results and role display

```
Implement results and role display in Next.js v2:
- Fetch user profile/results via GET /api/users/:id/profile or /api/user/results as in docs/API_REFERENCE.md.
- Reuse primary/secondary role and profile type from client/src/utils/roleCalculations.ts (calculatePrimaryRole). Use ROLES and constants from shared/constants.ts. Do not change scoring or role keys.
```

### Teams and churches

```
Implement teams and churches in Next.js v2 using the same endpoints:
- Teams: GET /api/users/:id/teams, GET /api/user/teams, GET /api/teams/by-invite/:code, GET /api/teams/:id/members, GET /api/teams/:id/results, POST /api/teams, POST /api/teams/join/:code, POST /api/teams/:id/add-member, GET /api/teams/:id/export.
- Churches: GET /api/churches/my, GET /api/churches/my-churches, GET /api/churches/by-invite/:code, GET /api/churches/:id/dashboard, GET /api/churches/:id/members, POST/PATCH/DELETE as in docs/API_REFERENCE.md, POST /api/churches/join/:code, POST /api/churches/:id/generate-invite-code.
- Keep request/response shapes identical to the current app.
```

### Subscription and profile upload

```
Implement subscription and profile upload in Next.js v2:
- GET /api/subscription/status; POST /api/subscription/create-checkout-session with same body as current app.
- Profile image: POST /api/upload/profile with FormData (file). Use same endpoint and response handling as client/src/pages/profile-settings-page.tsx.
```

---

## 6. Next.js–specific notes for V2

- **Proxy:** In dev, configure Next.js to proxy `/api` to the same backend URL used in the current app (e.g. `http://localhost:5000` or `VITE_BACKEND_URL`). Do not add `/api` to the proxy target base.
- **Env:** In v2 use something like `NEXT_PUBLIC_BACKEND_URL` or `BACKEND_URL` for the API base (same value as current `VITE_BACKEND_URL`).
- **Cookies:** Backend uses cookies for session; ensure same-origin or correct CORS/credentials so cookies are sent with API requests.

---

## 7. File reference (current codebase)

| Concern | Location |
|--------|----------|
| API base, apiRequest, getQueryFn, queryClient | `client/src/lib/queryClient.ts` |
| Auth context, login, register, verify, logout, profile, delete, forgot/reset | `client/src/hooks/use-auth.tsx` |
| Questionnaire form, start, submit answers | `client/src/components/questionnaire/question-form.tsx` |
| Questionnaire page wrapper | `client/src/pages/QuestionnairePage.tsx` |
| Scoring from responses | `client/src/utils/questionnaireScoring.ts` |
| Primary/secondary role, profile type | `client/src/utils/roleCalculations.ts` |
| Join team/church | `client/src/hooks/useJoinTeamOrChurch.tsx` |
| Export user/team | `client/src/lib/exportHelper.ts` |
| Subscription status / checkout | `client/src/hooks/use-subscription.tsx`, `client/src/components/SubscriptionPlans.tsx` |
| Schema & constants | `shared/schema.ts`, `shared/constants.ts`, `shared/types.ts` |
| Vite proxy | `vite.config.mts` (server.proxy "/api") |

Use this guide together with **docs/API_REFERENCE.md** and the **.cursor/rules/v2-migration.mdc** rule when building v2 so logic, APIs, and endpoints stay aligned with the current app.
