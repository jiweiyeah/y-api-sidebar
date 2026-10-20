import { isCustomModel } from "@/db/dexie/models"
import { HumanMessage, type MessageContent } from "@langchain/core/messages"
import { processImageForOCR } from "./ocr"

type HumanMessageType = {
  content: MessageContent
  model: string
  useOCR: boolean
}

/**
 * Every model is an OpenAI-compatible Y-API model, so images are sent as
 * `image_url` objects and OCR text is inlined when the user asked for it.
 */
export const humanMessageFormatter = async ({
  content,
  model,
  useOCR = false
}: HumanMessageType) => {
  try {
    if (
      !isCustomModel(model) ||
      typeof content === "string" ||
      !Array.isArray(content) ||
      content.length <= 1
    ) {
      return new HumanMessage({
        content
      })
    }

    if (useOCR) {
      const imageContents = content.filter((c: any) => c.type === "image_url")
      const ocrTexts = await Promise.all(
        imageContents.map((c: any) => processImageForOCR(c.image_url))
      )
      //@ts-ignore
      const ocrPROMPT = `${content[0].text}

[IMAGE OCR TEXT]
${ocrTexts.join("\n\n---\n\n")}`
      return new HumanMessage({
        content: ocrPROMPT
      })
    }

    const newContent: MessageContent = [
      {
        type: "text",
        //@ts-ignore
        text: content[0].text
      }
    ]

    content
      .filter((c: any) => c.type === "image_url" && c.image_url?.length > 0)
      .forEach((c: any) => {
        newContent.push({
          type: "image_url",
          image_url: {
            url: c.image_url
          }
        })
      })

    return new HumanMessage({
      content: newContent
    })
  } catch (e) {
    return new HumanMessage({
      content
    })
  }
}
