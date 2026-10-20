export type HistoryInfo = {
  id: string
  title: string
  is_rag: boolean
  message_source?: "copilot" | "web-ui" | "branch"
  is_pinned?: boolean
  createdAt: number
  model_id?: string
  folder_id?: string
}

export type Message = {
  id: string
  history_id: string
  name: string
  role: "user" | "assistant" | "system"
  content: string
  images?: string[]
  sources?: string[]
  createdAt: number
  reasoning_time_taken?: number
  generationInfo?: any
  modelName?: string
  modelImage?: string
}

export type OpenAIModelConfig = {
  id: string
  name: string
  baseUrl: string
  apiKey?: string
  createdAt: number
  provider?: string
  db_type: string
}

export type Model = {
  id: string
  model_id: string
  name: string
  provider_id: string
  lookup: string
  model_type: string
  db_type: string
}

export type ModelNickname = {
  id: string
  model_id: string
  model_name: string
  model_avatar?: string
}

export type ProjectFolder = {
  id: string
  title: string
  createdAt: number
}

export type MessageHistory = Message[]
export type ChatHistory = HistoryInfo[]
export type Models = Model[]
export type ModelNicknames = ModelNickname[]
export type ProjectFolders = ProjectFolder[]
