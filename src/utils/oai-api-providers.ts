export type OAIApiProvider = {
  label: string
  value: string
  baseUrl: string
  apiKeyUrl?: string
}

export const Y_API_BASE_URL = "https://api.y-api.bestvirtualgoods.com/v1"
export const Y_API_SITE_URL = "https://y-api.bestvirtualgoods.com/"

export const OAI_API_PROVIDERS: OAIApiProvider[] = [
  {
    label: "Y-API",
    value: "custom",
    baseUrl: Y_API_BASE_URL,
    apiKeyUrl: `${Y_API_SITE_URL}app/keys`
  }
]
