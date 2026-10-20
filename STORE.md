# Chrome Web Store 上架材料

逐字段复制粘贴用。本文件内容与 `v1.0.0` 的实际构建一致；截图全部由
`build/chrome-mv3` 真实运行截取，没有画稿。

## 0. 速查表

| 项 | 值 |
| --- | --- |
| 上传包 | `build/y-api-sidebar-1.0.0-chrome.zip`（5.5 MB） |
| Edge 包 | `build/y-api-sidebar-1.0.0-edge.zip`（5.5 MB） |
| 商店图标 | `docs/images/icon-128.png`（128×128 PNG） |
| 截图（英文，主语言） | `docs/images/store/en/1..4-*.png`（1280×800） |
| 截图（中文） | `docs/images/store/zh-1..4-*.png`（1280×800） |
| 隐私政策 | `https://jiweiyeah.github.io/y-api-sidebar/privacy.html` |
| 源码仓库 | `https://github.com/jiweiyeah/y-api-sidebar` |

---

## 1. 基本信息

**名称**（41 / 45 字符）

```
Y-API Sidebar - AI assistant for any page
```

**简短描述**（73 / 132 字符）

```
Ask AI about any page. Bring your own Y-API key, no local setup required.
```

> 想强调侧边栏可换成下面这条（74 字符）：
> `AI assistant in your browser sidebar. Bring your own Y-API key — no setup, no tracking.`

**类别**：Productivity → Tools

**语言**：商店 listing 14 个（`src/public/_locales`）：

English, 简体中文, 繁體中文, 日本語, Deutsch, Français, Español, Italiano,
Português (Brasil), Русский, Dansk, Norsk, Svenska, فارسی

扩展界面另有 6 个语言只在应用内提供、未提交商店 listing：한국어, العربية,
עברית, Українська, മലയാളം, Čeština（合计 20 种界面语言）。

**官方主页**：`https://y-api.bestvirtualgoods.com/`

**支持链接**：`https://y-api.bestvirtualgoods.com/app/support`

---

## 2. 详细描述（英文，主语言）

```
Y-API Sidebar puts an AI assistant in your browser's side panel. Write,
translate, explain or refactor — without switching tabs. Bring your own Y-API
key and you are ready; there is nothing to install and nothing to configure.

WHY THIS ONE
- No local model runtime. Paste your API key once and start.
- One provider, fixed endpoint. No dropdowns to get wrong.
- Your conversations stay in this browser. No analytics, no telemetry, no
  remote config, no account.

WHAT YOU CAN DO
- Chat in the side panel or in the full-page window
- Pull the live model list from Y-API and add models in bulk; models you
  already added are greyed out
- Give a model a nickname or an avatar, or tune temperature, top-p, thinking
  level and other sampling parameters per model
- Paste or drop an image and ask about it, with optional on-device OCR
- Watch reasoning models think, shown separately from the final answer
- Keep chat history locally with folders and pins; export to txt, md, json, png
- Search your history; resume the last chat when the panel opens
- Switch between light and dark themes; 20 interface languages, 14 in the store listing

GETTING A KEY
Sign up at https://y-api.bestvirtualgoods.com/, create a key under API Keys,
paste it into Settings → OpenAI Compatible API. The endpoint
https://api.y-api.bestvirtualgoods.com/v1 is built in and not editable.

PRIVACY
Your API key, chat history and settings are stored locally in IndexedDB. The
only outbound traffic is the request you send to the Y-API endpoint. Full
policy: https://jiweiyeah.github.io/y-api-sidebar/privacy.html

Built on the open-source Page Assist project (MIT).
Source code: https://github.com/jiweiyeah/y-api-sidebar
```

---

## 3. 详细描述（中文，用于 zh_CN listing）

