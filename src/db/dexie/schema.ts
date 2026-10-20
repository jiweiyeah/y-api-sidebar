import Dexie, { type Table } from "dexie"
import {
  HistoryInfo,
  Message,
  OpenAIModelConfig,
  Model,
  ModelNickname,
  ProjectFolder
} from "./types"

/**
 * Only the tables the slimmed-down extension still uses.
 *
 * The previous releases shipped up to schema v5 with knowledge / vector /
 * memory / MCP tables. Declaring v6 with a reduced table set lets Dexie
 * upgrade an existing v1–v5 database in place and drop the tables that are
 * no longer declared (their data goes with them). Fresh installs jump
 * straight to v6.
 */
export class PageAssistDexieDB extends Dexie {
  chatHistories!: Table<HistoryInfo>
  messages!: Table<Message>
  openaiConfigs!: Table<OpenAIModelConfig>
  customModels!: Table<Model>
  modelNickname!: Table<ModelNickname>
  projectFolders!: Table<ProjectFolder>

  constructor() {
    super("PageAssistDatabase")

    this.version(6).stores({
      chatHistories:
        "id, title, is_rag, message_source, is_pinned, createdAt, model_id, folder_id",
      messages: "id, history_id, name, role, content, createdAt, modelName",
      openaiConfigs:
        "id, name, baseUrl, apiKey, createdAt, provider, db_type",
      customModels:
        "id, model_id, name, provider_id, lookup, model_type, db_type",
      modelNickname: "id, model_id, model_name, model_avatar",
      projectFolders: "id, title, createdAt"
    })
  }
}

export const db = new PageAssistDexieDB()
