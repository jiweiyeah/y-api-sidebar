# Privacy Policy — Y-API Sidebar

**Last updated: 2026-10-20**
**Applies to: Y-API Sidebar, Chrome extension version 1.0.0 and later**

This policy is published at
[jiweiyeah.github.io/y-api-sidebar/privacy.html](https://jiweiyeah.github.io/y-api-sidebar/privacy.html) and is the version
submitted to the Chrome Web Store.

---

## Summary

Y-API Sidebar stores your data in your browser and sends nothing to us. The only
outbound traffic is the chat request you send to Y-API.

We do not run analytics, telemetry, crash reporting or remote config.

---

## 1. Who we are

Y-API Sidebar is published by Y-API ([y-api.bestvirtualgoods.com](https://y-api.bestvirtualgoods.com/)).
For privacy questions, use the support link on that site.

The extension is a fork of the open-source Page Assist project (MIT licence,
© 2023 Muhammed Nazeem). This policy describes this build, not upstream.

## 2. What is stored on your device

All of the following lives in your browser's IndexedDB and Chrome storage. None
of it is uploaded to us.

| Data | Why |
| --- | --- |
| API key you paste in | Authenticate your requests to Y-API |
| The list of models you added | Populate the model picker |
| Chat history and messages | Show your conversations; generate titles |
| Project folders and chat pins | Organise your history |
| Preferences (theme, language, OCR language, shortcuts) | Remember your settings |

Uninstalling the extension deletes all of it. Settings → General has an export
function if you want a copy first.

## 3. What leaves your device

Only one category, and only when you act.

### 3.1 Chat requests

When you send a message, the extension transmits:

- your message text,
- any images you attached,
- the page content you asked about (if you used "chat with current page"),
- the system prompt and sampling parameters you set for that chat,
- your API key, in the `Authorization` header.

These go to [api.y-api.bestvirtualgoods.com/v1](https://api.y-api.bestvirtualgoods.com/v1),
operated by Y-API. The base URL is fixed in this build; it cannot be changed.

Y-API's handling of API requests is governed by the terms published at
[y-api.bestvirtualgoods.com](https://y-api.bestvirtualgoods.com/).

### 3.2 What we do not collect

No analytics or telemetry SDK. No crash reports. No advertising identifiers. No
remote configuration. No account system. We do not read pages you have not asked
about, and we do not run in the background on pages you are not using the
extension on.

## 4. Permissions and justification

| Permission | Why it is needed |
| --- | --- |
| `storage`, `unlimitedStorage` | Keep your API key, chat history and settings locally |
| `sidePanel` | The side panel UI |
| `contextMenus` | Right-click to open the side panel or the full-page chat |
| `host_permissions` (`https://api.y-api.bestvirtualgoods.com/*`) | The only backend the extension talks to |

## 5. Third parties

We do not sell, rent or share your data. There is no third-party SDK bundled in
this extension that transmits data. The only third party involved is Y-API, which
receives your chat requests.

## 6. Data retention and deletion

Data lives on your device and is retained until you delete it. You can:

- delete individual conversations from the sidebar,
- clear everything via Settings → General → Export/Import or by uninstalling,
- revoke your API key at [y-api.bestvirtualgoods.com/app/keys](https://y-api.bestvirtualgoods.com/app/keys), which
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

Support: [y-api.bestvirtualgoods.com/app/support](https://y-api.bestvirtualgoods.com/app/support)
Issues: [github.com/jiweiyeah/y-api-sidebar/issues](https://github.com/jiweiyeah/y-api-sidebar/issues)
