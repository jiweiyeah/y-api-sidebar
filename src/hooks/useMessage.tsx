import React from "react"
import { useStoreMessageOption, type Message } from "~/store/option"
import { useStoreMessage } from "~/store"
import { ChatHistory } from "~/store/option"
import {
  deleteChatForEdit,
  removeMessageUsingHistoryId,
  updateMessageByIndex
} from "@/db/dexie/helpers"
import { notification } from "antd"
import { useTranslation } from "react-i18next"
import { usePageAssist } from "@/context"
import { useStorage } from "@plasmohq/storage/hook"
import { useStoreChatModelSettings } from "@/store/model"
import {
  createBranchMessage,
  createRegenerateLastMessage
} from "./handlers/messageHandlers"
import {
  createSaveMessageOnError,
  createSaveMessageOnSuccess
} from "./utils/messageHelpers"
import { updatePageTitle } from "@/utils/update-page-title"
import { normalChatMode } from "./chat-modes/normalChatMode"
import { continueChatMode } from "./chat-modes/continueChatMode"

export const useMessage = () => {
  const {
    controller: abortController,
    setController: setAbortController,
    messages,
    setMessages
  } = usePageAssist()
  const { t } = useTranslation("option")
  const [selectedModel, setSelectedModel] = useStorage("selectedModel")
  const currentChatModelSettings = useStoreChatModelSettings()
  const { temporaryChat, setTemporaryChat, useOCR } = useStoreMessageOption()

  const {
    history,
    setHistory,
    setStreaming,
    streaming,
    setIsFirstMessage,
    historyId,
    setHistoryId,
    isLoading,
    setIsLoading,
    isProcessing,
    setIsProcessing,
    setUseOCR
  } = useStoreMessage()
  const [sidepanelTemporaryChat] = useStorage("sidepanelTemporaryChat", false)

  const clearChat = () => {
    stopStreamingRequest()
    setMessages([])
    setHistory([])
    setHistoryId(null)
    setIsFirstMessage(true)
    setIsLoading(false)
    setIsProcessing(false)
    setStreaming(false)
    updatePageTitle()
    currentChatModelSettings.reset()
    if (sidepanelTemporaryChat) {
      setTemporaryChat(true)
    }
  }

  const saveMessageOnSuccess = createSaveMessageOnSuccess(
    temporaryChat,
    setHistoryId as (id: string) => void
  )
  const saveMessageOnError = createSaveMessageOnError(
    temporaryChat,
    history,
    setHistory,
    setHistoryId as (id: string) => void
  )

  const messagesRef = React.useRef(messages)
  const historyRef = React.useRef(history)
  const historyIdRef = React.useRef(historyId)
  const onSubmitRef = React.useRef<(params: any) => Promise<void>>(
    async () => {}
  )

  React.useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  React.useEffect(() => {
    historyRef.current = history
  }, [history])

  React.useEffect(() => {
    historyIdRef.current = historyId
  }, [historyId])

  const onSubmit = async ({
    message,
    image,
    images,
    isRegenerate,
    controller,
    memory,
    messages: chatHistory,
    isContinue
  }: {
    message: string
    image: string
    images?: string[]
    isRegenerate?: boolean
    isContinue?: boolean
    messages?: Message[]
    memory?: ChatHistory
    controller?: AbortController
  }) => {
    let signal: AbortSignal
    if (!controller) {
      const newController = new AbortController()
      signal = newController.signal
      setAbortController(newController)
    } else {
      setAbortController(controller)
      signal = controller.signal
    }

    const chatModeParams = {
      selectedModel: selectedModel!,
      useOCR,
      currentChatModelSettings,
      setMessages,
      saveMessageOnSuccess,
      saveMessageOnError,
      setHistory,
      setIsProcessing,
      setStreaming,
      setAbortController,
      historyId,
      setHistoryId,
      images
    }

    try {
      if (isContinue) {
        await continueChatMode(
          chatHistory || messages,
          memory || history,
          signal,
          chatModeParams
        )
        return
      }

      await normalChatMode(
        message,
        image,
        isRegenerate || false,
        chatHistory || messages,
        memory || history,
        signal,
        chatModeParams
      )
    } catch (e: any) {
      notification.error({
        message: t("error"),
        description: e?.message || t("somethingWentWrong")
      })
      setIsProcessing(false)
      setStreaming(false)
    }
  }

  React.useEffect(() => {
    onSubmitRef.current = onSubmit
  }, [onSubmit])

  const stopStreamingRequest = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
    }
  }

  const editMessage = React.useCallback(
    async (index: number, message: string, isHuman: boolean) => {
      const currentMessages = messagesRef.current
      const currentHistory = historyRef.current
      const currentHistoryId = historyIdRef.current
      const nextMessages = currentMessages.map((currentMessage, currentIndex) =>
        currentIndex === index
          ? {
              ...currentMessage,
              message
            }
          : currentMessage
      )
      const nextHistory = currentHistory.map((currentMessage, currentIndex) =>
        currentIndex === index
          ? {
              ...currentMessage,
              content: message
            }
          : currentMessage
      )

      if (isHuman) {
        const currentHumanMessage = nextMessages[index]
        const previousMessages = nextMessages.slice(0, index + 1)
        setMessages(previousMessages)
        const previousHistory = nextHistory.slice(0, index)
        setHistory(previousHistory)
        if (currentHistoryId) {
          await updateMessageByIndex(currentHistoryId, index, message)
          await deleteChatForEdit(currentHistoryId, index)
        }
        const abortController = new AbortController()
        await onSubmitRef.current({
          message: message,
          image: currentHumanMessage.images?.[0] || "",
          images: currentHumanMessage.images || [],
          isRegenerate: true,
          messages: previousMessages,
          memory: previousHistory,
          controller: abortController
        })
      } else {
        setMessages(nextMessages)
        setHistory(nextHistory)
        if (currentHistoryId) {
          await updateMessageByIndex(currentHistoryId, index, message)
        }
      }
    },
    [setMessages, setHistory]
  )

  const getMessages = React.useCallback(() => messagesRef.current, [])
  const getHistory = React.useCallback(() => historyRef.current, [])
  const getHistoryId = React.useCallback(() => historyIdRef.current, [])
  const submitWithCurrentState = React.useCallback(
    (params: any) => onSubmitRef.current(params),
    []
  )

  const regenerateLastMessage = React.useMemo(
    () =>
      createRegenerateLastMessage({
        validateBeforeSubmitFn: () => true,
        history: getHistory,
        messages: getMessages,
        setHistory,
        setMessages,
        historyId: getHistoryId,
        removeMessageUsingHistoryIdFn: removeMessageUsingHistoryId,
        onSubmit: submitWithCurrentState
      }),
    [
      getHistory,
      getMessages,
      setHistory,
      setMessages,
      getHistoryId,
      submitWithCurrentState
    ]
  )
  const createChatBranch = React.useMemo(
    () =>
      createBranchMessage({
        historyId: null,
        getHistoryId,
        setHistory,
        setHistoryId,
        setMessages
      }),
    [setHistory, setHistoryId, setMessages, getHistoryId]
  )
  return {
    messages,
    setMessages,
    editMessage,
    onSubmit,
    setStreaming,
    streaming,
    setHistory,
    historyId,
    setHistoryId,
    setIsFirstMessage,
    isLoading,
    setIsLoading,
    isProcessing,
    stopStreamingRequest,
    clearChat,
    selectedModel,
    setSelectedModel,
    regenerateLastMessage,
    useOCR,
    setUseOCR,
    history,
    createChatBranch,
    temporaryChat,
    setTemporaryChat,
    sidepanelTemporaryChat
  }
}
