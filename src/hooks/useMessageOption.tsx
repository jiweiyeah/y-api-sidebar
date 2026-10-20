import React from "react"
import { type ChatHistory, type Message } from "~/store/option"
import { useStoreMessageOption } from "~/store/option"
import {
  removeMessageUsingHistoryId,
  saveHistory,
  saveMessage
} from "@/db/dexie/helpers"
import { useNavigate } from "react-router-dom"
import { notification } from "antd"
import { useTranslation } from "react-i18next"
import { usePageAssist } from "@/context"
import { useStorage } from "@plasmohq/storage/hook"
import { useStoreChatModelSettings } from "@/store/model"
import { normalChatMode } from "./chat-modes/normalChatMode"
import { continueChatMode } from "./chat-modes/continueChatMode"
import {
  focusTextArea,
  validateBeforeSubmit,
  createSaveMessageOnSuccess,
  createSaveMessageOnError
} from "./utils/messageHelpers"
import {
  createRegenerateLastMessage,
  createEditMessage,
  createStopStreamingRequest,
  createBranchMessage
} from "./handlers/messageHandlers"
import { updatePageTitle } from "@/utils/update-page-title"
import { generateTitle } from "@/services/title"

export const useMessageOption = () => {
  const {
    controller: abortController,
    setController: setAbortController,
    messages,
    setMessages
  } = usePageAssist()
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
    temporaryChat,
    setTemporaryChat,
    useOCR,
    setUseOCR
  } = useStoreMessageOption()
  const [webuiTemporaryChat] = useStorage("webuiTemporaryChat", false)

  const currentChatModelSettings = useStoreChatModelSettings()
  const [selectedModel, setSelectedModel] = useStorage("selectedModel")

  const { t } = useTranslation("option")

  const navigate = useNavigate()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleFocusTextArea = () => focusTextArea(textareaRef)

  const clearChat = () => {
    stopStreamingRequest()
    navigate("/")
    setMessages([])
    setHistory([])
    setHistoryId(null)
    setIsFirstMessage(true)
    setIsLoading(false)
    setIsProcessing(false)
    setStreaming(false)
    updatePageTitle()
    currentChatModelSettings.reset()
    handleFocusTextArea()
    if (webuiTemporaryChat) {
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

  const validateBeforeSubmitFn = React.useCallback(
    () => validateBeforeSubmit(selectedModel, t),
    [selectedModel, t]
  )

  const onSubmit = async ({
    message,
    image,
    images,
    isRegenerate = false,
    messages: chatHistory,
    memory,
    controller,
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
    setStreaming(true)
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
      selectedModel,
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
        isRegenerate,
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

  const messagesRef = React.useRef(messages)
  const historyRef = React.useRef(history)
  const historyIdRef = React.useRef(historyId)
  const onSubmitRef = React.useRef(onSubmit)

  React.useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  React.useEffect(() => {
    historyRef.current = history
  }, [history])

  React.useEffect(() => {
    historyIdRef.current = historyId
  }, [historyId])

  React.useEffect(() => {
    onSubmitRef.current = onSubmit
  }, [onSubmit])

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
        validateBeforeSubmitFn,
        history: getHistory,
        messages: getMessages,
        setHistory,
        setMessages,
        historyId: getHistoryId,
        removeMessageUsingHistoryIdFn: removeMessageUsingHistoryId,
        onSubmit: submitWithCurrentState
      }),
    [
      validateBeforeSubmitFn,
      getHistory,
      getMessages,
      setHistory,
      setMessages,
      getHistoryId,
      submitWithCurrentState
    ]
  )

  const stopStreamingRequest = createStopStreamingRequest(
    abortController,
    setAbortController
  )

  const editMessage = React.useMemo(
    () =>
      createEditMessage({
        messages: getMessages,
        history: getHistory,
        setMessages,
        setHistory,
        historyId: getHistoryId,
        validateBeforeSubmitFn,
        onSubmit: submitWithCurrentState
      }),
    [
      getMessages,
      getHistory,
      setMessages,
      setHistory,
      getHistoryId,
      validateBeforeSubmitFn,
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
    [getHistoryId, setHistory, setHistoryId, setMessages]
  )

  const saveTemporaryChat = async () => {
    if (!temporaryChat || messages.length === 0) {
      return
    }

    try {
      const firstUserMessage =
        messages.find((msg) => !msg.isBot)?.message || "Untitled Chat"
      const title = await generateTitle(
        selectedModel,
        history,
        firstUserMessage
      )

      const messageSource = "web-ui" as const

      const newHistory = await saveHistory(title, false, messageSource)

      let timeOffset = 0

      for (const msg of messages) {
        await saveMessage({
          history_id: newHistory.id,
          name: selectedModel,
          role: msg.isBot ? "assistant" : "user",
          content: msg.message,
          images: msg.images || [],
          source: msg.sources || [],
          time: ++timeOffset,
          generationInfo: msg.generationInfo,
          reasoning_time_taken: msg.reasoning_time_taken || 0
        })
      }

      setHistoryId(newHistory.id)
      setTemporaryChat(false)
      updatePageTitle(title)

      notification.success({
        message: t("chatSaved"),
        description: t("temporaryChatSavedSuccessfully")
      })

      return newHistory.id
    } catch (error) {
      console.error("Error saving temporary chat:", error)
      notification.error({
        message: t("error"),
        description: t("failedToSaveTemporaryChat")
      })
    }
  }

  return {
    editMessage,
    messages,
    setMessages,
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
    textareaRef,
    temporaryChat,
    setTemporaryChat,
    useOCR,
    setUseOCR,
    history,
    createChatBranch,
    webuiTemporaryChat,
    saveTemporaryChat
  }
}
