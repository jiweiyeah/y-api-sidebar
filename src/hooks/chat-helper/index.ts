import {
  getLastChatHistory,
  saveHistory,
  saveMessage,
  updateMessage,
  updateLastUsedModel as setLastUsedChatModel,
  updateChatHistoryCreatedAt
} from "@/db/dexie/helpers"
import { generateTitleInBackground } from "@/services/title"
import { ChatHistory } from "@/store/option"
import { updatePageTitle } from "@/utils/update-page-title"

type MessageSource = "copilot" | "web-ui"

export const saveMessageOnError = async ({
  e,
  history,
  setHistory,
  image,
  images,
  userMessage,
  botMessage,
  historyId,
  selectedModel,
  setHistoryId,
  isRegenerating,
  message_source = "web-ui",
  isContinue
}: {
  e: any
  setHistory: (history: ChatHistory) => void
  history: ChatHistory
  userMessage: string
  image: string
  images?: string[]
  botMessage: string
  historyId: string | null
  selectedModel: string
  setHistoryId: (historyId: string) => void
  isRegenerating: boolean
  message_source?: MessageSource
  isContinue?: boolean
}) => {
  // Use images array if available, otherwise wrap single image
  const imagesToSave =
    images && images.length > 0 ? images : image ? [image] : []

  if (
    e?.name === "AbortError" ||
    e?.message === "AbortError" ||
    e?.name?.includes("AbortError") ||
    e?.message?.includes("AbortError")
  ) {
    setHistory([
      ...history,
      {
        role: "user",
        createdAt: Date.now(),
        content: userMessage,
        image,
        images
      },
      {
        role: "assistant",
        createdAt: Date.now(),
        content: botMessage
      }
    ])

    if (historyId) {
      if (!isRegenerating && !isContinue) {
        await saveMessage({
          history_id: historyId,
          name: selectedModel,
          role: "user",
          content: userMessage,
          images: imagesToSave,
          time: 1
        })
      }

      if (isContinue) {
        const lastMessage = await getLastChatHistory(historyId)
        await updateMessage(historyId, lastMessage.id, botMessage)
      } else {
        await saveMessage({
          history_id: historyId,
          name: selectedModel,
          role: "assistant",
          content: botMessage,
          images: [],
          source: [],
          time: 2
        })
      }
      await setLastUsedChatModel(historyId, selectedModel)

      return historyId
    } else {
      const newHistoryId = await saveHistory(userMessage, false, message_source)
      updatePageTitle(newHistoryId.title)
      if (!isRegenerating) {
        await saveMessage({
          history_id: newHistoryId.id,
          name: selectedModel,
          role: "user",
          content: userMessage,
          images: imagesToSave,
          time: 1
        })
      }

      await saveMessage({
        history_id: newHistoryId.id,
        name: selectedModel,
        role: "assistant",
        content: botMessage,
        images: [],
        source: [],
        time: 2
      })
      setHistoryId(newHistoryId.id)
      await setLastUsedChatModel(newHistoryId.id, selectedModel)

      generateTitleInBackground({
        historyId: newHistoryId.id,
        model: selectedModel,
        history: [
          ...history,
          {
            role: "user",
            content: userMessage,
            image,
            images
          },
          {
            role: "assistant",
            content: botMessage
          }
        ],
        provisionalTitle: newHistoryId.title
      })

      return newHistoryId.id
    }
  }

  return historyId
}

export const saveMessageOnSuccess = async ({
  historyId,
  setHistoryId,
  isRegenerate,
  selectedModel,
  message,
  image,
  images,
  fullText,
  source,
  message_source = "web-ui",
  generationInfo,
  reasoning_time_taken = 0,
  isContinue
}: {
  historyId: string | null
  setHistoryId: (historyId: string) => void
  isRegenerate: boolean
  selectedModel: string | null
  message: string
  image: string
  images?: string[]
  fullText: string
  source: any[]
  message_source?: MessageSource
  generationInfo?: any
  reasoning_time_taken?: number
  isContinue?: boolean
}) => {
  // Use images array if available, otherwise wrap single image
  const imagesToSave =
    images && images.length > 0 ? images : image ? [image] : []
  if (historyId) {
    if (!isRegenerate && !isContinue) {
      await saveMessage({
        history_id: historyId,
        name: selectedModel,
        role: "user",
        content: message,
        images: imagesToSave,
        time: 1,
        generationInfo,
        reasoning_time_taken
      })
    }

    if (isContinue) {
      const lastMessage = await getLastChatHistory(historyId)
      if (lastMessage) {
        await updateMessage(historyId, lastMessage.id, fullText)
      }
    } else {
      await saveMessage({
        history_id: historyId,
        name: selectedModel,
        role: "assistant",
        content: fullText,
        images: [],
        source,
        time: 2,
        generationInfo,
        reasoning_time_taken
      })
    }

    await setLastUsedChatModel(historyId, selectedModel!)
    await updateChatHistoryCreatedAt(historyId)

    return historyId
  } else {
    const newHistoryId = await saveHistory(message, false, message_source)
    updatePageTitle(newHistoryId.title)

    await saveMessage({
      history_id: newHistoryId.id,
      name: selectedModel,
      role: "user",
      content: message,
      images: imagesToSave,
      time: 1,
      generationInfo,
      reasoning_time_taken
    })

    await saveMessage({
      history_id: newHistoryId.id,
      name: selectedModel,
      role: "assistant",
      content: fullText,
      images: [],
      source,
      time: 2,
      generationInfo,
      reasoning_time_taken
    })
    setHistoryId(newHistoryId.id)
    await setLastUsedChatModel(newHistoryId.id, selectedModel!)

    generateTitleInBackground({
      historyId: newHistoryId.id,
      model: selectedModel!,
      history: [
        {
          role: "user",
          content: message,
          image,
          images
        },
        {
          role: "assistant",
          content: fullText
        }
      ],
      provisionalTitle: newHistoryId.title
    })

    return newHistoryId.id
  }
}
