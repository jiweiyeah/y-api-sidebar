# Privacy Policy — Y-API Sidebar

**Last updated: 2026-10-20**
**Applies to: Y-API Sidebar, Chrome extension version 1.0.0 and later**

This policy is published at
`https://jiweiyeah.github.io/y-api-sidebar/privacy.html` and is the version
submitted to the Chrome Web Store.

---

## Summary

Y-API Sidebar stores your data in your browser and sends nothing to us. The only
outbound traffic is the chat request you send to the API endpoint you configure,
plus web-search queries if you turn that feature on.

We do not run analytics, telemetry, crash reporting or remote config.

---

## 1. Who we are

Y-API Sidebar is published by Y-API (`https://y-api.bestvirtualgoods.com/`).
For privacy questions, use the support link on that site.

The extension is a fork of the open-source Page Assist project (MIT licence,
© 2023 Muhammed Nazeem). This policy describes this build, not upstream.

## 2. What is stored on your device

All of the following lives in your browser's IndexedDB and Chrome storage. None
of it is uploaded to us.

| Data | Why |
| --- | --- |
| API key you paste in | Authenticate your requests to the endpoint you configured |
| Provider settings (name, base URL, custom headers) | Know where to send requests |
| The list of models you enabled | Populate the model picker |
| Chat history and messages | Show your conversations; generate titles |
| Prompts you save | Reuse them |
| Knowledge-base documents you upload | Local retrieval for "chat with document" |
| Preferences (theme, language, shortcuts, TTS voice) | Remember your settings |

Uninstalling the extension deletes all of it. Settings → General has an export
function if you want a copy first.

## 3. What leaves your device

Only two categories, and only when you act.

### 3.1 Chat requests

When you send a message, the extension transmits:

- your message text,
- the page content or selected text you asked about (if you used "chat with
  current page"),
- any document excerpts retrieved locally for your question,
- your API key, in the `Authorization` header.

These go to the endpoint configured in Settings → OpenAI Compatible API. The
default is `https://api.y-api.bestvirtualgoods.com/v1`, operated by Y-API. You
may point it at any other OpenAI-compatible endpoint, including one you host
yourself; in that case that operator's policy applies instead of ours.

Y-API's handling of API requests is governed by the terms published at
`https://y-api.bestvirtualgoods.com/`.

### 3.2 Web search (optional, off unless you enable it)

If you enable web search, your query is sent to the search provider you selected
in settings (for example SearXNG, DuckDuckGo, Tavily, Serper or Brave). That
provider's policy applies.

### 3.3 What we do not collect

No analytics or telemetry SDK. No crash reports. No advertising identifiers. No
remote configuration. No account system. We do not read pages you have not asked
about, and we do not run in the background on pages you are not using the
extension on.

## 4. Permissions and justification

| Permission | Why it is needed |
| --- | --- |
| `activeTab`, `scripting` | Read the current page only after you ask a question about it |
| `storage`, `unlimitedStorage` | Keep chat history, settings and knowledge base locally |
| `sidePanel`, `action` | The side panel UI and toolbar button |
| `contextMenus` | Right-click to ask about selected text |
| `declarativeNetRequest` | Adjust request headers so self-hosted endpoints without CORS work |
| `notifications` | Notify you when a long-running task finishes |
| `tts` | Read replies aloud, only if you enable it |
| `host_permissions` (`http://*/*`, `https://*/*`) | Reach whichever endpoint you configure. Cannot be narrowed to one domain because users may self-host |

## 5. Third parties

We do not sell, rent or share your data. There is no third-party SDK bundled in
this extension that transmits data. The only third parties involved are the ones
you configure yourself: your API endpoint and, optionally, your search provider.

## 6. Data retention and deletion

Data lives on your device and is retained until you delete it. You can:

- delete individual conversations from the sidebar,
- clear everything via Settings → General → Export/Import or by uninstalling,
- revoke your API key at `https://y-api.bestvirtualgoods.com/app/keys`, which
  immediately stops it working for this and any other client.

Because we never receive your chat data, there is nothing for us to delete on
our side. If you want your Y-API account and its request logs removed, use the
account deletion option on the Y-API site.

## 7. Children

The extension is not directed at children under 13 and we do not knowingly
collect data from them. There is no account system and no data collection to
speak of.

## 8. Changes to this policy

If this policy changes materially we will update the "Last updated" date above
and note the change in the repository's release notes. Continued use after a
change means you accept the updated policy.

## 9. Contact

Support: `https://y-api.bestvirtualgoods.com/app/support`
Issues: `https://github.com/jiweiyeah/y-api-sidebar/issues`
