import { create } from "zustand"

/**
 * Per-chat overrides for the currently selected Y-API model. Only the
 * OpenAI-compatible sampling parameters the UI actually exposes live here;
 * persisted per-model defaults are handled by `services/model-settings`.
 */
type CurrentChatModelSettings = {
  temperature?: number
  topK?: number
  topP?: number
  numPredict?: number
  minP?: number
  reasoningEffort?: string
  thinking?: boolean | "low" | "medium" | "high"
  systemPrompt?: string
  ocrLanguage?: string

  setX: (key: string, value: any) => void
  setSystemPrompt: (systemPrompt: string) => void
  setThinking: (thinking: boolean | "low" | "medium" | "high") => void
  setOcrLanguage: (ocrLanguage: string) => void
  reset: () => void
}

export const useStoreChatModelSettings = create<CurrentChatModelSettings>(
  (set) => ({
    setX: (key: string, value: any) => set({ [key]: value }),
    setSystemPrompt: (systemPrompt: string) => set({ systemPrompt }),
    setThinking: (thinking: boolean | "low" | "medium" | "high") =>
      set({ thinking }),
    setOcrLanguage: (ocrLanguage: string) => set({ ocrLanguage }),
    reset: () =>
      set({
        temperature: undefined,
        topK: undefined,
        topP: undefined,
        numPredict: undefined,
        minP: undefined,
        reasoningEffort: undefined,
        thinking: undefined,
        systemPrompt: undefined,
        ocrLanguage: undefined
      })
  })
)
