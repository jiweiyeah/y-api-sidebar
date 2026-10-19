# Chrome Web Store 上架材料

上传包：`build/y-api-sidebar-1.0.0-chrome.zip`（`bun run zip` 生成，7.19 MB）

## 商店信息（直接复制）

**名称**（上限 45 字符）
```
Y-API Sidebar - AI assistant for any page
```

**简短描述**（上限 132 字符）
```
Ask AI about any page from your browser sidebar. Bring your own Y-API key — no local setup, no data leaves your browser except the chat you send.
```

**详细描述**
```
Y-API Sidebar puts an AI assistant in your browser's side panel. Ask about the page
you're reading, or start a plain chat.

WHY THIS ONE
- No local model to install. Add your Y-API API key once and start using it.
- Your conversations stay in your browser. We don't run analytics, telemetry or
  remote config.
- Works with every model in the Y-API catalogue, including Chinese models that
  other clients bury.

WHAT YOU CAN DO
- Summarize, translate or explain the page you're on
- Ask follow-up questions with the page as context
- Chat with a document you upload (PDF, txt, md)
- Save prompts you reuse, and keep chat history locally
- Read replies aloud
- Works with text-based models — no vision model required

GETTING A KEY
Sign up at https://y-api.bestvirtualgoods.com/, create a key under "API Keys",
paste it into the extension. The extension ships with the Y-API endpoint preset.

PRIVACY
Your API key, chat history and settings are stored locally in IndexedDB. The only
outbound traffic is the chat request you send to the endpoint you configure. The
full policy is in PRIVACY.md in the repository.

This extension is built on the open-source Page Assist project (MIT).
```

**类别**：Productivity → Tools
**语言**：English（含 zh_CN / zh_TW / ja / de / fr / es / it / pt-BR / ru / ko / ar / fa / he / uk / ml / da / no / sv / cz）

## 需要的图片素材

| 素材 | 尺寸 | 状态 |
| --- | --- | --- |
| 商店图标 | 128×128 PNG | ✅ `src/public/icon/128.png` |
| 截图 1 | 1280×800 或 640×400 | ⬜ 待做：侧边栏对话 |
| 截图 2 | 同上 | ⬜ 待做：设置页 provider |
| 截图 3 | 同上 | ⬜ 待做：模型选择 |
| 小型宣传图 | 440×280 | ⬜ 可选 |
| 大型宣传图 | 1400×560 | ⬜ 可选 |

## 权限说明（审核时会问）

| 权限 | 提交时必须写的理由 |
| --- | --- |
| `host_permissions: http/https` | 用户可自行配置任意 OpenAI 兼容端点（含自建），因此不能收窄到单一域名 |
| `scripting`, `activeTab` | 仅在用户主动提问时读取当前页内容 |
| `declarativeNetRequest` | 为用户自建端点调整请求头以规避 CORS |
| `unlimitedStorage` | 本地保存聊天历史与知识库文档 |
| `tts` | 朗读回复 |
| `notifications` | 长任务完成提醒 |

## 数据使用声明（Privacy practices 表单）

- 是否收集用户数据：**是**（仅"Authentication information" —— API key，存于本地且仅发给用户配置的端点）
- 是否出售给第三方：否
- 是否用于与核心功能无关的用途：否
- 是否用于判定信用度/放贷：否

> 注意：这一栏必须与 PRIVACY.md 一致。API key 属于 "Authentication information"，
> 勾选后必须填写用途说明，否则会被打回。

## 上架前 checklist

- [ ] 开发者账号已付 $5 注册费
- [ ] 上传 zip
- [ ] 填商店信息（上方文案）
- [ ] 上传 3 张截图
- [ ] Privacy practices 表单
- [ ] 隐私政策 URL（需托管在公网，可放 `https://y-api.bestvirtualgoods.com/` 下）
- [ ] 提交审核

## 已知的上游缺陷（不阻塞上架，但会被用户遇到）

- `z-ai/glm-5.3` 流式返回只有 `: PING` 心跳，无内容。扩展里表现为光标一直闪。
  已确认是上游单模型问题（同 key 下 qwen / minimax / deepseek 流式正常）。
  建议在 Y-API 侧修掉，或在扩展里对该模型降级为非流式。
