import { getModelInfo, isCustomModel } from "@/db/dexie/models"
import { getOpenAIConfigById } from "@/db/dexie/openai"
import { CustomChatOpenAI } from "./CustomChatOpenAI"
import { getCustomHeaders } from "@/utils/clean-headers"
import {
  getAllDefaultModelSettings,
  getModelSettings
} from "@/services/model-settings"
import { useStoreChatModelSettings } from "@/store/model"

const parseCustomBody = (raw?: string): Record<string, any> => {
  if (!raw || !raw.trim()) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {}
  } catch (e) {
    console.error("Invalid custom body JSON for provider:", e)
    return {}
  }
}

/**
 * Y-API Sidebar has exactly one provider, so every model resolves through the
 * OpenAI-compatible adapter. `baseUrl` is accepted for call-site symmetry but
 * the provider row is the source of truth.
 */
export const pageAssistModel = async ({
  model,
  baseUrl
}: {
  model: string
  baseUrl?: string
}) => {
  const currentChatModelSettings = useStoreChatModelSettings.getState()
  const userDefaultModelSettings = await getAllDefaultModelSettings()

  const { temperature, topK, topP, numPredict, minP, reasoningEffort } = {
    temperature:
      currentChatModelSettings?.temperature ??
      userDefaultModelSettings?.temperature,
    topK: currentChatModelSettings?.topK ?? userDefaultModelSettings?.topK,
    topP: currentChatModelSettings?.topP ?? userDefaultModelSettings?.topP,
    numPredict:
      currentChatModelSettings?.numPredict ??
      userDefaultModelSettings?.numPredict,
    minP: currentChatModelSettings?.minP ?? userDefaultModelSettings?.minP,
    reasoningEffort: currentChatModelSettings?.reasoningEffort
  }

  const isCustom = isCustomModel(model)

  if (!isCustom) {
    throw new Error(
      "This model was not added from the Y-API provider. Remove it and pick a Y-API model again."
    )
  }

  const modelSettings = await getModelSettings(model)
  const modelInfo = await getModelInfo(model)
  const providerInfo = await getOpenAIConfigById(modelInfo.provider_id)

  if (!providerInfo) {
    throw new Error(
      "The Y-API provider is missing. Open settings and save your API key again."
    )
  }

  const customBodyParams = parseCustomBody(modelSettings?.customBody)

  const modelConfig = {
    maxTokens: modelSettings?.numPredict || numPredict,
    temperature: modelSettings?.temperature || temperature,
    topP: modelSettings?.topP || topP,
    topK: modelSettings?.topK || topK,
    minP: modelSettings?.minP || minP,
    reasoningEffort: modelSettings?.reasoningEffort || (reasoningEffort as any)
  }

  return new CustomChatOpenAI({
    modelName: modelInfo.model_id,
    openAIApiKey: providerInfo.apiKey || "temp",
    temperature: modelConfig?.temperature,
    topP: modelConfig?.topP,
    maxTokens: modelConfig?.maxTokens,
    modelKwargs: {
      ...(modelConfig?.topK && { top_k: modelConfig.topK }),
      ...(modelConfig?.minP && { min_p: modelConfig.minP }),
      ...customBodyParams
    },
    configuration: {
      apiKey: providerInfo.apiKey || "temp",
      baseURL: providerInfo.baseUrl || baseUrl || "",
      defaultHeaders: getCustomHeaders({
        headers: []
      })
    },
    reasoning_effort: modelConfig?.reasoningEffort as any
  }) as any
}
