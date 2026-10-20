import { ProviderIcons } from "@/components/Common/ProviderIcon"
import { useQuery } from "@tanstack/react-query"
import { Avatar, Select } from "antd"
import { Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useMessage } from "~/hooks/useMessage"
import { fetchChatModels } from "~/services/ollama"
import { Y_API_SITE_URL } from "@/utils/oai-api-providers"

export const EmptySidePanel = () => {
  const { t } = useTranslation(["playground", "common"])

  // No local daemon to probe: "configured" simply means the user has at least
  // one Y-API provider with models under /settings/openai.
  const { data: models, status: ollamaStatus } = useQuery({
    queryKey: ["getAllModelsForSelect"],
    queryFn: () => fetchChatModels()
  })

  const { setSelectedModel, selectedModel } = useMessage()

  const renderSection = () => {
    return (
      <div className="mt-4">
        <Select
          onChange={(e) => {
            setSelectedModel(e)
            localStorage.setItem("selectedModel", e)
          }}
          value={selectedModel}
          size="large"
          filterOption={(input, option) => {
            //@ts-ignore
            return (
              option?.label?.props["data-title"]
                ?.toLowerCase()
                ?.indexOf(input.toLowerCase()) >= 0
            )
          }}
          showSearch
          placeholder={t("common:selectAModel")}
          style={{ width: "100%", height: "100%" }}
          className="mt-4 min-w-60 max-w-64"
          options={models?.map((model) => ({
            label: (
              <span
                key={model.model}
                data-title={model.name}
                className="flex flex-row gap-3 items-center whitespace-normal overflow-visible leading-[1.5]">
                {model?.avatar ? (
                  <Avatar src={model.avatar} alt={model.name} size="small" />
                ) : (
                  <ProviderIcons
                    provider={model?.provider}
                    className="min-w-5 min-h-5 w-5 h-5"
                  />
                )}
                <span>{model?.nickname || model.model}</span>
              </span>
            ),
            value: model.model
          }))}
        />
      </div>
    )
  }

  if (ollamaStatus === "pending") {
    return (
      <div className="mx-auto sm:max-w-md px-4 mt-10">
        <div className="rounded-lg justify-center items-center flex flex-col border dark:border-gray-700 p-8 bg-white dark:bg-[#262626] shadow-sm">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
      </div>
    )
  }

  const hasModels = (models?.length ?? 0) > 0

  return (
    <div className="mx-auto sm:max-w-md px-4 mt-10">
      <div className="rounded-lg justify-center items-center flex flex-col border border-gray-300 dark:border-gray-700 p-8 bg-white dark:bg-[#262626] shadow-sm">
        <div className="inline-flex items-center space-x-2">
          <p className="dark:text-gray-400 text-gray-900">
            <span>👋</span>
            {t("welcome")}
          </p>
        </div>

        {hasModels ? (
          renderSection()
        ) : (
          <div className="mt-4 flex flex-col space-y-3 justify-center items-center w-full">
            <p className="text-sm text-gray-700 dark:text-gray-400 text-center">
              {t(
                "yapiSetup.hint",
                "Add your Y-API API key to start chatting with any page."
              )}
            </p>
            <button
              onClick={() => {
                browser.tabs.create({
                  url: browser.runtime.getURL("/options.html#/settings/openai")
                })
              }}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 bg-black text-white dark:bg-white dark:text-black hover:opacity-90">
              {t("yapiSetup.button", "Add API key")}
            </button>
            <a
              href={`${Y_API_SITE_URL}app/keys`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 underline">
              {t("yapiSetup.getKey", "Get a key at Y-API")}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
