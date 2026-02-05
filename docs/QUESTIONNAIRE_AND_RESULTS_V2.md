# Questionnaire & Results – Detailed Documentation for V2.0

This document describes **questionnaire flows, result endpoints, scoring logic, and role calculations** so V2.0 (Next.js) can implement them correctly with the same setup, logic, and endpoints.

---

## 1. Overview: Two Questionnaire Flows in the Current App

The codebase has **two** questionnaire implementations. For V2.0, pick one and stick to it, or support both if the backend does.

| Flow | Route | Endpoints | Questions source | Used in |
|------|--------|-----------|------------------|--------|
| **Profile submit** | `/questionnaire` | GET `/api/users/:id/profile`, POST `/api/profile/submit` | `shared/constants` QUESTIONS (40 items) | `QuestionnairePage.tsx` (main) |
| **Questionnaire API** | (not in main routes) | GET `/api/questionnaire`, POST `/api/questionnaire/start`, POST `/api/questionnaire/:id/answers` | API returns `statementA` / `statementB` | `question-form.tsx` |

**Recommendation for V2:** Use the **profile-submit flow** (same as main `/questionnaire`): load profile, submit `responses` to `/api/profile/submit`, and use the 40 questions from `shared/constants` (QUESTIONS). If the backend also supports the “questionnaire API” flow (start → answers), you can add that for resume/progress; the scoring and result shape below still apply.

---

## 2. Endpoints Reference

### 2.1 Questionnaire (logged-in user) – profile submit flow

