<p align="center">
  <img src="docs/images/icon-128.png" width="96" alt="Y-API Sidebar">
</p>

<h1 align="center">Y-API Sidebar</h1>

<p align="center">
  <a href="LICENCE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
  <a href="https://chromewebstore.google.com/"><img alt="Chrome Web Store" src="https://img.shields.io/badge/Chrome%20Web%20Store-v1.0.0-success"></a>
  <img alt="Manifest" src="https://img.shields.io/badge/Manifest-V3-informational">
  <img alt="React" src="https://img.shields.io/badge/React-18-61dafb">
</p>

<p align="center">
  An open-source AI assistant that lives in your browser's side panel.<br>
  Ask about the page you're reading, or just chat. Bring your own API key.
</p>

---

## Why this exists

Most browser AI assistants either lock you into one vendor, or make you install
a local model runtime before the first message. This one does neither: paste an
API key, and you are talking to the page in front of you.

It is a fork of [Page Assist](https://github.com/n4ze3m/page-assist), reduced to
a single purpose and pointed at [Y-API](https://y-api.bestvirtualgoods.com/).

<p align="center">
  <img src="docs/images/store-1-chat.png" width="640" alt="Asking about a page in the side panel">
</p>
<p align="center">
  <img src="docs/images/store-2-empty.png" width="420" alt="Empty state">
  <img src="docs/images/store-3-settings.png" width="420" alt="Provider settings">
</p>

## Features

- **Ask about the current page** — text is extracted as Markdown and sent as
  context. No vision model required, so it works with text-only models too.
- **Plain chat** — a normal chat window, same key, same history.
- **Chat with a document** — drop in a PDF or text file and ask about it.
- **Local history** — conversations live in IndexedDB. Export to txt / md / json
  / png whenever you want.
- **Saved prompts** — store the ones you reuse.
- **Read aloud** — optional TTS.
- **19 languages** in the UI, 14 in the store listing.

## Install

### From the Chrome Web Store

*(link once published)*

### From source

```bash
git clone https://github.com/jiweiyeah/y-api-sidebar.git
cd y-api-sidebar
bun install
bun run build:chrome     # → build/chrome-mv3
```

Then open `chrome://extensions`, turn on **Developer mode**, click **Load
unpacked**, and pick `build/chrome-mv3`.

## Getting an API key

1. Sign up at <https://y-api.bestvirtualgoods.com/>.
2. Create a key under [API Keys](https://y-api.bestvirtualgoods.com/app/keys).
3. In the extension: Settings → **OpenAI Compatible API** → **Add Provider**.
   The endpoint is prefilled. Paste the key, save.
4. Click **Model List**, tick the models you want, save. They now appear in the
   model picker.

You can point the extension at any OpenAI-compatible endpoint, including one you
host yourself — the provider preset is only a default.

## Configuration

| Setting | Where | Notes |
| --- | --- | --- |
| Endpoint + key | Settings → OpenAI Compatible API | Any OpenAI-compatible base URL |
| Enabled models | Settings → OpenAI Compatible API → Model List | Only ticked models show up |
| Page context | Checkbox in the empty chat view | "Chat with current page" |
| Web search | Settings → General | Off by default; needs a search provider |
| Theme / language | Settings → General | Light, dark, system |

## Development

```bash
bun run dev              # Chrome with HMR
bun run dev:firefox      # Firefox
bun run build:chrome     # Production build
bun run zip              # Store-ready zip in build/
bun run compile          # Type-check only
```

Built with [WXT](https://wxt.dev/), React 18, TypeScript, Tailwind and Ant
Design. `wxt.config.ts` holds the manifest; `src/utils/oai-api-providers.ts`
holds the provider presets.

### Repository layout

```
src/
  entries/           background worker, options page, side panel
  components/        UI, split by surface (Option / Sidepanel / Common)
  db/dexie/          IndexedDB schema and queries
  models/            Chat model adapters (OpenAI-compatible, Ollama, etc.)
  services/          Ollama probe, TTS, web search, page actions
  utils/             Provider presets, helpers
docs/images/         Screenshots used in this README and the store listing
```

## What changed from upstream

See [CHANGELOG.md](CHANGELOG.md#fork-notes). In short: rebranded, provider list
cut to one preset, local-model probing removed, and the upstream web-share
feature (which uploaded conversations to `pageassist.xyz`) deleted.

## Privacy

The extension stores everything locally and sends only your chat requests to the
endpoint you configure. Full policy: [PRIVACY.md](PRIVACY.md).

## Contributing

Issues and pull requests are welcome. Before opening a PR:

```bash
bun run compile   # must be clean
```

Keep changes small and focused. If you are syncing from upstream Page Assist,
note the upstream commit in the PR description.

## Credits

Built on [Page Assist](https://github.com/n4ze3m/page-assist) by Muhammed Nazeem,
MIT licensed. The original copyright notice is preserved in [LICENCE](LICENCE).

## Licence

MIT — see [LICENCE](LICENCE).
