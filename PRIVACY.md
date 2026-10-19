# Privacy Policy — Y-API Sidebar

Last updated: 2026-10-20

## What this extension stores

Everything stays in your browser's local IndexedDB. Nothing is uploaded to us.

- Your Y-API API key and the provider settings you enter.
- The list of models you enabled.
- Chat history, prompts and knowledge-base documents you create.
- Your preferences (theme, language, shortcuts).

Uninstalling the extension removes all of it. Export is available under
Settings → General.

## What leaves your browser

Only two things, and only when you initiate them:

1. **Chat requests.** The page content or message you are asking about, plus
   your API key, are sent to the endpoint you configured — by default
   `https://api.y-api.bestvirtualgoods.com/v1`, operated by Y-API. What that
   endpoint does with the request is governed by Y-API's own terms.
2. **Web search, if you turn it on.** Search queries go to whichever search
   provider you selected in settings.

There is no telemetry, no analytics SDK, no crash reporting and no remote
config. The extension does not read pages you have not asked it to read.

## Permissions and why

| Permission | Why |
| --- | --- |
| `activeTab`, `scripting` | Read the page you explicitly ask about, and only then |
| `storage`, `unlimitedStorage` | Keep chat history and settings locally |
| `sidePanel`, `action` | The sidebar UI and toolbar button |
| `contextMenus` | Right-click "ask about selection" |
| `declarativeNetRequest` | Adjust request headers for the endpoint you configure |
| `notifications` | Tell you when a long task finishes |
| `tts` | Read replies aloud, if you enable it |
| `host_permissions: http/https` | Reach whichever endpoint you configure — you may self-host |

## Removed features

The upstream project's web-share feature, which uploaded conversations to
`pageassist.xyz`, is not present in this build.

## Contact

Open an issue or use the support link at https://y-api.bestvirtualgoods.com/.

This extension is a fork of Page Assist (MIT, © 2023 Muhammed Nazeem).
