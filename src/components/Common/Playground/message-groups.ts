import React from "react"
import type { Message } from "@/store/option"

export type PlaygroundMessageSegment = {
  type: "text"
  key: string
  message: Message
}

export type PlaygroundMessageGroup = Message & {
  renderKey: string
  startIndex: number
  endIndex: number
  actionIndex: number
  segments: PlaygroundMessageSegment[]
  sourceMessages: Message[]
}

const createTextSegment = (
  message: Message,
  index: number
): PlaygroundMessageSegment => ({
  type: "text",
  key: `text-${index}`,
  message
})

const isMessageEqual = (a: Message, b: Message) => {
  if (a === b) return true
  return (
    a.message === b.message &&
    a.isBot === b.isBot &&
    a.id === b.id &&
    a.generationInfo === b.generationInfo &&
    a.reasoning_time_taken === b.reasoning_time_taken
  )
}

const areSourceMessagesEqual = (
  sourceMessages: Message[],
  messages: Message[],
  startIndex: number,
  endIndex: number
) => {
  if (sourceMessages.length !== endIndex - startIndex + 1) {
    return false
  }

  for (let index = startIndex; index <= endIndex; index += 1) {
    if (!isMessageEqual(sourceMessages[index - startIndex], messages[index])) {
      return false
    }
  }

  return true
}

const createRenderKey = (sourceMessages: Message[], startIndex: number) => {
  const keyParts = sourceMessages
    .map(
      (message, index) =>
        message.id || `${startIndex + index}-${message.isBot ? "bot" : "user"}`
    )
    .join(":")

  return keyParts || `group-${startIndex}`
}

/**
 * Normal chat alternates user/assistant, so a group is just a single message.
 * The grouping structure is kept so the renderer can reuse keys across
 * streamed updates without remounting the message.
 */
export const buildPlaygroundMessageGroups = (
  messages: Message[],
  previousGroups: PlaygroundMessageGroup[] = []
): PlaygroundMessageGroup[] => {
  return messages.map((message, index) => {
    const previousGroup = previousGroups[index]

    if (
      previousGroup &&
      previousGroup.startIndex === index &&
      previousGroup.endIndex === index &&
      areSourceMessagesEqual(previousGroup.sourceMessages, messages, index, index)
    ) {
      return previousGroup
    }

    const sourceMessages = [message]

    return {
      ...message,
      renderKey: createRenderKey(sourceMessages, index),
      startIndex: index,
      endIndex: index,
      actionIndex: index,
      segments: [createTextSegment(message, index)],
      sourceMessages
    }
  })
}

export const usePlaygroundMessageGroups = (messages: Message[]) => {
  const previousGroupsRef = React.useRef<PlaygroundMessageGroup[]>([])

  return React.useMemo(() => {
    const groups = buildPlaygroundMessageGroups(
      messages,
      previousGroupsRef.current
    )
    previousGroupsRef.current = groups
    return groups
  }, [messages])
}
