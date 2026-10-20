import { useForm } from "@mantine/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React from "react"
import useDynamicTextareaSize from "~/hooks/useDynamicTextareaSize"
import { toBase64 } from "~/libs/to-base64"
import { useMessageOption } from "~/hooks/useMessageOption"
import { Checkbox, Dropdown, Select, Tooltip, Image, Popover, Radio } from "antd"
import { useWebUI } from "~/store/webui"
import {
  EraserIcon,
  ImageIcon,
  MicIcon,
  StopCircleIcon,
  X,
  Brain,
  BrainCircuit,
  PlusIcon
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { handleChatInputKeyDown } from "@/utils/key-down"
import { useStorage } from "@plasmohq/storage/hook"
import { useFocusShortcuts } from "@/hooks/keyboard"
import { useThinkingCapability } from "@/hooks/useThinkingCapability"
import { useStoreChatModelSettings } from "~/store/model"

type Props = {
  dropedFile: File | undefined
}

export const PlaygroundForm = ({ dropedFile }: Props) => {
  const { t } = useTranslation(["playground", "common"])
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [typing, setTyping] = React.useState<boolean>(false)
  const [checkWideMode] = useStorage("checkWideMode", false)
  const {
    onSubmit,
    selectedModel,
    stopStreamingRequest,
    streaming: isSending,
    textareaRef,
    temporaryChat,
    useOCR,
    setUseOCR,
    setHistory,
    history
  } = useMessageOption()

  const [autoSubmitVoiceMessage] = useStorage("autoSubmitVoiceMessage", false)
  const [autoStopTimeout] = useStorage("autoStopTimeout", 2000)

  // Thinking mode state
  const [defaultThinkingMode] = useStorage("defaultThinkingMode", true)
  const thinking = useStoreChatModelSettings((state) => state.thinking)
  const setThinking = useStoreChatModelSettings((state) => state.setThinking)
  const { supportsThinking, isGptOss } = useThinkingCapability(selectedModel)

  // Enable focus shortcuts (Shift+Esc to focus textarea)
  useFocusShortcuts(textareaRef, true)

  const [persistChatInput] = useStorage("persistChatInput", false)
  const [persistedMessage, setPersistedMessage] = useStorage(
    "playgroundPersistedMessage",
    ""
  )

  const textAreaFocus = () => {
    if (textareaRef.current) {
      if (
        textareaRef.current.selectionStart === textareaRef.current.selectionEnd
      ) {
        textareaRef.current.focus()
      }
    }
  }

  const form = useForm({
    initialValues: {
      message: "",
      image: "",
      images: [] as string[]
    }
  })

  React.useEffect(() => {
    textAreaFocus()
  }, [])

  // Separate effect for restoring persisted message to handle async useStorage
  React.useEffect(() => {
    if (persistChatInput && persistedMessage && !form.values.message) {
      form.setFieldValue("message", persistedMessage)
    }
  }, [persistChatInput, persistedMessage])

  const onInputChange = async (
    e: React.ChangeEvent<HTMLInputElement> | File
  ) => {
    if (e instanceof File) {
      if (!e.type.startsWith("image/")) {
        return
      }
      const base64 = await toBase64(e)
      const currentImages = form.values.images || []
      form.setFieldValue("images", [...currentImages, base64])
    } else {
      if (e.target.files) {
        const files = Array.from(e.target.files)
        for (const file of files) {
          if (!file.type.startsWith("image/")) {
            continue
          }
          const base64 = await toBase64(file)
          const currentImages = form.values.images || []
          form.setFieldValue("images", [...currentImages, base64])
        }
      }
    }
  }

  const removeImage = (index: number) => {
    const currentImages = form.values.images || []
    const newImages = currentImages.filter((_, i) => i !== index)
    form.setFieldValue("images", newImages)
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    if (e.clipboardData.files.length > 0) {
      onInputChange(e.clipboardData.files[0])
    }
  }

  React.useEffect(() => {
    if (dropedFile) {
      onInputChange(dropedFile)
    }
  }, [dropedFile])

  useDynamicTextareaSize(textareaRef, form.values.message, 300)

  const {
    transcript,
    isListening,
    resetTranscript,
    start: startListening,
    stop: stopSpeechRecognition,
    supported: browserSupportsSpeechRecognition
  } = useSpeechRecognition({
    autoStop: autoSubmitVoiceMessage,
    autoStopTimeout,
    onEnd: async () => {
      if (autoSubmitVoiceMessage) {
        submitForm()
      }
    }
  })
  const { sendWhenEnter, setSendWhenEnter } = useWebUI()

  React.useEffect(() => {
    if (isListening) {
      form.setFieldValue("message", transcript)
    }
  }, [transcript])

  const queryClient = useQueryClient()

  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: onSubmit,
    onSuccess: () => {
      textAreaFocus()
      queryClient.invalidateQueries({
        queryKey: ["fetchChatHistory"]
      })
    },
    onError: () => {
      textAreaFocus()
    }
  })

  const validateBeforeMessageSend = () => {
    if (!selectedModel || selectedModel.length === 0) {
      form.setFieldError("message", t("formError.noModel"))
      return false
    }
    return true
  }

  const sendFormValue = async (value: {
    message: string
    image: string
    images: string[]
  }) => {
    if (
      value.message.trim().length === 0 &&
      (!value.images || value.images.length === 0)
    ) {
      return
    }

    if (!validateBeforeMessageSend()) {
      return
    }

    form.reset()
    if (persistChatInput) {
      setPersistedMessage("")
    }
    textAreaFocus()

    await sendMessage({
      image: value.images && value.images.length > 0 ? value.images[0] : "",
      images: value.images,
      message: value.message
    })
  }

  const handleFormSubmit = async (value: {
    message: string
    image: string
    images: string[]
  }) => {
    await stopListening()
    await sendFormValue(value)
  }

  const submitForm = () => {
    form.onSubmit(handleFormSubmit)()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (import.meta.env.BROWSER !== "firefox") {
      if (e.key === "Process" || e.key === "229") return
    }

    if (
      handleChatInputKeyDown({
        e,
        sendWhenEnter,
        typing,
        isSending
      })
    ) {
      e.preventDefault()
      stopListening()
      submitForm()
    }
  }

  const stopListening = async () => {
    if (isListening) {
      stopSpeechRecognition()
    }
  }

  const [isCompactActionsPopoverOpen, setIsCompactActionsPopoverOpen] =
    React.useState(false)
  const useCompactActions = false

  const compactActionsPopoverContent = (
    <div className="w-60 space-y-2">
      {defaultThinkingMode && supportsThinking && (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 px-2 py-1.5 dark:border-[#404040]">
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {t("tooltip.thinking")}
          </span>
          <Radio.Group
            value={thinking || "medium"}
            onChange={(e) => setThinking?.(e.target.value)}
            optionType="button"
            size="small"
            options={[
              { label: t("form.thinking.levels.low"), value: "low" },
              { label: t("form.thinking.levels.medium"), value: "medium" },
              { label: t("form.thinking.levels.high"), value: "high" }
            ]}
          />
        </div>
      )}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 px-2 py-1.5 dark:border-[#404040]">
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {t("sendWhenEnter")}
        </span>
        <Checkbox
          checked={sendWhenEnter}
          onChange={(e) => setSendWhenEnter(e.target.checked)}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-gray-200 px-2 py-1.5 dark:border-[#404040]">
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {t("useOCR")}
        </span>
        <Checkbox
          checked={useOCR}
          onChange={(e) => setUseOCR(e.target.checked)}
        />
      </div>
    </div>
  )

  return (
    <div className="flex w-full flex-col items-center px-2">
      <div className="relative z-10 flex w-full flex-col items-center justify-center gap-2 text-base">
        <div className="relative flex w-full flex-row justify-center gap-2 lg:w-3/5">
          <div
            data-istemporary-chat={temporaryChat}
            data-checkwidemode={checkWideMode}
            className="bg-neutral-50/70 dark:bg-[#2a2a2a] relative w-full max-w-[48rem] p-1 backdrop-blur-3xl dark:backdrop-blur-none duration-100 border border-gray-300 rounded-t-xl dark:border-[#404040] data-[istemporary-chat='true']:bg-violet-100/70 data-[istemporary-chat='true']:border-violet-300 data-[istemporary-chat='true']:dark:bg-black data-[istemporary-chat='true']:dark:border-[#404040] data-[checkwidemode='true']:max-w-none">
            {form.values.images && form.values.images.length > 0 && (
              <div className="p-3 border-b border-gray-200 dark:border-[#404040]">
                <div className="flex flex-wrap gap-2">
                  {form.values.images.map((img, index) => (
                    <div key={index} className="relative">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 flex items-center justify-center z-10 bg-white dark:bg-[#2a2a2a] p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#404040] text-black dark:text-gray-100 shadow-md">
                        <X className="h-3 w-3" />
                      </button>
                      <Image
                        src={img}
                        alt={`Uploaded Image ${index + 1}`}
                        preview={true}
                        className="rounded-md max-h-32 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="flex bg-transparent">
                <form
                  onSubmit={form.onSubmit(handleFormSubmit)}
                  className="shrink-0 flex-grow flex flex-col items-center">
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    ref={inputRef}
                    accept="image/*"
                    multiple={true}
                    onChange={onInputChange}
                  />

                  <div className="w-full flex flex-col dark:border-[#404040] px-2">
                    <div className="relative">
                      <textarea
                        id="textarea-message"
                        onCompositionStart={() => {
                          if (import.meta.env.BROWSER !== "firefox") {
                            setTyping(true)
                          }
                        }}
                        onCompositionEnd={() => {
                          if (import.meta.env.BROWSER !== "firefox") {
                            setTyping(false)
                          }
                        }}
                        onKeyDown={(e) => handleKeyDown(e)}
                        ref={textareaRef}
                        className="px-2 py-2 w-full resize-none bg-transparent focus-within:outline-none focus:ring-0 focus-visible:ring-0 ring-0 dark:ring-0 border-0 dark:text-gray-100"
                        onPaste={handlePaste}
                        rows={1}
                        style={{ minHeight: "35px" }}
                        tabIndex={0}
                        placeholder={t("form.textarea.placeholder")}
                        {...form.getInputProps("message")}
                        onChange={(e) => {
                          form.getInputProps("message").onChange(e)
                          if (persistChatInput) {
                            setPersistedMessage(e.target.value)
                          }
                        }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {defaultThinkingMode &&
                          supportsThinking &&
                          (isGptOss ? (
                            <div className="inline-flex items-center gap-2">
                              <Tooltip title={t("tooltip.thinking")}>
                                <div className="inline-flex items-center gap-2">
                                  <Brain className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                </div>
                              </Tooltip>
                              <Select
                                size="small"
                                value={
                                  typeof thinking === "string"
                                    ? thinking
                                    : "medium"
                                }
                                onChange={(value) =>
                                  setThinking?.(
                                    value as "low" | "medium" | "high"
                                  )
                                }
                                options={[
                                  {
                                    value: "low",
                                    label: t("form.thinking.levels.low")
                                  },
                                  {
                                    value: "medium",
                                    label: t("form.thinking.levels.medium")
                                  },
                                  {
                                    value: "high",
                                    label: t("form.thinking.levels.high")
                                  }
                                ]}
                                className="w-24"
                              />
                            </div>
                          ) : (
                            <Tooltip title={t("tooltip.thinking")}>
                              <button
                                type="button"
                                onClick={() =>
                                  setThinking?.(!(thinking ?? true))
                                }
                                className="inline-flex items-center justify-center dark:text-gray-300">
                                {thinking ?? true ? (
                                  <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                ) : (
                                  <BrainCircuit className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                )}
                              </button>
                            </Tooltip>
                          ))}
                      </div>
                      <div className="flex items-center gap-3 justify-end">
                        {useCompactActions && (
                          <Popover
                            trigger="click"
                            placement="topRight"
                            open={isCompactActionsPopoverOpen}
                            onOpenChange={setIsCompactActionsPopoverOpen}
                            content={compactActionsPopoverContent}>
                            <Tooltip title={t("common:more", "More")}>
                              <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md border border-gray-300 p-1.5 dark:border-[#404040] dark:text-gray-300 md:hidden">
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </Tooltip>
                          </Popover>
                        )}
                        {history.length > 0 && (
                          <Tooltip title={t("tooltip.clearContext")}>
                            <button
                              type="button"
                              aria-label={t("tooltip.clearContext")}
                              onClick={() => {
                                setHistory([])
                              }}
                              className="flex items-center justify-center dark:text-gray-300">
                              <EraserIcon className="h-5 w-5" />
                            </button>
                          </Tooltip>
                        )}
                        <Tooltip title={t("tooltip.uploadImage")}>
                          <button
                            type="button"
                            aria-label={t("tooltip.uploadImage")}
                            onClick={() => {
                              inputRef.current?.click()
                            }}
                            className="flex items-center justify-center dark:text-gray-300">
                            <ImageIcon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                        {browserSupportsSpeechRecognition && (
                          <Tooltip title={t("tooltip.speechToText")}>
                            <button
                              type="button"
                              aria-label={t("tooltip.speechToText")}
                              onClick={async () => {
                                if (isListening) {
                                  stopSpeechRecognition()
                                } else {
                                  resetTranscript()
                                  startListening({
                                    continuous: true,
                                    lang: "en-US"
                                  })
                                }
                              }}
                              className="flex items-center justify-center dark:text-gray-300">
                              {!isListening ? (
                                <MicIcon className="h-5 w-5" />
                              ) : (
                                <div className="relative">
                                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                                  <MicIcon className="h-5 w-5" />
                                </div>
                              )}
                            </button>
                          </Tooltip>
                        )}

                        {isSending ? (
                          <Tooltip title={t("tooltip.stopStreaming")}>
                            <button
                              type="button"
                              onClick={stopStreamingRequest}
                              aria-label={t("tooltip.stopStreaming")}
                              className="text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-[#404040] rounded-md p-1">
                              <StopCircleIcon className="size-5" />
                            </button>
                          </Tooltip>
                        ) : (
                          <Dropdown.Button
                            htmlType="submit"
                            disabled={isSending}
                            className="!justify-end !w-auto"
                            icon={
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="w-5 h-5"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                />
                              </svg>
                            }
                            menu={{
                              items: [
                                {
                                  key: 1,
                                  label: (
                                    <Checkbox
                                      checked={sendWhenEnter}
                                      onChange={(e) =>
                                        setSendWhenEnter(e.target.checked)
                                      }>
                                      {t("sendWhenEnter")}
                                    </Checkbox>
                                  )
                                },
                                {
                                  key: 2,
                                  label: (
                                    <Checkbox
                                      checked={useOCR}
                                      onChange={(e) =>
                                        setUseOCR(e.target.checked)
                                      }>
                                      {t("useOCR")}
                                    </Checkbox>
                                  )
                                }
                              ]
                            }}>
                            <div className="inline-flex gap-2">
                              {sendWhenEnter ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  className="h-5 w-5"
                                  viewBox="0 0 24 24">
                                  <path d="M9 10L4 15 9 20"></path>
                                  <path d="M20 4v7a4 4 0 01-4 4H4"></path>
                                </svg>
                              ) : null}
                              {t("common:submit")}
                            </div>
                          </Dropdown.Button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              {form.errors.message && (
                <div className="text-red-500 text-center text-sm mt-1">
                  {form.errors.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
