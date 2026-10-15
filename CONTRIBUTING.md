# Contributing to chat-adapter-zoom

Thanks for helping improve this community-maintained Zoom adapter for Chat SDK! This guide covers local setup, verification, and how to submit changes.

## Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) 9+

## Setup

```bash
pnpm install
```

This installs `chat` and `@chat-adapter/shared` from npm plus all dev dependencies.

## Development

```bash
pnpm dev        # watch mode rebuild
pnpm build      # production build (dist/index.js + dist/index.d.ts)
pnpm typecheck  # tsc --noEmit
pnpm test       # vitest with coverage (53 tests)
pnpm test:watch # watch mode
pnpm clean      # remove dist/
```

## Before submitting

Every change must keep the full suite green:

1. `pnpm build` — must exit 0
2. `pnpm typecheck` — must exit 0
3. `pnpm test` — all 53 tests must pass (36 in `src/index.test.ts`, 17 in `src/markdown.test.ts`)

If a test fails, triage and report it — do not patch adapter source just to force it green without understanding the cause.

### Verifying against the `chat` SDK API

The adapter imports its SDK surface from the `chat` package. Don't guess at API usage — check the installed type definitions:

```bash
# e.g. verify Adapter interface, Chat options, logger API
grep -n "interface Adapter" node_modules/chat/dist/index.d.ts
```

## Pull requests

1. Fork the repo and create a branch from `main`:
   ```bash
   git checkout -b feat/short-description
   ```
2. Make focused changes — one concern per PR.
3. Add or update tests in `src/*.test.ts` for behavior changes.
4. Run the full verification above and include the results in your PR description.
5. Open a PR against `main` with a clear title and description:
   - What changed and why
   - Test/build/typecheck results
   - Any Zoom platform behavior worth noting

### Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>
```

Examples: `feat: support message reactions`, `fix: refresh OAuth token before expiry`, `docs: clarify webhook setup`, `chore: bump dev dependencies`.

## Reporting issues

Include:

- Package version (`chat-adapter-zoom`), `chat` SDK version, Node version
- Minimal reproduction (config + webhook payload with secrets redacted)
- Relevant logs — on webhook verification failures, the adapter logs raw body hex to aid diagnosis
- For suspected Zoom platform bugs, reference any Zoom support ticket IDs (e.g. ZOOM-506645 for the Unicode HMAC issue)

## Code of conduct

Be kind and constructive. This is a community project — review others' work the way you'd want yours reviewed.
