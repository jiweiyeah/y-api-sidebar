import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { fetchChatModels } from "~/services/ollama"
import { Y_API_SITE_URL } from "@/utils/oai-api-providers"

export const PlaygroundEmpty = () => {
  const { t } = useTranslation(["playground", "common"])

  const { data, status } = useQuery({
    queryKey: ["yapiModels"],
    queryFn: () => fetchChatModels()
  })

  if (status === "pending") {
    return (
      <div className="mx-auto sm:max-w-xl px-4 mt-10">
        <div className="rounded-lg justify-center items-center flex flex-col border p-8 bg-gray-50 dark:bg-[#262626] dark:border-gray-600">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    )
  }

  const hasModels = (data?.length ?? 0) > 0

  return (
    <div className="mx-auto sm:max-w-xl px-4 mt-10">
      <div className="rounded-lg justify-center items-center flex flex-col border p-8 bg-gray-50 dark:bg-[#262626] dark:border-gray-600">
        <h1 className="text-sm font-medium text-center text-gray-500 dark:text-gray-400 flex gap-3 items-center justify-center">
          <span>👋</span>
          <span className="text-gray-700 dark:text-gray-300">
            {t("welcome")}
          </span>
        </h1>
        {!hasModels && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            {t(
              "yapiSetup.hint",
              "Add your Y-API API key to start chatting with any page."
            )}
            <Link
              to="/settings/openai"
              className="ml-1 text-blue-600 dark:text-blue-400 underline">
              {t("yapiSetup.button", "Add API key")}
            </Link>
            <a
              href={`${Y_API_SITE_URL}app/keys`}
              target="_blank"
              rel="noreferrer"
              className="ml-1 text-blue-600 dark:text-blue-400 underline">
              {t("yapiSetup.getKey", "Get a key at Y-API")}
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
