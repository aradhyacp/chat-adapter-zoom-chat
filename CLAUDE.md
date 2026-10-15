# CLAUDE.md

See @AGENTS.md for the full guide — it covers package usage, configuration, the API
surface, known Zoom platform limitations, and the conventions for working in this repo.

Quick orientation:

- **Package:** [`zoom-chat-adapter`](https://www.npmjs.com/package/zoom-chat-adapter) on
  npm — a community Zoom Team Chat adapter for [Chat SDK](https://chat-sdk.dev). Not an
  official `@chat-adapter/*` package.
- **Source:** [github.com/aradhyacp/zoom-chat-adapter](https://github.com/aradhyacp/zoom-chat-adapter).
  The npm tarball ships only the built `dist/`; the real implementation is `src/` in the
  repo. Never edit `node_modules/zoom-chat-adapter/`.
- **Setup instructions** for the Zoom Marketplace app (credentials, scopes, ngrok) live in
  [README.md](./README.md).
