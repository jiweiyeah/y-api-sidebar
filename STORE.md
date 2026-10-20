# Chrome Web Store 上架材料

本文件是提交 Chrome Web Store 时逐字段复制粘贴用的清单。所有素材都在仓库里，
不需要另找。

| 项 | 值 |
| --- | --- |
| 上传包 | `bun run zip` → `build/y-api-sidebar-1.0.0-chrome.zip`（约 7.2 MB） |
| 商店图标 | [`docs/images/icon-128.png`](docs/images/icon-128.png)（128×128） |
| 截图 | `docs/images/store-1-chat.png`、`store-2-empty.png`、`store-3-settings.png`（均 1280×800） |
| 隐私政策 URL | `https://jiweiyeah.github.io/y-api-sidebar/privacy.html`（需先托管，见文末） |

---

## 1. 基本信息

**名称**（≤45 字符）

```
Y-API Sidebar - AI assistant for any page
```

**简短描述**（≤132 字符）

```
Ask AI about any page from your browser sidebar. Bring your own Y-API key — no local setup, no analytics.
```

**类别**：Productivity → Tools

**语言**：English（含 zh_CN / zh_TW / ja / de / fr / es / it / pt-BR / ru / ko / ar / fa / he / uk / ml / da / no / sv）

**官方主页**：`https://y-api.bestvirtualgoods.com/`

**支持链接**：`https://y-api.bestvirtualgoods.com/app/support`

**隐私政策**：`https://jiweiyeah.github.io/y-api-sidebar/privacy.html`

---

## 2. 详细描述

```
Y-API Sidebar puts an AI assistant in your browser's side panel. Ask about the
page you're reading, or start a plain chat.

WHY THIS ONE
- No local model to install. Add your Y-API API key once and start using it.
- Your conversations stay in your browser. No analytics, no telemetry, no
  remote config.
- Page text is extracted as Markdown, so text-only models work too — you don't
  need a vision model to ask about a page.

WHAT YOU CAN DO
- Summarize, translate or explain the page you're on
- Ask follow-up questions with the page as context
- Chat with a document you upload (PDF, txt, md)
- Save prompts you reuse, and keep chat history locally
- Export a conversation as txt, md, json or png
- Read replies aloud
- Works in 19 interface languages

GETTING A KEY
Sign up at https://y-api.bestvirtualgoods.com/, create a key under API Keys,
paste it into the extension. The endpoint is already filled in. You can point
the extension at any OpenAI-compatible endpoint instead, including one you
host yourself.

PRIVACY
Your API key, chat history and settings are stored locally in IndexedDB. The
only outbound traffic is the chat request you send to the endpoint you
configure. Full policy: https://jiweiyeah.github.io/y-api-sidebar/privacy.html

This extension is built on the open-source Page Assist project (MIT).
Source code: https://github.com/jiweiyeah/y-api-sidebar
```

---

## 3. 图片素材

| 素材 | 尺寸 | 文件 | 说明 |
| --- | --- | --- | --- |
| 商店图标 | 128×128 | `docs/images/icon-128.png` | 品牌标 |
| 截图 1 | 1280×800 | `docs/images/store-1-chat.png` | 对话界面，中文 |
| 截图 2 | 1280×800 | `docs/images/store-2-empty.png` | 空状态，中文 |
| 截图 3 | 1280×800 | `docs/images/store-3-settings.png` | 设置页，中文 |
| 小型宣传图 | 440×280 | 未做 | 可选，不影响审核 |
| 大型宣传图 | 1400×560 | 未做 | 可选，仅在精选位展示 |

截图里带中文 UI 是刻意的：目标用户包含中文市场，且与 listing 的多语言一致。
如果审核要求截图语言与 listing 主语言一致，用 `bun run dev` 切英文重截即可。

---

## 4. 权限说明（提交时逐条填）