```
Y-API Sidebar 把 AI 助手放进浏览器侧边栏。写作、翻译、解释、改代码，不用来回切
标签页。填入自己的 Y-API 密钥即可使用，无需本地部署，也没有多余配置。

为什么选它
- 不需要安装本地模型运行时，粘贴密钥就能开始。
- 只有一个提供商，端点固定，不存在选错供应商的问题。
- 对话只留在这个浏览器里：无统计、无遥测、无远程配置、无账号体系。

能做什么
- 在侧边栏或整页窗口里聊天
- 从 Y-API 实时拉取模型列表并批量添加，已添加的模型自动置灰
- 给模型设置昵称、头像，单独调整 temperature、top-p、思考等级等采样参数
- 粘贴或拖入图片提问，可选本地 OCR
- 推理模型的思考过程单独展示，不混在回答里
- 聊天历史本地保存，支持文件夹与置顶，可导出 txt / md / json / png
- 历史会话可搜索；打开侧边栏可恢复上次对话
- 浅色 / 深色主题，20 种界面语言

获取密钥
在 https://y-api.bestvirtualgoods.com/ 注册，进入 API Keys 创建密钥，粘贴到
设置 → OpenAI 兼容 API。端点 https://api.y-api.bestvirtualgoods.com/v1 已内置且
不可修改。

隐私
API 密钥、聊天历史与设置都保存在本机 IndexedDB。唯一的对外请求是发送到 Y-API
端点的对话请求。完整政策：https://jiweiyeah.github.io/y-api-sidebar/privacy.html

基于开源项目 Page Assist（MIT）构建。
源码：https://github.com/jiweiyeah/y-api-sidebar
```

---

## 4. 图片素材

全部为 **1280×800 PNG**，符合商店要求（1280×800 或 640×400）。

| 顺序 | 英文（主语言） | 中文 | 展示内容 |
| --- | --- | --- | --- |
| 1 | `docs/images/store/en/1-sidebar-chat.png` | `docs/images/store/zh-1-sidebar-chat.png` | 侧边栏对话 |
| 2 | `docs/images/store/en/2-fetch-models.png` | `docs/images/store/zh-2-fetch-models.png` | 拉取模型列表弹窗 |
| 3 | `docs/images/store/en/3-api-key.png` | `docs/images/store/zh-3-api-key.png` | API 密钥设置页 |
| 4 | `docs/images/store/en/4-manage-models.png` | `docs/images/store/zh-4-manage-models.png` | 模型管理表格 |

商店图标：`docs/images/icon-128.png`（128×128）。

**需要补充的可选项**

- 小型宣传图 440×280：可选，不影响审核。
- 大型宣传图 1400×560：可选，仅精选位展示。
- 演示视频：可选。

**截图与功能一致性**

四张图里出现的每个元素都在当前构建中可用：侧边栏对话、拉取模型列表
（含「已添加」置灰）、固定端点 + API Key 表单、模型管理表格。**没有**出现
RAG、MCP、知识库、提示词、网页搜索、TTS、Page Action、WebMCP 等已删除功能。

> 已知不一致（按决策保留）：名称与简短描述里的 "any page / 任意网页" 指
> "在任何网页旁使用侧边栏"，当前构建**不读取网页内容**（无 `tabs` / `scripting`
> 权限，无内容脚本）。若审核质询，按此口径答复，或临时改为
> "AI assistant in your browser sidebar"。

---

## 5. 权限说明（逐条填写 justification）

manifest 实际只有 4 项权限 + 1 项 host 权限：

| 权限 | 提交时填写的理由 |
| --- | --- |
| `host_permissions: https://api.y-api.bestvirtualgoods.com/*` | 唯一后端端点，用于拉取模型列表与发送聊天请求。端点固定，用户不可更改，也不访问其他站点。 |
| `storage` | 保存用户填写的 API Key、聊天历史、模型列表和界面偏好。 |
| `unlimitedStorage` | 聊天历史与本地 OCR 语言包可能超出默认配额。 |
| `sidePanel` | 扩展的主体界面就是浏览器的侧边栏。 |
| `contextMenus` | 右键菜单用于快速打开侧边栏或整页聊天窗口。 |

未申请的权限（若审核问起可说明）：`scripting`、`activeTab`、`tabs`、`webRequest`、
`declarativeNetRequest`、`notifications`、`tts`，以及宽泛的 `http://*/*`、
`https://*/*`、`file://*/*`。扩展**不读取任何网页内容**，也不注入内容脚本。

