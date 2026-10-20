export const Y_API_BASE_URL = "https://api.y-api.bestvirtualgoods.com/v1"
export const Y_API_SITE_URL = "https://y-api.bestvirtualgoods.com/"

/**
 * Y-API Sidebar ships a single, fixed provider. There is no provider picker:
 * the base URL is not user-editable, so only the API key has to be entered.
 */
export const Y_API_PROVIDER = {
  name: "Y-API",
  provider: "yapi",
  baseUrl: Y_API_BASE_URL,
  apiKeyUrl: `${Y_API_SITE_URL}app/keys`
} as const

/** Stable id for the single Y-API provider row in IndexedDB. */
export const Y_API_PROVIDER_ID = "y-api-provider"
