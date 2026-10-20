import { db } from "./schema"
import { OpenAIModelConfig } from "./types"
import { Y_API_PROVIDER, Y_API_PROVIDER_ID } from "@/utils/oai-api-providers"

export class OpenAIModelDb {
  getAll = async (): Promise<OpenAIModelConfig[]> => {
    return await db.openaiConfigs.orderBy("createdAt").reverse().toArray()
  }

  create = async (config: OpenAIModelConfig): Promise<void> => {
    return await db.openaiConfigs.add(config)
  }

  getById = async (id: string): Promise<OpenAIModelConfig> => {
    return await db.openaiConfigs.get(id)
  }

  update = async (config: OpenAIModelConfig): Promise<void> => {
    return await db.openaiConfigs.put(config)
  }

  delete = async (id: string): Promise<void> => {
    return await db.openaiConfigs.delete(id)
  }

  async importDataV2(
    data: OpenAIModelConfig[],
    options: {
      replaceExisting?: boolean
      mergeData?: boolean
    } = {}
  ): Promise<void> {
    const { replaceExisting = false, mergeData = true } = options

    for (const oai of data) {
      const existing = await this.getById(oai.id)

      if (existing && !replaceExisting) {
        if (mergeData) {
          await this.update({
            ...existing
          })
        }
        continue
      }

      await this.create(oai)
    }
  }
}

/**
 * The Y-API provider is the only one the extension supports, so its row is
 * created once with a fixed id, name and base URL. Users never edit those
 * fields; they only supply the API key.
 */
export const ensureYApiProvider = async (): Promise<OpenAIModelConfig> => {
  const openaiDb = new OpenAIModelDb()
  const existing = await openaiDb.getById(Y_API_PROVIDER_ID)

  if (existing) {
    const needsRepair =
      existing.baseUrl !== Y_API_PROVIDER.baseUrl ||
      existing.name !== Y_API_PROVIDER.name ||
      existing.provider !== Y_API_PROVIDER.provider

    if (!needsRepair) {
      return existing
    }

    const repaired: OpenAIModelConfig = {
      ...existing,
      name: Y_API_PROVIDER.name,
      baseUrl: Y_API_PROVIDER.baseUrl,
      provider: Y_API_PROVIDER.provider,
      db_type: "openai"
    }
    await openaiDb.update(repaired)
    return repaired
  }

  const config: OpenAIModelConfig = {
    id: Y_API_PROVIDER_ID,
    name: Y_API_PROVIDER.name,
    baseUrl: Y_API_PROVIDER.baseUrl,
    apiKey: "",
    createdAt: Date.now(),
    db_type: "openai",
    provider: Y_API_PROVIDER.provider
  }
  await openaiDb.create(config)
  return config
}

export const getYApiProvider = async (): Promise<OpenAIModelConfig> => {
  return await ensureYApiProvider()
}

export const setYApiApiKey = async (apiKey: string) => {
  const openaiDb = new OpenAIModelDb()
  const config = await ensureYApiProvider()
  const updated: OpenAIModelConfig = {
    ...config,
    apiKey: apiKey.trim()
  }
  await openaiDb.update(updated)
  return updated
}

export const getAllOpenAIConfig = async () => {
  try {
    await ensureYApiProvider()
    const openaiDb = new OpenAIModelDb()
    const configs = await openaiDb.getAll()
    return configs.filter((config) => config?.db_type === "openai")
  } catch (e) {
    console.error("Failed to load providers", e)
    return []
  }
}

export const getOpenAIConfigById = async (id: string) => {
  try {
    const openaiDb = new OpenAIModelDb()
    return await openaiDb.getById(id)
  } catch (e) {
    console.error("Failed to load provider", e)
    return null
  }
}
