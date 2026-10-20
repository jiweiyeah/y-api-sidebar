# Y-API Sidebar

An open-source AI assistant that lives in your browser's side panel. Ask about
the page you're reading, or just chat. Bring your own API key.

## Links

- **Website / sign up:** [Y-API](https://y-api.bestvirtualgoods.com/)
- **Get an API key:** [y-api.bestvirtualgoods.com/app/keys](https://y-api.bestvirtualgoods.com/app/keys)
- **API endpoint:** [api.y-api.bestvirtualgoods.com/v1](https://api.y-api.bestvirtualgoods.com/v1)
- **Support:** [y-api.bestvirtualgoods.com/app/support](https://y-api.bestvirtualgoods.com/app/support)
- **Source code:** [github.com/jiweiyeah/y-api-sidebar](https://github.com/jiweiyeah/y-api-sidebar)
- **Changelog:** [CHANGELOG.md](https://github.com/jiweiyeah/y-api-sidebar/blob/main/CHANGELOG.md)
- **Privacy policy:** [Privacy Policy](privacy.html)

## What it does

- Ask about the current page, from the side panel
- Plain chat in the side panel or the full-page Playground
- Paste or drop an image; optional local OCR
- Everything stored locally in IndexedDB; nothing sent to us

## Install

Not yet listed on the Chrome Web Store. Build from source:

```bash
git clone https://github.com/jiweiyeah/y-api-sidebar.git
cd y-api-sidebar
bun install
bun run build:chrome
```

Then load `build/chrome-mv3` via `chrome://extensions` → Developer mode →
**Load unpacked**.

## Licence

MIT. Fork of [Page Assist](https://github.com/n4ze3m/page-assist).
