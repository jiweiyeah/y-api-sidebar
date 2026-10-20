import { useStorage } from "@plasmohq/storage/hook"
import React from "react"
import { useTranslation } from "react-i18next"
import { EditMessageForm } from "./EditMessageForm"
import { Image, Tooltip } from "antd"
import { CheckIcon, CopyIcon, Pen } from "lucide-react"
import { HumanMessage } from "./HumanMessge"
import { formatMessageTimestamp } from "@/utils/format-timestamp"

// See Message.tsx: `auto` lets the browser remember the real rendered height
// so toggling content-visibility never collapses the scroll height for a frame.
const activeMessageRenderStyle: React.CSSProperties = {
  containIntrinsicSize: "auto 180px"
}

const messageRenderStyle: React.CSSProperties = {
  contentVisibility: "auto",
  containIntrinsicSize: "auto 180px"
}

type Props = {
  message: string
  hideCopy?: boolean
  images?: string[]
  isBot: boolean
  isLastMessage: boolean
  actionIndex: number
  onEditFormSubmit: (
    messageIndex: number,
    isHuman: boolean,
    value: string,
    isSend: boolean
  ) => void
  isProcessing: boolean
  hideEditAndRegenerate?: boolean
  isStreaming: boolean
  createdAt?: number
  temporaryChat?: boolean
}

export const PlaygroundUserMessageBubble: React.FC<Props> = (props) => {
  const [checkWideMode] = useStorage("checkWideMode", false)
  const [showMessageTimestamp] = useStorage("showMessageTimestamp", false)
  const [isBtnPressed, setIsBtnPressed] = React.useState(false)
  const [editMode, setEditMode] = React.useState(false)
  const { t } = useTranslation("common")

  return (
    <div
      className={`group gap-2 relative flex w-full max-w-3xl flex-col items-end justify-center pb-2 md:px-4 lg:w-4/5 text-[#242424] dark:text-gray-100 ${
        checkWideMode ? "max-w-none" : ""
      }`}
      style={
        props.isLastMessage || props.isStreaming || props.isProcessing
          ? activeMessageRenderStyle
          : messageRenderStyle
      }>
      {!editMode && props.message.length > 0 && (
        <div
          dir="auto"
          data-is-not-editable={!editMode}
          className={`message-bubble bg-gray-50 dark:bg-[#242424] rounded-3xl prose dark:prose-invert break-words text-primary min-h-7 prose-p:opacity-95 prose-strong:opacity-100 bg-foreground max-w-[100%] sm:max-w-[90%] px-4 py-2.5 rounded-br-lg ${
            props.temporaryChat
              ? "border-2 border-dotted border-violet-400 dark:border-gray-400"
              : "border border-input-border dark:border-[#2a2a2a]"
          }`}>
          <HumanMessage message={props.message} />
        </div>
      )}

      {editMode && (
        <div
          dir="auto"
          className={`message-bubble bg-gray-50 dark:bg-[#2a2a2a] rounded-3xl prose dark:prose-invert break-words text-primary min-h-7 prose-p:opacity-95 prose-strong:opacity-100 bg-foreground max-w-[100%] sm:max-w-[90%] px-4 py-2.5 rounded-br-lg ${
            props.temporaryChat
              ? "border-2 border-dotted border-violet-400 dark:border-gray-400"
              : "border border-input-border dark:border-[#2a2a2a]"
          }`}>
          <div className="w-screen max-w-[100%]">
            <EditMessageForm
              value={props.message}
              onSumbit={(value, isSend) =>
                props.onEditFormSubmit(props.actionIndex, true, value, isSend)
              }
              onClose={() => setEditMode(false)}
              isBot={props.isBot}
            />
          </div>
        </div>
      )}

      {props.images &&
        props.images.filter((img) => img.length > 0).length > 0 && (
          <div>
            {props.images
              .filter((image) => image.length > 0)
              .map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt="Uploaded Image"
                  width={180}
                  className="rounded-lg relative"
                />
              ))}
          </div>
        )}

      {showMessageTimestamp && props.createdAt && !editMode ? (
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          {formatMessageTimestamp(props.createdAt)}
        </span>
      ) : null}

      {!props.isProcessing && !editMode ? (
        <div
          className={`space-x-2 gap-2 flex ${
            !props.isLastMessage ? "invisible group-hover:visible" : ""
          }`}>
          {!props.hideCopy && (
            <Tooltip title={t("copyToClipboard")}>
              <button
                aria-label={t("copyToClipboard")}
                onClick={() => {
                  navigator.clipboard.writeText(props.message)
                  setIsBtnPressed(true)
                  setTimeout(() => {
                    setIsBtnPressed(false)
                  }, 2000)
                }}
                className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 dark:bg-[#242424] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                {!isBtnPressed ? (
                  <CopyIcon className="w-3 h-3 text-gray-400 group-hover:text-gray-500" />
                ) : (
                  <CheckIcon className="w-3 h-3 text-green-400 group-hover:text-green-500" />
                )}
              </button>
            </Tooltip>
          )}

          {!props.hideEditAndRegenerate && (
            <Tooltip title={t("edit")}>
              <button
                onClick={() => setEditMode(true)}
                aria-label={t("edit")}
                className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 dark:bg-[#242424] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <Pen className="w-3 h-3 text-gray-400 group-hover:text-gray-500" />
              </button>
            </Tooltip>
          )}
        </div>
      ) : (
        // add invisible div to prevent layout shift
        <div className="invisible">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 dark:bg-[#242424] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"></div>
        </div>
      )}
    </div>
  )
}