| Method | Path | When | Request | Response |
|--------|------|------|---------|----------|
| GET | `/api/users/:id/profile` | Load existing profile (and resume) | — | See [Profile/Results response](#24-profile--results-response-shape) |
| POST | `/api/profile/submit` | Submit full questionnaire | `{ responses: QuestionResponse[] }` | e.g. `{ scores: RoleScoreResult, ... }` |

**QuestionResponse (each item):**

```ts
{
  questionId: number;      // 1–40
  value: number;          // 0–6 (3 = neutral)
  statement1Role: string;   // Role for statement 1 (e.g. "apostle", "prophet")
  statement2Role: string;  // Role for statement 2
}
```

Roles must be one of: `apostle`, `prophet`, `evangelist`, `herder`, `teacher` (from `shared/constants` ROLES).

### 2.2 Guest questionnaire

| Method | Path | Request | Response |
|--------|------|---------|----------|
| POST | `/api/profile/submit-guest/:inviteCode` | `{ email, firstName, lastName, responses: QuestionResponse[] }` | e.g. `{ scores, ... }` |

Same `QuestionResponse` shape; `inviteCode` from query e.g. `/questionnaire/guest?inviteCode=xxx`.

### 2.3 Alternative questionnaire API (start / answers) – optional

If your backend supports this (used by `question-form.tsx`):

| Method | Path | Request | Response |
|--------|------|---------|----------|
| GET | `/api/questionnaire` | — | `{ questions: { id, statementA, statementB }[] }` |
| POST | `/api/questionnaire/start` | — | `{ id: number, answers?: { questionId, value }[] }` |
| POST | `/api/questionnaire/:userAnswerId/answers` | `{ answers: { questionId, value }[], completed: boolean }` | — |

Here `value` is **0–6** (3 = neutral). On `completed: true`, invalidate `/api/user/results` and optionally `/api/users/:id/profile`.

### 2.4 Profile / results – fetching scores

| Method | Path | Use case | Response |
|--------|------|----------|----------|
| GET | `/api/users/:id/profile` | Results page, recommendations, “view member” | Profile + role scores (see below) |
| GET | `/api/user/results` | User dashboard (e.g. “my results”) | e.g. `{ scores: RoleScoreResult }` |

**Profile / results response shape (role scores):**

```ts
{
  id?: number;
  name?: string;
  email?: string;
  apostle: number;    // 0–200 (raw points)
  prophet: number;
  evangelist: number;
  herder: number;
  teacher: number;
  responses?: QuestionResponse[];  // Optional: raw answers for resume/edit
}
```

Scores are **raw points** per role (0–200 for 40 questions). No extra keys required for display; primary/secondary are derived client-side from these five numbers.

### 2.5 Export

| Method | Path | Use |
|--------|------|-----|
| GET | `/api/users/:id/export` | Download report (e.g. PDF/CSV). Use as link `href` with `credentials: "include"` or same-origin. |

---

## 3. Slider Scale and Scoring (canonical)

### 3.1 Slider value: 0–6, 3 = neutral

- **0–2:** Favor **statement 1** (left).
- **3:** **Neutral** – no points.
- **4–6:** Favor **statement 2** (right).

All API payloads and backend must use this **0–6** scale. Do not use 0–5 in the API.

### 3.2 Weight mapping (slider → points)

| Value | Weight | Meaning |
|-------|--------|---------|
| 0 | 5 | Strongly favor statement1 |
| 1 | 3 | Favor statement1 |
| 2 | 1 | Slightly favor statement1 |
| 3 | 0 | Neutral (no points) |
| 4 | 1 | Slightly favor statement2 |
| 5 | 3 | Favor statement2 |
| 6 | 5 | Strongly favor statement2 |

- Weight is awarded **only** to one role per question: the role of the favored statement (`statement1Role` or `statement2Role`).
- One question contributes **0 or 1–5 points** to exactly one role.

### 3.3 Score ranges (40 questions)

- **Per role:** 0–200 (40 × 5).
- **Percentage:** `(roleScore / 200) * 100` (max possible per role = 200).

---

## 4. Client-side scoring logic (reuse in V2)

Scoring is implemented in `client/src/utils/questionnaireScoring.ts`. Backend may also compute scores; if so, client logic should match for preview/validation.

### 4.1 Algorithm (from questionnaireScoring.ts)

1. For each response:
   - Validate `value` in 0–6 (integer).
   - If `value === 3`, skip (no points).
   - Else:
     - `weight = SLIDER_WEIGHTS[value]` (0→5, 1→3, 2→1, 4→1, 5→3, 6→5).
     - If `value < 3` → add `weight` to `statement1Role`.
     - If `value > 3` → add `weight` to `statement2Role`.
2. Map role names to keys: `apostle`, `prophet`, `evangelist`, `herder`, `teacher` (lowercase; accept `herder` or `shepherd` for herder).
3. Return `{ apostle, prophet, evangelist, herder, teacher }` (all 0–200).

### 4.2 Key functions to port

- **`calculateRoleScores(responses, totalQuestions = 40)`**  
  Returns raw role scores. Input: `QuestionResponse[]` with `questionId`, `value`, `statement1Role`, `statement2Role`.

- **`normalizeScoresToPercentages(scores, totalQuestions = 40)`**  
  Returns same shape with percentages (0–100) per role.

- **`validateResponses(responses, totalQuestions)`**  
  Returns `{ isValid, answeredCount, missingQuestions, invalidResponses }`.

- **`getMaxPossibleScore(questionCount)`**  
  Returns `questionCount * 5` (e.g. 200 for 40).

---

## 5. Role calculations (primary / secondary / profile type)

Implemented in `client/src/utils/roleCalculations.ts`. Use for display on results and recommendations.

### 5.1 Input

- Object with keys `apostle`, `prophet`, `evangelist`, `herder`, `teacher` (raw scores 0–200).

### 5.2 `calculatePrimaryRole(roleScores)` → RoleProfile

- Sort roles by score descending; **primary** = top, **secondary** = second.
- **dominanceRatio** = primaryScore / totalScore (total of all five).
- **profileType:**
  - `dominanceRatio < 0.35` → `"balanced"`
  - `dominanceRatio > 0.5` → `"specialized"`
  - else → `"moderate"`
- If totalScore === 0 → `primaryRole`/`secondaryRole` null, `profileType` `"unknown"`.

### 5.3 Constants for labels and display

From `shared/constants.ts`:

- **ROLES** – `apostle`, `prophet`, `evangelist`, `herder`, `teacher`.
- **ROLE_LABELS** – Dutch labels (e.g. Apostel, Prophet, Evangelist, Herder, Teacher).
- **ROLE_DESCRIPTIONS** – Short description per role for results page.
- **ROLE_COLORS** – Hex colors for charts.

Use these in V2 so UX and copy stay consistent.

---

## 6. Questions source: 40 questions

- **Source:** `shared/constants.ts` → **QUESTIONS** (array of 40 items).
- **Shape per question:**

```ts
{
  id: number;           // 1–40
  statement1: { text: string; role: string };  // role = ROLES.*
  statement2: { text: string; role: string };
}
```

- **Usage:** Build `QuestionResponse[]` with `questionId = question.id`, `statement1Role = question.statement1.role`, `statement2Role = question.statement2.role`, and `value` from the slider (0–6).
- Do **not** change question IDs or role assignments; backend and historical data depend on them.

---

## 7. Flows: step-by-step

### 7.1 Logged-in user questionnaire (main: profile submit)

1. **Auth:** User must be logged in (session).
2. **Load:** `GET /api/users/:id/profile` with current user `id`.
3. **Init state:**
   - If `profile.responses?.length > 0`: map to form state (fill existing answers).
   - Else: init one response per question with `value: 3` (neutral) and `statement1Role` / `statement2Role` from QUESTIONS.
4. **UI:** One question at a time (or all); slider **0–6**, 3 = neutral.
5. **Submit:** On “Finish”, `POST /api/profile/submit` with `{ responses }` (all 40 items, each with `questionId`, `value`, `statement1Role`, `statement2Role`).
6. **After submit:** Invalidate `/api/users/:id/profile` (and `/api/user/results` if used). Redirect to results (e.g. `/results`) or dashboard.
7. **Already completed:** If profile already has scores and you don’t allow re-submit, show “Already completed” and link to results.

### 7.2 Guest questionnaire

1. **Entry:** Page with `inviteCode` from query (e.g. `/questionnaire/guest?inviteCode=xxx`). Optionally show “No permission” if no/invalid code (see `NoPermissionToQuestionnaire.tsx`).
2. **Collect:** Guest fills email, firstName, lastName (and optionally other fields if API supports).
3. **Questions:** Same 40 QUESTIONS; init responses with `value: 3` and roles from QUESTIONS.
4. **Submit:** `POST /api/profile/submit-guest/:inviteCode` with `{ email, firstName, lastName, responses }`.
5. **After submit:** Show success / celebration; optional redirect or modal.

### 7.3 Results (current user)

1. **Load:** `GET /api/users/:id/profile` with current user `id` (or `GET /api/user/results` for dashboard-style “my results”).
2. **No profile / no scores:** Show “No results yet” and link to `/questionnaire`.
3. **Display:** Use `profile.apostle`, `profile.prophet`, etc. (raw 0–200). Optionally compute percentages with `normalizeScoresToPercentages(scores)`. Use `calculatePrimaryRole(scores)` for primary/secondary and profile type; show labels from ROLE_LABELS and ROLE_DESCRIPTIONS.
4. **Export:** Link or button to `GET /api/users/:id/export` (same-origin or with credentials).

### 7.4 Results for another user (e.g. team member)

1. **Load:** `GET /api/users/:userId/profile` (e.g. from route `/results/:userId`).
2. **No profile:** Show “Member not found” or “No results”.
3. **Display:** Same as current user (scores, primary/secondary, chart, export link to `/api/users/:userId/export`).

---

## 8. V2 setup checklist

- [ ] **Endpoints:** Use exactly the paths above; no new questionnaire or profile URLs without backend support.
- [ ] **Slider:** 0–6 in UI and API; 3 = neutral. Do not send or store 0–5.
- [ ] **Request bodies:** `POST /api/profile/submit` and `POST /api/profile/submit-guest/:inviteCode` use `QuestionResponse[]` with `questionId`, `value`, `statement1Role`, `statement2Role`.
- [ ] **Questions:** Use the same 40 QUESTIONS from `shared/constants.ts` (or an exact copy in V2); same IDs and role mapping.
- [ ] **Scoring:** Port `questionnaireScoring.ts` (or match its logic) so client-side preview/validation matches backend.
- [ ] **Role display:** Port `roleCalculations.ts` and use ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_COLORS from constants.
- [ ] **Profile/results response:** Expect `apostle`, `prophet`, `evangelist`, `herder`, `teacher` (raw 0–200); optionally `responses` for resume.
- [ ] **Export:** Use `GET /api/users/:id/export` with credentials; trigger download in browser.
- [ ] **Cache invalidation:** After submit, invalidate `/api/users/:id/profile` and `/api/user/results` so results and dashboard stay in sync.

---

## 9. File reference (current app)

| Purpose | File |
|--------|------|
| Main questionnaire (profile submit) | `client/src/pages/QuestionnairePage.tsx` |
| Guest questionnaire | `client/src/pages/GuestQuestionnairePage.tsx` |
| Alternative flow (questionnaire API) | `client/src/components/questionnaire/question-form.tsx`, `client/src/pages/questionnaire-page.tsx` |
| Scoring | `client/src/utils/questionnaireScoring.ts` |
| Primary/secondary & profile type | `client/src/utils/roleCalculations.ts` |
| 40 questions + ROLES/labels/colors | `shared/constants.ts` |
| Types | `shared/types.ts` (QuestionResponse, etc.) |
| Results (own) | `client/src/pages/ResultsPage.tsx` |
| Results (other user) | `client/src/pages/ResultsPageForUser.tsx` |
| User dashboard (results) | `client/src/pages/user-dashboard-page.tsx` (uses `/api/user/results`) |
| Recommendations | `client/src/pages/recommendations-page.tsx` (uses profile scores) |
| Scoring doc | `SCORING_SYSTEM.md` |

Use this document together with **docs/API_REFERENCE.md** and **docs/V2_MIGRATION_GUIDE.md** when implementing or fixing questionnaire and results in V2.0.
