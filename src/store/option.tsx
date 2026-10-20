import { create } from "zustand"
import { isFireFoxPrivateMode } from "@/utils/is-private-mode"

export type Message = {
  isBot: boolean
  name: string
  message: string
  sources: any[]
  images?: string[]
  reasoning_time_taken?: number
  id?: string
  createdAt?: number
  modelName?: string
  modelImage?: string
  generationInfo?: any
}

export type ChatHistory = {
  role: "user" | "assistant" | "system"
  content: string
  image?: string
  images?: string[]
  createdAt?: number
}[]

type State = {
  messages: Message[]
  setMessages: (messages: Message[]) => void
  history: ChatHistory
  setHistory: (history: ChatHistory) => void
  streaming: boolean
  setStreaming: (streaming: boolean) => void
  isFirstMessage: boolean
  setIsFirstMessage: (isFirstMessage: boolean) => void
  historyId: string | null
  setHistoryId: (history_id: string | null) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  isProcessing: boolean
  setIsProcessing: (isProcessing: boolean) => void
  selectedModel: string | null
  setSelectedModel: (selectedModel: string) => void

  temporaryChat: boolean
  setTemporaryChat: (temporaryChat: boolean) => void

  useOCR: boolean
  setUseOCR: (useOCR: boolean) => void
}

export const useStoreMessageOption = create<State>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  history: [],
  setHistory: (history) => set({ history }),
  streaming: false,
  setStreaming: (streaming) => set({ streaming }),
  isFirstMessage: true,
  setIsFirstMessage: (isFirstMessage) => set({ isFirstMessage }),
  historyId: null,
  setHistoryId: (historyId) => set({ historyId }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  isProcessing: false,
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  selectedModel: null,
  setSelectedModel: (selectedModel) => set({ selectedModel }),

  temporaryChat: isFireFoxPrivateMode,
  setTemporaryChat: (temporaryChat) => set({ temporaryChat }),

  useOCR: false,
  setUseOCR: (useOCR) => set({ useOCR })
}))
