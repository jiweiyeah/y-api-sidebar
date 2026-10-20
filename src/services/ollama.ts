import { Storage } from "@plasmohq/storage"
import { getChatModels } from "@/db/dexie/models"

/**
 * This module used to be the Ollama integration layer. Y-API Sidebar ships a
 * single fixed provider, so what remains here is only the storage-backed
 * system prompt preference the chat modes still read plus the model list
 * adapter.
 *
 * The file keeps its old name purely so the remaining import sites do not
 * churn.
 */

const storage = new Storage()

/**
 * Chat model list for the pickers. Every entry comes from the Y-API provider
 * models stored in IndexedDB.
 */
export const fetchChatModels = async () => {
  try {
    return await getChatModels("chat")
  } catch (e) {
    console.error("Failed to load chat models", e)
    return []
  }
}

export const systemPromptForNonRagOption = async () => {
  return await storage.get("systemPromptForNonRagOption")
}

export const setSystemPromptForNonRagOption = async (prompt: string) => {
  await storage.set("systemPromptForNonRagOption", prompt)
}
