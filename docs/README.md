# Docs for V2.0 Migration

These documents help you (and Cursor) reuse the **same logic, APIs, and endpoints** from this Frontend in **version 2.0** (Next.js + module SCSS).

## Files

| File | Purpose |
|------|--------|
| **V2_MIGRATION_GUIDE.md** | Full guide: API config, all endpoints, auth/questionnaire/scoring/teams/churches logic, shared types, and **copy-paste Cursor prompts** per feature. |
| **API_REFERENCE.md** | Quick lookup table of every endpoint (method, path, body). |

## How to use in V2

1. **In this repo:** When working on v2 in the same repo, the Cursor rule `.cursor/rules/v2-migration.mdc` applies when you have `.ts`/`.tsx` files open; it tells Cursor to use the same APIs and logic and to read these docs.
2. **In a separate v2 repo:** Copy `V2_MIGRATION_GUIDE.md` and `API_REFERENCE.md` into the v2 project (e.g. `docs/`), and add a similar rule in the v2 repo’s `.cursor/rules/` that points to those docs.
3. **Cursor prompts:** Use the “Cursor prompts” sections in `V2_MIGRATION_GUIDE.md` (e.g. for API client, auth, questionnaire, results, teams/churches, subscription/upload): copy-paste into Cursor when implementing that part of v2.

No backend changes are required; v2 should call the same backend URLs and payloads.
