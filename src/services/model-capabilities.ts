import { isThinkingCapableModel } from "@/libs/model-utils"

/**
 * Y-API exposes no capability endpoint, so thinking support is inferred from
 * the model name alone.
 */
export const isModelThinkingCapable = async (
  model?: string | null
): Promise<boolean> => {
  if (!model) return false
  return isThinkingCapableModel(model)
}
