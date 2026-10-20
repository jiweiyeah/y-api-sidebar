import { getOpenAIConfigById } from "@/db/dexie/openai"
import { createManyModels, getAllCustomModels } from "@/db/dexie/models"
import { getAllOpenAIModels } from "@/libs/openai"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Checkbox, Input, Popover, Radio, Spin, Tag, message } from "antd"
import { useMemo, useState } from "react"
import { InfoIcon, RefreshCw } from "lucide-react"
import { Link } from "react-router-dom"

type Props = {
  openaiId: string
  setOpenModelModal: (openModelModal: boolean) => void
}

/**
 * Pulls the model list straight from the provider's `/models` endpoint and
 * lets the user add several models at once. Models that are already stored
 * locally are shown as "added" and cannot be selected again.
 */
export const OpenAIFetchModel = ({ openaiId, setOpenModelModal }: Props) => {
  const { t } = useTranslation(["openai", "common"])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [modelType, setModelType] = useState("chat")
  const queryClient = useQueryClient()

  const { data: config, isLoading: isConfigLoading } = useQuery({
    queryKey: ["openAIConfig", openaiId],
    queryFn: () => getOpenAIConfigById(openaiId),
    enabled: !!openaiId
  })

  const { data: addedModels = [] } = useQuery({
    queryKey: ["fetchCustomModels"],
    queryFn: getAllCustomModels
  })

  const addedIds = useMemo(
    () =>
      new Set(
        addedModels
          .filter((model) => model.provider_id === openaiId)
          .map((model) => model.model_id)
      ),
    [addedModels, openaiId]
  )

  // Keep the API key out of the query key so it never shows up in the
  // react-query cache/devtools; the key lives in IndexedDB only.
  const { data, status, refetch, isFetching } = useQuery({
    queryKey: ["providerModels", openaiId, modelType],
    queryFn: async () => {
      if (!config?.apiKey) {
        return []
      }
      return getAllOpenAIModels({
        baseUrl: config.baseUrl,
        apiKey: config.apiKey,
        modelType: modelType as "chat" | "embedding"
      })
    },
    enabled: !!openaiId && !!config?.apiKey
  })

  const models = useMemo(() => data ?? [], [data])

  const filteredModels = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) {
      return models
    }
    return models.filter((model) =>
      `${model.name ?? ""} ${model.id}`.toLowerCase().includes(term)
    )
  }, [models, searchTerm])

  const selectableModels = useMemo(
    () => filteredModels.filter((model) => !addedIds.has(model.id)),
    [filteredModels, addedIds]
  )

  const allSelectableSelected =
    selectableModels.length > 0 &&
    selectableModels.every((model) => selectedModels.includes(model.id))

  const someSelectableSelected =
    selectableModels.some((model) => selectedModels.includes(model.id)) &&
    !allSelectableSelected

  const remainingCount = useMemo(
    () => models.filter((model) => !addedIds.has(model.id)).length,
    [models, addedIds]
  )

  const handleSelectAll = (checked: boolean) => {
    setSelectedModels(checked ? selectableModels.map((model) => model.id) : [])
  }

  const handleModelSelect = (modelId: string, checked: boolean) => {
    if (addedIds.has(modelId)) {
      return
    }
    if (checked) {
      setSelectedModels((prev) =>
        prev.includes(modelId) ? prev : [...prev, modelId]
      )
    } else {
      setSelectedModels((prev) => prev.filter((id) => id !== modelId))
    }
  }

  const onSave = async (ids: string[]) => {
    const payload = ids.map((id) => ({
      model_id: id,
      name: models.find((model) => model.id === id)?.name ?? id,
      provider_id: openaiId,
      model_type: modelType
    }))

    await createManyModels(payload)

    return true
  }

  const { mutate: saveModels, isPending: isSaving } = useMutation({
    mutationFn: onSave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchCustomModels"] })
      queryClient.invalidateQueries({ queryKey: ["fetchModel"] })
      queryClient.invalidateQueries({ queryKey: ["fetchAllModels"] })
      queryClient.invalidateQueries({ queryKey: ["getAllModelsForSelect"] })
      setOpenModelModal(false)
      message.success(t("modal.model.success"))
    },
    onError: (error) => {
      message.error(
        error instanceof Error ? error.message : t("common:somethingWentWrong")
      )
    }
  })

  const handleSave = () => {
    saveModels(selectedModels)
  }

  if (isConfigLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spin size="large" />
      </div>
    )
  }

  if (!config?.apiKey) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-40 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t("noApiKey")}
        </p>
        <Link
          to="/settings/openai"
          onClick={() => setOpenModelModal(false)}
          className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          {t("goToApiKeySettings")}
        </Link>
      </div>
    )
  }

  if (status === "pending") {
    return (
      <div className="flex items-center justify-center h-40">
        <Spin size="large" />
      </div>
    )
  }

  if (status === "error" || models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-40">
        <p className="text-md text-center text-gray-600 dark:text-gray-300">
          {t("noModelFound")}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[#333]">
          <RefreshCw
            className={`size-4 ${isFetching ? "animate-spin" : ""}`}
          />
          {t("refresh")}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t("modal.model.subheading")}
      </p>

      <div className="flex gap-2">
        <Input
          placeholder={t("searchModel")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          title={t("refresh")}
          className="inline-flex shrink-0 items-center justify-center rounded-md border border-gray-300 px-3 text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[#333]">
          <RefreshCw
            className={`size-4 ${isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <div className="flex justify-between">
        <Checkbox
          checked={allSelectableSelected}
          indeterminate={someSelectableSelected}
          disabled={selectableModels.length === 0}
          onChange={(e) => handleSelectAll(e.target.checked)}>
          {t("selectAll")}
        </Checkbox>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          {`${selectedModels.length} / ${remainingCount}`}
        </div>
      </div>

      <div className="space-y-2 custom-scrollbar max-h-[300px] border overflow-y-auto dark:border-gray-600 rounded-md p-3">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredModels.map((model) => {
            const isAdded = addedIds.has(model.id)
            const isSelected = selectedModels.includes(model.id)

            return (
              <div
                key={model.id}
                onClick={() => handleModelSelect(model.id, !isSelected)}
                className={`flex items-center justify-between py-3 px-2 ${
                  isAdded
                    ? "cursor-default opacity-60"
                    : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={isAdded || isSelected}
                    disabled={isAdded}
                    onChange={(e) => handleModelSelect(model.id, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {`${model?.name || model.id}`.replaceAll(
                        /accounts\/[^\/]+\/models\//g,
                        ""
                      )}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {model.id}
                    </span>
                  </div>
                </div>
                {isAdded && <Tag color="green">{t("alreadyAdded")}</Tag>}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center">
        <Radio.Group
          onChange={(e) => {
            setModelType(e.target.value)
            setSelectedModels([])
          }}
          value={modelType}>
          <Radio value="chat">{t("radio.chat")}</Radio>
          <Radio value="embedding">{t("radio.embedding")}</Radio>
        </Radio.Group>
        <Popover
          content={
            <div>
              <p>
                <b className="text-gray-800 dark:text-gray-100">
                  {t("radio.chat")}
                </b>{" "}
                {t("radio.chatInfo")}
              </p>
              <p>
                <b className="text-gray-800 dark:text-gray-100">
                  {t("radio.embedding")}
                </b>{" "}
                {t("radio.embeddingInfo")}
              </p>
            </div>
          }>
          <InfoIcon className="ml-2 h-4 w-4 text-gray-500 cursor-pointer" />
        </Popover>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving || selectedModels.length === 0}
        className="inline-flex justify-center w-full text-center mt-4 items-center rounded-md border border-transparent bg-black px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-100 disabled:opacity-50">
        {isSaving ? t("saving") : t("save")}
      </button>
    </div>
  )
}
