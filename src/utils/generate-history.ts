import { isCustomModel } from "@/db/dexie/models"
import { parseReasoning, removeReasoning } from "@/libs/reasoning"
import { formatContextTimestamp } from "@/utils/format-timestamp"
import { Storage } from "@plasmohq/storage"
import {
  HumanMessage,
  AIMessage,
  type MessageContent
} from "@langchain/core/messages"

const storage = new Storage()

const extractReasoningContent = (text: string | undefined): string => {
  if (!text) return ""
  return parseReasoning(text)
    .filter((part) => part.type === "reasoning")
    .map((part) => part.content)
    .join("\n")
    .trim()
}

const isDeepSeekModel = (model: string): boolean =>
  (model || "").toLowerCase().includes("deepseek")

export const generateHistory = async (
  messages: {
    role: "user" | "assistant" | "system"
    content: string
    image?: string
    images?: string[]
    createdAt?: number
  }[],
  model: string
) => {
  let history = []
  const isCustom = isCustomModel(model)
  const isDeepSeek = isDeepSeekModel(model)
  const showMessageTimestamp = await storage.get<boolean>(
    "showMessageTimestamp"
  )
  for (let message of messages) {
    if (
      showMessageTimestamp &&
      message.createdAt &&
      message.content?.trim()?.length > 0 &&
      (message.role === "user" || message.role === "assistant")
    ) {
      const timestamp = formatContextTimestamp(message.createdAt)
      if (timestamp) {
        message = {
          ...message,
          content: `${message.content} [${timestamp}]`
        }
      }
    }
    if (message.role === "user") {
      let content: MessageContent = isCustom
        ? message.content
        : [
            {
              type: "text",
              text: message.content
            }
          ]

      const imagesToUse =
        message.images && message.images.length > 0
          ? message.images
          : message.image
            ? [message.image]
            : []

      if (imagesToUse.length > 0) {
        content = [
          {
            type: "text",
            text: message.content
          }
        ]

        imagesToUse.forEach((img) => {
          if (img && img.length > 0) {
            //@ts-ignore
            content.push({
              type: "image_url",
              image_url: !isCustom
                ? img
                : {
                    url: img
                  }
            })
          }
        })
      }
      history.push(
        new HumanMessage({
          content: content
        })
      )
    } else if (message.role === "assistant") {
      // DeepSeek thinking modes 400 if reasoning_content is missing on a prior
      // assistant turn. Only enrich the AIMessage for DeepSeek so other
      // providers keep their previous behavior.
      const reasoningContent = isDeepSeek
        ? extractReasoningContent(message.content)
        : ""
      const additionalKwargs: Record<string, unknown> = {}
      if (reasoningContent) {
        additionalKwargs.reasoning_content = reasoningContent
      }

      history.push(
        new AIMessage({
          content: isCustom
            ? removeReasoning(message.content)
            : [
                {
                  type: "text",
                  text: removeReasoning(message.content)
                }
              ],
          additional_kwargs: additionalKwargs
        })
      )
    }
  }
  return history
}