| 权限 | 提交时必须写的理由 |
| --- | --- |
| `host_permissions: http://*/*, https://*/*` | 用户可自行配置任意 OpenAI 兼容端点（含自建服务），因此不能收窄到单一域名。默认端点已在设置页预置。 |
| `scripting`, `activeTab` | 仅在用户主动就当前页面提问时，读取该页面的文本内容作为上下文。 |
| `storage`, `unlimitedStorage` | 在本地保存聊天历史、设置与用户上传的知识库文档。 |
| `sidePanel`, `action` | 侧边栏界面与工具栏按钮。 |
| `contextMenus` | 右键菜单，对选中文本提问。 |
| `declarativeNetRequest` | 为用户自建端点调整请求头，规避 CORS 限制。 |
| `notifications` | 长任务完成时提醒用户。 |
| `tts` | 朗读回复，仅在用户开启时使用。 |

---

## 5. Privacy practices 表单

**是否收集或使用用户数据**：是

勾选的类别（仅此一项）：

- ☑ **Authentication information** —— 用户填写的 API key

用途说明（必填框）：

```
The API key is stored locally in the browser's IndexedDB and transmitted only
to the API endpoint the user configures, as an Authorization header, to
authenticate their own requests. It is never sent to the developer and never
shared with third parties.
```

其余全部**不勾选**：

- ☐ Personally identifiable information
- ☐ Health information
- ☐ Financial and payment information
- ☐ Personal communications
- ☐ Location
- ☐ Web history
- ☐ User activity
- ☐ Website content

**三个必答问题**：

| 问题 | 回答 |
| --- | --- |
| 是否出售或转让给第三方 | 否 |
| 是否用于与核心功能无关的用途 | 否 |
| 是否用于判定信用度或放贷 | 否 |

> 注意：这一栏必须与 `PRIVACY.md` 一致。API key 属于 Authentication
> information，勾选后必须填写上面的用途说明，否则会被打回。

---

## 6. 提交前 checklist

- [ ] 开发者账号已付 $5 注册费
- [ ] `bun run zip` 生成上传包
- [ ] 上传 zip
- [ ] 填名称、简短描述、详细描述（上方文案）
- [ ] 上传 128×128 图标
- [ ] 上传 3 张 1280×800 截图
- [ ] 填类别、语言、主页、支持链接
- [ ] Privacy practices 表单（第 5 节）
- [ ] 隐私政策托管到公网，URL 填进 listing
- [ ] 提交审核

---

## 7. 隐私政策托管

**已托管，直接填这个 URL：**

```
https://jiweiyeah.github.io/y-api-sidebar/privacy.html
```

托管方式：GitHub Pages，源为本仓库 `main` 分支的 `/docs` 目录
（`docs/_config.yml` 指定主题，`docs/privacy.md` 是 `PRIVACY.md` 的副本）。

更新政策时**两个文件都要改**，否则线上与实际不一致：

```bash
# 改完 PRIVACY.md 后
cp PRIVACY.md docs/privacy.md
git add PRIVACY.md docs/privacy.md && git commit -m "docs: 更新隐私政策" && git push
```

Pages 会在推送后 1–2 分钟自动重建。

### 如果以后想换到自有域名

`PRIVACY.md` 与 `STORE.md` 里的 URL 共出现 4 处，替换时全局搜
`jiweiyeah.github.io/y-api-sidebar/privacy.html` 即可。换域名后记得同步
`docs/_config.yml` 或改用 CNAME。

---

## 8. 已知的上游缺陷（不阻塞上架）

`z-ai/glm-5.3` 的流式响应只有 `: PING` 心跳，没有内容。扩展里表现为光标一直闪。

已确认是上游单模型问题：同一个 key 下 `qwen/qwen3.8-flash`、`minimax/minimax-m2.7`、
`deepseek/deepseek-v4.1-flash` 的流式都正常，只有这个模型非流式正常、流式空。

建议在 Y-API 侧修掉，或在扩展里对该模型降级为非流式请求。
