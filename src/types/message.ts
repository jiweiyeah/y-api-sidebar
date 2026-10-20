export type Message = {
  isBot: boolean
  name: string
  message: string
  sources: any[]
  images?: string[]
  id?: string
  generationInfo?: any
  reasoning_time_taken?: number
  modelImage?: string
  modelName?: string
}
