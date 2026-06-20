# Skill Registry — IRON TRACK

> Auto-generated index of available skills for agent delegation.
> Last updated: 2026-06-20

## Registry Contract

- This is an index, not a compiler. `SKILL.md` files remain the source of truth.
- Delegators should pass exact skill paths to subagents.
- Project-level skills take precedence over user-level skills with the same name.

---

## Project Skills (`.opencode/skills/`)

| Skill | Trigger | Path |
|-------|---------|------|
| `iron-track-architecture-guardian` | Enforce layered architecture, folder conventions, NO Server Actions, API routes, services, repositories, models, `src/lib/`, `src/pages/api/` | `.opencode/skills/iron-track-architecture-guardian/SKILL.md` |
| `iron-track-design-guardian` | Enforce Voltage Industrial design system, dark-only, #CCFF00 primary, zero border-radius, glass cards, typography, Framer Motion animations, AnimatePresence, React components, Astro pages, CSS, Tailwind | `.opencode/skills/iron-track-design-guardian/SKILL.md` |
| `astro-api-routes` | Generate Astro API Routes, REST endpoints, Controller → Service → Repository, input validation, error handling, HTTP status codes, `src/pages/api/` | `.opencode/skills/astro-api-routes/SKILL.md` |
| `react-19` | React 19 patterns, React Compiler, no useMemo/useCallback, Server Components, use() hook | `.opencode/skills/react-19/SKILL.md` |
| `typescript` | TypeScript strict patterns, types, interfaces, generics | `.opencode/skills/typescript/SKILL.md` |
| `tailwind-4` | Tailwind CSS 4 patterns, cn(), theme variables, no var() in className | `.opencode/skills/tailwind-4/SKILL.md` |
| `zustand-5` | Zustand 5 state management, stores, slices | `.opencode/skills/zustand-5/SKILL.md` |

---

## Project Skills (`.agents/skills/`)

| Skill | Trigger | Path |
|-------|---------|------|
| `astro` | Astro framework patterns, components, API routes, SSR/SSG, integrations | `.agents/skills/astro/SKILL.md` |
| `vercel-react-best-practices` | React performance optimization, bundle optimization, data fetching, Vercel patterns | `.agents/skills/vercel-react-best-practices/SKILL.md` |
| `supabase-postgres-best-practices` | Postgres optimization, schema design, RLS, indexes, Supabase patterns | `.agents/skills/supabase-postgres-best-practices/SKILL.md` |
| `frontend-design` | Production-grade frontend interfaces, web components, landing pages, dashboards | `.agents/skills/frontend-design/SKILL.md` |

---

## User Skills (`~/.config/opencode/skills/`)

| Skill | Trigger | Path |
|-------|---------|------|
| `ai-sdk-5` | Vercel AI SDK 5, chat features, breaking changes from v4 | `~/.config/opencode/skills/ai-sdk-5/SKILL.md` |
| `playwright` | Playwright E2E tests, Page Objects, selectors | `~/.config/opencode/skills/playwright/SKILL.md` |
| `go-testing` | Go tests, coverage, Bubbletea teatest, golden files | `~/.config/opencode/skills/go-testing/SKILL.md` |
| `branch-pr` | Create PRs with issue-first checks | `~/.config/opencode/skills/branch-pr/SKILL.md` |
| `chained-pr` | Stacked PRs, PRs over 400 lines, review slices | `~/.config/opencode/skills/chained-pr/SKILL.md` |
| `cognitive-doc-design` | Design docs, READMEs, RFCs, onboarding, architecture docs | `~/.config/opencode/skills/cognitive-doc-design/SKILL.md` |
| `comment-writer` | PR feedback, issue replies, reviews, Slack messages | `~/.config/opencode/skills/comment-writer/SKILL.md` |
| `issue-creation` | Create GitHub issues, bug reports, feature requests | `~/.config/opencode/skills/issue-creation/SKILL.md` |
| `judgment-day` | Dual review, adversarial review, blind judges | `~/.config/opencode/skills/judgment-day/SKILL.md` |
| `sdd-apply` | Implement SDD tasks from specs and design | `~/.config/opencode/skills/sdd-apply/SKILL.md` |
| `sdd-archive` | Archive completed SDD changes, sync delta specs | `~/.config/opencode/skills/sdd-archive/SKILL.md` |
| `sdd-design` | Create SDD technical design and architecture | `~/.config/opencode/skills/sdd-design/SKILL.md` |
| `sdd-explore` | Explore SDD ideas, requirement clarification | `~/.config/opencode/skills/sdd-explore/SKILL.md` |
| `sdd-init` | Initialize SDD context, testing capabilities, registry | `~/.config/opencode/skills/sdd-init/SKILL.md` |
| `sdd-onboard` | Walk through SDD workflow on real codebase | `~/.config/opencode/skills/sdd-onboard/SKILL.md` |
| `sdd-propose` | Create SDD change proposals, intent, scope | `~/.config/opencode/skills/sdd-propose/SKILL.md` |
| `sdd-spec` | Write SDD delta specs, requirements, scenarios | `~/.config/opencode/skills/sdd-spec/SKILL.md` |
| `sdd-tasks` | Break SDD specs into implementation tasks | `~/.config/opencode/skills/sdd-tasks/SKILL.md` |
| `sdd-verify` | Validate SDD implementation against specs | `~/.config/opencode/skills/sdd-verify/SKILL.md` |
| `skill-creator` | Create, modify, improve, benchmark skills | `~/.config/opencode/skills/skill-creator/SKILL.md` |
| `skill-improver` | Audit, refactor, optimize skills | `~/.config/opencode/skills/skill-improver/SKILL.md` |
| `work-unit-commits` | Plan commits as reviewable work units, chained PRs | `~/.config/opencode/skills/work-unit-commits/SKILL.md` |

---

## Decision Gates

| Situation | Action |
|-----------|--------|
| Same skill in project and user level | Keep project-level skill |
| Agent delegates work | Select matching rows, pass exact `SKILL.md` paths |
| Skill not found in registry | Check if it exists but wasn't indexed |

---

## Usage for Delegators

When delegating to subagents:
1. Identify relevant skills from this registry
2. Pass the exact `SKILL.md` path to the subagent
3. Subagent reads the skill before generating output

Example:
```
Delegating API route creation → pass `.opencode/skills/astro-api-routes/SKILL.md`
Delegating UI component → pass `.opencode/skills/iron-track-design-guardian/SKILL.md`
Delegating backend logic → pass `.opencode/skills/iron-track-architecture-guardian/SKILL.md`
Delegating Astro page → pass `.agents/skills/astro/SKILL.md`
Delegating React component → pass `.opencode/skills/react-19/SKILL.md`
```