---

## 6. Privacy practices 表单

**是否收集或使用用户数据**：是

勾选类别（仅此一项）：

- ☑ **Authentication information** —— 用户自己填写的 Y-API API Key

用途说明：

```
The API key is provided by the user, stored only in the browser's IndexedDB,
and sent only to the Y-API endpoint (https://api.y-api.bestvirtualgoods.com/v1)
as an Authorization header so the user's own requests can be authenticated. It
is never transmitted to the developer and never shared with third parties.
```

其余全部**不勾选**：PII、健康信息、财务与支付信息、个人通信、位置、网页浏览历史、
用户活动、网站内容。

> 注意：扩展**不上传**聊天内容给开发者；聊天请求直接发往用户自己的 Y-API 端点。
> 因此「Website content」「Personal communications」都不勾选。这一栏必须与
> `PRIVACY.md` 第 3 节保持一致。

**三个必答问题**

| 问题 | 回答 |
| --- | --- |
| 是否出售或转让用户数据给第三方 | 否 |
| 是否将数据用于与核心功能无关的用途 | 否 |
| 是否用于判定信用度或放贷 | 否 |

**远程代码**：不使用。所有 JS 与 WASM（含 Tesseract OCR 核心、`eng-fast` 语言包）
都打包在扩展内。

---

## 7. 提交前 checklist

- [ ] 开发者账号已注册（Chrome 一次性 $5）
- [ ] `bun run zip` 生成 `build/y-api-sidebar-1.0.0-chrome.zip`
- [ ] 上传 zip
- [ ] 填名称 / 简短描述 / 详细描述
- [ ] 上传 128×128 图标
- [ ] 上传 4 张 1280×800 截图（英文版）
- [ ] 选类别 Productivity → Tools
- [ ] 填主页与支持链接
- [ ] 填 Privacy practices（第 6 节）
- [ ] 隐私政策 URL 可访问（第 8 节）
- [ ] 提交审核

**Edge Add-ons** 额外需要：`build/y-api-sidebar-1.0.0-edge.zip`、Store listing
（与上面文案相同）、Privacy policy URL。Edge 对权限说明的措辞要求更严格，
直接复用第 5 节即可。

---

## 8. 隐私政策托管

已托管，直接填：

```
https://jiweiyeah.github.io/y-api-sidebar/privacy.html
```

GitHub Pages，源为本仓库 `main` 分支的 `/docs` 目录。`docs/privacy.md` 是
`PRIVACY.md` 的副本，两份必须同步：

```bash
cp PRIVACY.md docs/privacy.md
git add PRIVACY.md docs/privacy.md && git commit -m "docs: 更新隐私政策" && git push
```

Pages 在推送后 1–2 分钟自动重建。

---

## 9. 重新生成截图

截图是真实扩展跑出来的，不是设计稿。流程：

```bash
bun run build:chrome
# 用 Playwright 加载 build/chrome-mv3，向 IndexedDB 写入演示数据，
# 以 2x 截取元素级图片，再用 HTML 模板合成 1280×800
```

要点：

- 演示数据只写 `chatHistories`、`messages`、`openaiConfigs`、`customModels`，
  API Key 用 `sk-demo-placeholder`，**不要用真实密钥**。
- 「拉取模型列表」弹窗通过拦截 `/v1/models` 请求伪造返回，避免消耗真实额度。
- 每次改 UI 后重跑，避免商店图与实际界面不一致（本次即因此重拍：旧图仍有
  MCP、Page Action、WebMCP、知识库、提示词等已删除的入口）。

---

## 10. 已知的上游缺陷（不阻塞上架）

`z-ai/glm-5.3` 的流式响应只返回 `: PING` 心跳，没有内容，扩展里表现为光标一直闪。
非流式正常。同 key 下 `qwen/qwen3.8-flash`、`minimax/minimax-m2.7`、
`deepseek/deepseek-v4.1-flash` 流式均正常。建议在 Y-API 侧修复，或对该模型降级为
非流式请求。
