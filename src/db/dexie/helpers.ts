import {
  type ChatHistory as ChatHistoryType,
  type Message as MessageType
} from "~/store/option"
import {
  type HistoryInfo,
  type MessageHistory,
  type Message,
  type Models,
  type ModelNicknames,
  type ProjectFolder,
  type ProjectFolders
} from "./types"
import { PageAssistDatabase } from "./chat"
import { db as chatDB } from "./schema"
import { OpenAIModelDb } from "./openai"
import { ModelNickname } from "./nickname"
import { ModelDb } from "./models"

// Helper function to generate IDs (keeping the same format)
export const generateID = () => {
  return "pa_xxxx-xxxx-xxx-xxxx".replace(/[x]/g, () => {
    const r = Math.floor(Math.random() * 16)
    return r.toString(16)
  })
}

// Chat History Functions
export const saveHistory = async (
  title: string,
  is_rag?: boolean,
  message_source?: "copilot" | "web-ui" | "branch"
) => {
  const id = generateID()
  const createdAt = Date.now()
  const history: HistoryInfo = {
    id,
    title: title?.trim()?.length > 0 ? title : "Untitled Chat",
    createdAt,
    is_rag: is_rag || false,
    message_source
  }
  const db = new PageAssistDatabase()
  await db.addChatHistory(history)
  return history
}

export const updateChatHistoryCreatedAt = async (history_id: string) => {
  const createdAt = Date.now()
  const db = new PageAssistDatabase()
  await db.updateChatHistoryCreatedAt(history_id, createdAt)
}

export const updateMessage = async (
  history_id: string,
  message_id: string,
  content: string
) => {
  const db = new PageAssistDatabase()
  await db.updateMessage(history_id, message_id, content)
}

export const saveMessage = async ({
  content,
  history_id,
  name,
  role,
  images,
  source,
  generationInfo,
  modelImage,
  modelName,
  reasoning_time_taken,
  time
}: {
  history_id: string
  name: string
  role: "user" | "assistant" | "system"
  content: string
  images: string[]
  source?: any[]
  time?: number
  generationInfo?: any
  reasoning_time_taken?: number
  modelName?: string
  modelImage?: string
}) => {
  const id = generateID()
  let createdAt = Date.now()
  if (time) {
    createdAt += time
  }
  const message: Message = {
    id,
    history_id,
    name,
    role,
    content,
    images,
    createdAt,
    sources: source,
    generationInfo: generationInfo,
    reasoning_time_taken,
    modelName,
    modelImage
  }
  const db = new PageAssistDatabase()
  await db.addMessage(message)
  return message
}

export const formatToChatHistory = (
  messages: MessageHistory
): ChatHistoryType => {
  messages.sort((a, b) => a.createdAt - b.createdAt)
  return messages.map((message) => {
    return {
      content: message.content,
      role: message.role,
      image:
        message.images && message.images.length > 0
          ? message.images[0]
          : undefined,
      images: message.images,
      createdAt: message.createdAt
    }
  })
}

export const formatToConversationHistory = (
  messages: MessageHistory
): ChatHistoryType => formatToChatHistory(messages)

export const formatToMessage = (messages: MessageHistory): MessageType[] => {
  messages.sort((a, b) => a.createdAt - b.createdAt)
  return messages.map((message) => {
    return {
      isBot: message.role !== "user",
      message: message.content,
      name: message.name,
      sources: message?.sources || [],
      images: message.images || [],
      generationInfo: message?.generationInfo,
      reasoning_time_taken: message?.reasoning_time_taken,
      modelName: message?.modelName,
      modelImage: message?.modelImage,
      id: message.id,
      createdAt: message.createdAt
    }
  })
}

export const deleteByHistoryId = async (history_id: string) => {
  const db = new PageAssistDatabase()
  await db.deleteMessage(history_id)
  await db.removeChatHistory(history_id)
  return history_id
}

export const updateHistory = async (id: string, title: string) => {
  await chatDB.chatHistories.update(id, { title })
}

export const pinHistory = async (id: string, is_pinned: boolean) => {
  await chatDB.chatHistories.update(id, { is_pinned })
}

export const removeMessageUsingHistoryId = async (history_id: string) => {
  const db = new PageAssistDatabase()
  const chatHistory = await db.getChatHistory(history_id)
  if (chatHistory.length > 0) {
    const sortedHistory = chatHistory.sort((a, b) => a.createdAt - b.createdAt)
    const lastUserIndex = sortedHistory.findLastIndex(
      (message) => message.role === "user"
    )

    if (lastUserIndex === -1) {
      return
    }

    const messagesToDelete = sortedHistory.slice(lastUserIndex + 1)
    for (const message of messagesToDelete) {
      await db.removeMessage(history_id, message.id)
    }
  }
}

export const updateMessageByIndex = async (
  history_id: string,
  index: number,
  message: string
) => {
  try {
    const db = new PageAssistDatabase()
    const chatHistory = await db.getChatHistory(history_id)
    const sortedHistory = chatHistory.sort((a, b) => a.createdAt - b.createdAt)
    if (sortedHistory[index]) {
      await db.updateMessage(history_id, sortedHistory[index].id, message)
    }
  } catch (e) {
    // temp chat will break
  }
}

export const deleteChatForEdit = async (history_id: string, index: number) => {
  const db = new PageAssistDatabase()
  const chatHistory = await db.getChatHistory(history_id)
  const sortedHistory = chatHistory.sort((a, b) => a.createdAt - b.createdAt)

  // Delete messages after the specified index
  const messagesToDelete = sortedHistory.slice(index + 1)
  for (const message of messagesToDelete) {
    await db.removeMessage(history_id, message.id)
  }
}

