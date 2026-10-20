# Changelog

## 1.0.0 — 2026-10-20

First public release. Fork of Page Assist v1.5.88.

### Added

- Single-provider preset: Y-API, with the base URL and display name prefilled
  when you add a provider.
- Guided empty state: when no model is configured, the sidebar shows an
  "Add API key" button that deep-links to the provider settings page.

### Changed

- Rebranded to Y-API Sidebar in the manifest, all 14 store locales and all 20
  in-app locales.
- New icon set generated from the Y-API brand mark at 16/32/48/64/128 px.
- The model picker now lists only models you enabled under
  Settings → OpenAI Compatible API. The local Ollama probe and Chrome's built-in
  Gemini Nano model no longer contribute entries.
- The "check Ollama status" toggle is gone; the setting defaults to off.
- About page now shows the Y-API site, the API-key page and the upstream
  attribution instead of the upstream author's links.

### Removed

- Web share. Upstream posted the full conversation to
  `pageassist.xyz/api/v1/share/create` by default. Local exports (txt, md, json,
  png) remain.
- Upstream donation links (Ko-fi, GitHub Sponsors), Discord and Twitter links,
  and the `.github/FUNDING.yml` that pointed at the upstream author.
- The `extensions/page-action` sub-project and its build scripts.

### Fixed

- `openai.tsx` called `setProvider` during render while syncing the provider
  dropdown from a typed base URL. Once the URL matched a preset this re-entered
  the component and React aborted with "Too many re-renders", leaving a blank
  page. Moved to an effect.

### Fork notes

This repository starts from upstream `n4ze3m/page-assist@v1.5.88`. The first
commit is an unmodified import, so `git diff` against it shows the complete set
of changes. The MIT licence and original copyright notice are preserved in
`LICENCE`.

Upstream features retained: RAG over uploaded documents, saved prompts, web
search, MCP servers, page actions, WebMCP, TTS, chat export, 19 UI languages.
