import {
  getAllOpenAIConfig,
  getOpenAIConfigById as providerInfo
} from "./openai"
import { getAllModelNicknames } from "./nickname"
import { Model, Models } from "./types"
import { db } from "./schema"
import { isDatabaseClosedError } from "@/utils/ff-error"

export const generateID = () => {
  return "model-xxxx-xxxx-xxx-xxxx".replace(/[x]/g, () => {
    const r = Math.floor(Math.random() * 16)
    return r.toString(16)
  })
}

/**
 * Y-API models are stored with the provider suffix `_model-xxxx-...`. Older
 * installs may still carry the upstream suffixes for local runtimes; strip
 * whichever one is present so names render cleanly in the UI.
 */
export const removeModelSuffix = (id: string) => {
  return id
    .replace(/_model-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{3,4}-[a-f0-9]{4}/, "")
    .replace(/_lmstudio_openai-[a-f0-9]{4}-[a-f0-9]{3}-[a-f0-9]{4}/, "")
    .replace(/_llamafile_openai-[a-f0-9]{4}-[a-f0-9]{3}-[a-f0-9]{4}/, "")
    .replace(/_ollama2_openai-[a-f0-9]{4}-[a-f0-9]{3}-[a-f0-9]{4}/, "")
    .replace(/_llamacpp_openai-[a-f0-9]{4}-[a-f0-9]{3}-[a-f0-9]{4}/, "")
    .replace(/_vllm_openai-[a-f0-9]{4}-[a-f0-9]{3}-[a-f0-9]{4}/, "")
}

export const isCustomModel = (model: string) => {
  if (!model) {
    return false
  }

  const customModelRegex =
    /_model-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{3,4}-[a-f0-9]{4}/
  return customModelRegex.test(model)
}

export class ModelDb {
  getAll = async (): Promise<Models> => {
    return await db.customModels.reverse().toArray()
  }

  create = async (model: Model): Promise<void> => {
    return await db.customModels.add(model)
  }

  getById = async (id: string): Promise<Model> => {
    return await db.customModels.get(id)
  }

  update = async (model: Model): Promise<void> => {
    return await db.customModels.put(model)
  }

  delete = async (id: string): Promise<void> => {
    return await db.customModels.delete(id)
  }

  deleteAll = async (): Promise<void> => {
    return await db.customModels.clear()
  }

  async importDataV2(
    data: Models,
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

export const createManyModels = async (
  data: {
    model_id: string
    name: string
    provider_id: string
    model_type: string
  }[]
) => {
  const db = new ModelDb()

  const models = data.map((item) => {
    return {
      ...item,
      lookup: `${item.model_id}_${item.provider_id}`,
      id: `${item.model_id}_${generateID()}`,
      db_type: "openai_model",
      name: item.name.replaceAll(/accounts\/[^\/]+\/models\//g, "")
    }
  })

  for (const model of models) {
    const isExist = await isLookupExist(model.lookup)

    if (isExist) {
      continue
    }

    await db.create(model)
  }
}

export const createModel = async (
  model_id: string,
  name: string,
  provider_id: string,
  model_type: string
) => {
  const db = new ModelDb()
  const id = generateID()
  const model: Model = {
    id: `${model_id}_${id}`,
    model_id,
    name,
    provider_id,
    lookup: `${model_id}_${provider_id}`,
    db_type: "openai_model",
    model_type: model_type
  }
  await db.create(model)
  return model
}

export const getModelInfo = async (id: string) => {
  try {
    const db = new ModelDb()
    return await db.getById(id)
  } catch (e) {
    if (isDatabaseClosedError(e)) {
      return null
    }

    return null
  }
}

export const getAllCustomModels = async () => {
  try {
    const db = new ModelDb()
    const modelNicknames = await getAllModelNicknames()
    const models = (await db.getAll()).filter(
      (model) => model?.db_type === "openai_model"
    )
    const modelsWithProvider = await Promise.all(
      models.map(async (model) => {
        const provider = await providerInfo(model.provider_id)
        return { ...model, provider }
      })
    )

    return modelsWithProvider.map((model) => {
      return {
        ...model,
        nickname: modelNicknames[model.id]?.model_name || model.model_id,
        avatar: modelNicknames[model.id]?.model_avatar || undefined
      }
    })
  } catch (e) {
    if (isDatabaseClosedError(e)) {
      return []
    }
    return []
  }
}

export const deleteModel = async (id: string) => {
  const db = new ModelDb()
  await db.delete(id)
}

export const deleteAllModelsByProviderId = async (provider_id: string) => {
  const db = new ModelDb()
  const models = await db.getAll()
  const modelsToDelete = models.filter(
    (model) => model.provider_id === provider_id
  )
  for (const model of modelsToDelete) {
    await db.delete(model.id)
  }
}

export const isLookupExist = async (lookup: string) => {
  const db = new ModelDb()
  const models = await db.getAll()
  const model = models.find((model) => model?.lookup === lookup)
  return model ? true : false
}

/**
 * Every model the extension exposes comes from the single Y-API provider, so
 * the picker is just the stored chat models.
 */
export const getChatModels = async (
  modelType: "all" | "chat" | "embedding" = "all"
) => {
  try {
    const [allModels, allProviders] = await Promise.all([
      getAllCustomModels(),
      getAllOpenAIConfig()
    ])
    const modelNicknames = await getAllModelNicknames()

    const filteredModels =
      modelType !== "all"
        ? allModels.filter((model) => model.model_type === modelType)
        : allModels

    const models = filteredModels.map((model) => {
      const providerConfig = allProviders.find(
        (provider) => provider.id === model.provider_id
      )

      return {
        name: model.name,
        model: model.id,
        modified_at: "",
        provider: providerConfig?.provider || "yapi",
        provider_name: providerConfig?.name,
        size: 0,
        digest: "",
        is_enabled: true,
        provider_id: model.provider_id,
        details: {
          parent_model: "",
          format: "",
          family: "",
          families: [],
          parameter_size: "",
          quantization_level: ""
        }
      }
    })

    return models.map((model) => {
      return {
        ...model,
        nickname: modelNicknames[model.model]?.model_name || model.name,
        avatar: modelNicknames[model.model]?.model_avatar || undefined
      }
    })
  } catch (e) {
    console.error(e)
    return []
  }
}