// Export/Import Functions
export const exportChatHistory = async () => {
  const db = new PageAssistDatabase()
  const chatHistories = await db.getChatHistories()
  const messages = await Promise.all(
    chatHistories.map(async (history) => {
      const messages = await db.getChatHistory(history.id)
      return { history, messages }
    })
  )
  return messages
}

export const exportOAIConfigs = async () => {
  const db = new OpenAIModelDb()
  return await db.getAll()
}

export const exportNicknames = async () => {
  const modelNickname = new ModelNickname()
  const data = await modelNickname.getAllModelNicknames()
  return data
}

export const exportModels = async () => {
  const db = new ModelDb()
  return db.getAll()
}

export const importNicknamesV2 = async (
  nicknames: ModelNicknames,
  options: {
    replaceExisting?: boolean
    mergeData?: boolean
  } = {}
) => {
  const db = new ModelNickname()
  await db.importDataV2(nicknames, options)
}

export const importModelsV2 = async (
  models: Models,
  options: {
    replaceExisting?: boolean
    mergeData?: boolean
  } = {}
) => {
  const db = new ModelDb()
  await db.importDataV2(models, options)
}

export const importOAIConfigsV2 = async (
  data: Models extends never ? never : any,
  options: {
    replaceExisting?: boolean
    mergeData?: boolean
  } = {}
) => {
  const db = new OpenAIModelDb()
  return db.importDataV2(data, options)
}

// Utility Functions
export const getRecentChatFromCopilot = async () => {
  const db = new PageAssistDatabase()
  const chatHistories = await db.getChatHistories()
  if (chatHistories.length === 0) return null
  const history = chatHistories.find(
    (history) => history.message_source === "copilot"
  )
  if (!history) return null

  const messages = await db.getChatHistory(history.id)

  return { history, messages }
}

export const getRecentChatFromWebUI = async () => {
  const db = new PageAssistDatabase()
  const chatHistories = await db.getChatHistories()
  if (chatHistories.length === 0) return null
  const history = chatHistories.find(
    (history) => history.message_source === "web-ui"
  )
  if (!history) return null

  const messages = await db.getChatHistory(history.id)

  return { history, messages }
}

export const getTitleById = async (id: string) => {
  const db = new PageAssistDatabase()
  const title = await db.getChatHistoryTitleById(id)
  return title
}

export const getLastChatHistory = async (history_id: string) => {
  const db = new PageAssistDatabase()
  const messages = await db.getChatHistory(history_id)
  messages.sort((a, b) => a.createdAt - b.createdAt)
  return messages.findLast((message) => message.role === "assistant")
}

export const deleteHistoriesByDateRange = async (
  rangeLabel: string
): Promise<string[]> => {
  const db = new PageAssistDatabase()
  const allHistories = await db.getChatHistories()
  const now = new Date()
  const today = new Date(now.setHours(0, 0, 0, 0))
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)
  let historiesToDelete: HistoryInfo[] = []

  switch (rangeLabel) {
    case "today":
      historiesToDelete = allHistories.filter(
        (item) => !item.is_pinned && new Date(item?.createdAt) >= today
      )
      break
    case "yesterday":
      historiesToDelete = allHistories.filter(
        (item) =>
          !item.is_pinned &&
          new Date(item?.createdAt) >= yesterday &&
          new Date(item?.createdAt) < today
      )
      break
    case "last7Days":
      historiesToDelete = allHistories.filter(
        (item) =>
          !item.is_pinned &&
          new Date(item?.createdAt) >= lastWeek &&
          new Date(item?.createdAt) < yesterday
      )
      break
    case "older":
      historiesToDelete = allHistories.filter(
        (item) => !item.is_pinned && new Date(item?.createdAt) < lastWeek
      )
      break
    case "pinned":
      historiesToDelete = allHistories.filter((item) => item.is_pinned)
      break
    default:
      return []
  }

  const deletedIds: string[] = []
  for (const history of historiesToDelete) {
    await db.deleteMessage(history.id)
    await db.removeChatHistory(history.id)
    deletedIds.push(history.id)
  }

  return deletedIds
}

export const importChatHistoryV2 = async (
  data: any[],
  options: {
    replaceExisting?: boolean
    mergeData?: boolean
  } = {}
) => {
  const chatDb = new PageAssistDatabase()
  return chatDb.importChatHistoryV2(data, options)
}

export const importProjectFoldersV2 = async (
  data: ProjectFolders,
  options: {
    replaceExisting?: boolean
    mergeData?: boolean
  } = {}
) => {
  const db = new PageAssistDatabase()
  return db.importProjectFoldersV2(data, options)
}

export const getProjectFolders = async (): Promise<ProjectFolders> => {
  const db = new PageAssistDatabase()
  return db.getProjectFolders()
}

export const addProjectFolder = async (
  title: string
): Promise<ProjectFolder> => {
  const db = new PageAssistDatabase()
  const id = generateID()
  const createdAt = Date.now()
  const folder = { id, title, createdAt }
  await db.addProjectFolder(folder)
  return folder
}

export const updateProjectFolder = async (id: string, title: string) => {
  const db = new PageAssistDatabase()
  await db.updateProjectFolder(id, title)
}

export const deleteProjectFolder = async (id: string) => {
  const db = new PageAssistDatabase()
  await db.deleteProjectFolder(id)
}

export const assignHistoryToFolder = async (
  history_id: string,
  folder_id?: string
) => {
  const db = new PageAssistDatabase()
  await db.assignHistoryToFolder(history_id, folder_id)
}

export const updateLastUsedModel = async (
  history_id: string,
  model_id: string
) => {
  const chatDb = new PageAssistDatabase()
  return chatDb.updateLastUsedModel(history_id, model_id)
}
