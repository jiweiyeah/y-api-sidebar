# Y-API Sidebar

A Chrome extension that puts an AI assistant in your browser sidebar. Ask about
the page you are reading, or start a plain chat — powered by [Y-API](https://y-api.bestvirtualgoods.com/).

You bring a Y-API API key; there is no local model to install and no server of
ours in the middle. The extension talks straight to
`https://api.y-api.bestvirtualgoods.com/v1`.

## What changed from upstream

This is a fork of [Page Assist](https://github.com/n4ze3m/page-assist)
(MIT, © 2023 Muhammed Nazeem). The upstream licence is preserved verbatim in
[LICENCE](./LICENCE). Changes made here:

- Rebranded to Y-API Sidebar across the manifest, all 14 store locales and the
  20 in-app locales; new icon set derived from the Y-API mark.
- Provider list reduced to a single preset: Y-API. Ollama, LM Studio, Chrome's
  built-in Gemini Nano, Google AI, Anthropic and the other 35 presets are gone
  from the UI.
- The model picker no longer probes `127.0.0.1:11434`. "Configured" now means
  "has at least one Y-API model enabled".
- Web share is removed. Upstream defaulted it to `pageassist.xyz`, which POSTed
  the full conversation to a third-party server. Local exports (txt / md / json /
  png) remain.
- Removed the upstream author's donation links, Discord, Twitter and GitHub
  links from the About page and header; the About page now carries the upstream
  attribution instead.

## Development

```bash
bun install
bun run dev            # Chrome, HMR
bun run build:chrome   # → build/chrome-mv3
bun run zip            # → build/chrome-mv3.zip for the Web Store
```

Load `build/chrome-mv3` via `chrome://extensions` → Developer mode → Load unpacked.

## Licence

MIT. See [LICENCE](./LICENCE).
