import { Storage } from "@plasmohq/storage"
const storage = new Storage()
const storage2 = new Storage({
  area: "local"
})

export const copilotResumeLastChat = async () => {
  return await storage.get<boolean>("copilotResumeLastChat")
}

export const webUIResumeLastChat = async () => {
  return await storage.get<boolean>("webUIResumeLastChat")
}

export const isRemoveReasoningTagFromCopy = async (): Promise<boolean> => {
  const removeReasoningTagFromCopy = await storage.get<boolean>(
    "removeReasoningTagFromCopy"
  )
  return removeReasoningTagFromCopy ?? true
}

export const getStorageSyncEnabled = async (): Promise<boolean> => {
  const enabled = await storage2.get<boolean>("storageSyncEnabled")
  return enabled ?? true
}

export const setStorageSyncEnabled = async (
  enabled: boolean
): Promise<void> => {
  await storage2.set("storageSyncEnabled", enabled)
}
