import {
  exportChatHistory,
  exportModels,
  exportNicknames,
  exportOAIConfigs,
  generateID,
  getProjectFolders,
  importChatHistoryV2,
  importModelsV2,
  importNicknamesV2,
  importOAIConfigsV2,
  importProjectFoldersV2
} from "@/db/dexie/helpers"
import type { HistoryInfo, Message, ModelNicknames, Models } from "@/db/dexie/types"
import { db } from "@/db/dexie/schema"
import { getStorageSyncEnabled } from "@/services/app"

export type ExportSection =
  | "chat"
  | "projectFolders"
  | "oaiConfigs"
  | "nicknames"
  | "models"
  | "storageLocal"
  | "storageSync"

export const ALL_EXPORT_SECTIONS: ExportSection[] = [
  "chat",
  "projectFolders",
  "oaiConfigs",
  "nicknames",
  "models",
  "storageLocal",
  "storageSync"
]

export const exportPageAssistData = async (
  sections: ExportSection[] = ALL_EXPORT_SECTIONS
) => {
  const wants = (s: ExportSection) => sections.includes(s)
  const data: Record<string, any> = {}

  if (wants("chat")) data.chat = await exportChatHistory()
  if (wants("projectFolders")) data.projectFolders = await getProjectFolders()
  if (wants("oaiConfigs")) data.oaiConfigs = await exportOAIConfigs()
  if (wants("nicknames")) data.nicknames = await exportNicknames()
  if (wants("models")) data.models = await exportModels()

  if (wants("storageLocal")) {
    data.storageLocal = await browser.storage.local.get()
  }

  if (wants("storageSync")) {
    const storageSyncEnabled = await getStorageSyncEnabled()
    data.storageSync = storageSyncEnabled
      ? await browser.storage.sync.get()
      : {}
  }

  const dataStr = JSON.stringify(data, null, 2)

  const blob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = `page-assist-${new Date().toISOString()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Detect a single-chat JSON download from the chat "More options" menu
 * (a top-level array of UI messages carrying `isBot` and `message`).
 */
export const isChatMessagesExport = (data: any): boolean => {
  if (!Array.isArray(data) || data.length === 0) return false
  return data.every(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      typeof entry.isBot === "boolean" &&
      typeof entry.message === "string"
  )
}

/**
 * Convert a single-chat JSON download into the Page Assist import shape
 * (`{ chat: [{ history, messages }] }`) so it flows through the existing
 * import pipeline. Fresh ids are generated to avoid colliding with chats
 * already in the database.
 */
export const convertChatMessagesToPageAssist = (
  data: any[]
): { chat: { history: HistoryInfo; messages: Message[] }[] } => {
  const historyId = generateID()
  const createdAt = Date.now()

  const title =
    data
      .find((m) => !m.isBot && m.message?.trim())
      ?.message?.trim()
      ?.slice(0, 50) || "Imported Chat"

  const history: HistoryInfo = {
    id: historyId,
    title,
    is_rag: false,
    message_source: "web-ui",
    createdAt
  }

  const messages: Message[] = data.map((m, index) => ({
    id: generateID(),
    history_id: historyId,
    name: m.name || m.modelName || "",
    role: m.isBot ? "assistant" : "user",
    content: m.message ?? "",
    images: Array.isArray(m.images) ? m.images : [],
    sources: Array.isArray(m.sources) ? m.sources : [],
    createdAt: createdAt + index,
    generationInfo: m.generationInfo,
    reasoning_time_taken: m.reasoning_time_taken,
    modelName: m.modelName,
    modelImage: m.modelImage
  }))

  return { chat: [{ history, messages }] }
}

export const parseImportFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result as string))
      } catch (e) {
        reject(e)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

export const getAvailableImportSections = (
  data: any
): Partial<Record<ExportSection, number>> => {
  const counts: Partial<Record<ExportSection, number>> = {}

  if (Array.isArray(data?.chat)) counts.chat = data.chat.length
  if (Array.isArray(data?.projectFolders)) {
    counts.projectFolders = data.projectFolders.length
  }
  if (Array.isArray(data?.oaiConfigs)) counts.oaiConfigs = data.oaiConfigs.length
  if (Array.isArray(data?.nicknames)) counts.nicknames = data.nicknames.length
  if (Array.isArray(data?.models)) counts.models = data.models.length
  if (data?.storageLocal && typeof data.storageLocal === "object") {
    counts.storageLocal = Object.keys(data.storageLocal).length
  }
  if (data?.storageSync && typeof data.storageSync === "object") {
    counts.storageSync = Object.keys(data.storageSync).length
  }

  return counts
}

export const importPageAssistDataFromObject = async (
  data: any,
  sections: ExportSection[] = ALL_EXPORT_SECTIONS
) => {
  const wants = (s: ExportSection) => sections.includes(s)
  const options = {}

  await db.transaction(
    "rw",
    [
      db.chatHistories,
      db.messages,
      db.openaiConfigs,
      db.modelNickname,
      db.customModels,
      db.projectFolders
    ],
    async () => {
      if (wants("chat") && data?.chat && Array.isArray(data.chat)) {
        await importChatHistoryV2(data.chat, options)
      }

      if (
        wants("projectFolders") &&
        data?.projectFolders &&
        Array.isArray(data.projectFolders)
      ) {
        await importProjectFoldersV2(data.projectFolders, options)
      }

      if (
        wants("oaiConfigs") &&
        data?.oaiConfigs &&
        Array.isArray(data.oaiConfigs)
      ) {
        await importOAIConfigsV2(data.oaiConfigs, options)
      }

      if (
        wants("nicknames") &&
        data?.nicknames &&
        Array.isArray(data.nicknames)
      ) {
        await importNicknamesV2(data.nicknames as ModelNicknames, options)
      }

      if (wants("models") && data?.models && Array.isArray(data.models)) {
        await importModelsV2(data.models as Models, options)
      }
    }
  )

  if (
    wants("storageLocal") &&
    data?.storageLocal &&
    typeof data.storageLocal === "object"
  ) {
    await browser.storage.local.set(data.storageLocal)
  }

  if (wants("storageSync")) {
    const storageSyncEnabled = await getStorageSyncEnabled()
    if (
      storageSyncEnabled &&
      data?.storageSync &&
      typeof data.storageSync === "object"
    ) {
      await browser.storage.sync.set(data.storageSync)
    }
  }
}

export const importPageAssistData = async (
  file: File,
  sections: ExportSection[] = ALL_EXPORT_SECTIONS
) => {
  const data = await parseImportFile(file)
  await importPageAssistDataFromObject(data, sections)
}
