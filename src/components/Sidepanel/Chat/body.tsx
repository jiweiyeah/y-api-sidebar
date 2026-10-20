import React from "react"
import { PlaygroundMessage } from "~/components/Common/Playground/Message"
import { useMessage } from "~/hooks/useMessage"
import { EmptySidePanel } from "../Chat/empty"
import { MessageSourcePopup } from "@/components/Common/Playground/MessageSourcePopup"
import { usePlaygroundMessageGroups } from "@/components/Common/Playground/message-groups"

const SidePanelBodyComponent = () => {
  const {
    messages,
    streaming,
    regenerateLastMessage,
    editMessage,
    createChatBranch,
    temporaryChat,
    onSubmit
  } = useMessage()
  const [isSourceOpen, setIsSourceOpen] = React.useState(false)
  const [source, setSource] = React.useState<any>(null)
  const messageGroups = usePlaygroundMessageGroups(messages)
  const lastGroupIndex = messageGroups.length - 1

  const handleEditMessage = React.useCallback(
    (
      actionIndex: number,
      isHuman: boolean,
      value: string,
      _isSend: boolean
    ) => {
      editMessage(actionIndex, value, isHuman)
    },
    [editMessage]
  )

  const handleSourceClick = React.useCallback((data: any) => {
    setSource(data)
    setIsSourceOpen(true)
  }, [])

  const handleContinue = React.useCallback(() => {
    onSubmit({
      image: "",
      message: "",
      isContinue: true
    })
  }, [onSubmit])

  return (
    <>
      <div className="relative flex w-full flex-col items-center pt-16 pb-4">
        {messages.length === 0 && <EmptySidePanel />}
        {messageGroups.map((message, index) => (
          <PlaygroundMessage
            key={message.renderKey}
            isBot={message.isBot}
            message={message.message}
            name={message.name}
            images={message.images || []}
            isLastMessage={index === lastGroupIndex}
            actionIndex={message.actionIndex}
            onRengerate={
              index === lastGroupIndex ? regenerateLastMessage : undefined
            }
            isProcessing={streaming && index === lastGroupIndex}
            sources={message.sources}
            onEditFormSubmit={handleEditMessage}
            onNewBranch={createChatBranch}
            onSourceClick={handleSourceClick}
            generationInfo={message?.generationInfo}
            isStreaming={streaming && index === lastGroupIndex}
            reasoningTimeTaken={message?.reasoning_time_taken}
            modelImage={message?.modelImage}
            modelName={message?.modelName}
            createdAt={message?.createdAt}
            temporaryChat={temporaryChat}
            onContinue={handleContinue}
          />
        ))}
      </div>
      <div className="w-full pb-[157px]"></div>

      <MessageSourcePopup
        open={isSourceOpen}
        setOpen={setIsSourceOpen}
        source={source}
      />
    </>
  )
}

export const SidePanelBody = React.memo(SidePanelBodyComponent)
