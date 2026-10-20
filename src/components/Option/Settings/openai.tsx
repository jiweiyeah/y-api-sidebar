import { Form, Input, Modal, message, Tooltip, Skeleton } from "antd"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { getYApiProvider, setYApiApiKey } from "@/db/dexie/openai"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Settings, Sparkles } from "lucide-react"
import { OpenAIFetchModel } from "./openai-fetch-model"
import { Y_API_PROVIDER, Y_API_PROVIDER_ID } from "@/utils/oai-api-providers"
import { getAllCustomModels, deleteModel } from "@/db/dexie/models"
import { isFireFoxPrivateMode } from "@/utils/is-private-mode"

/**
 * Y-API is the only provider. There is nothing to add, edit or delete: the
 * base URL is fixed and the user only supplies an API key. Models are pulled
 * from the provider's `/models` endpoint and stored locally.
 */
export const OpenAIApp = () => {
  const { t } = useTranslation(["openai", "settings", "common"])
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [openModelModal, setOpenModelModal] = useState(false)

  const { data: provider, isLoading } = useQuery({
    queryKey: ["yApiProvider"],
    queryFn: getYApiProvider
  })

  const { data: models = [], isLoading: modelsLoading } = useQuery({
    queryKey: ["fetchCustomModels"],
    queryFn: getAllCustomModels
  })

  const saveMutation = useMutation({
    mutationFn: setYApiApiKey,
    onSuccess: () => {
      message.success(t("openai:addSuccess"))
      queryClient.invalidateQueries({ queryKey: ["yApiProvider"] })
      queryClient.invalidateQueries({ queryKey: ["getAllModelsForSelect"] })
      queryClient.invalidateQueries({ queryKey: ["providerModels"] })
    },
    onError: (error) => {
      message.error(
        error instanceof Error ? error.message : t("common:somethingWentWrong")
      )
    }
  })

  const deleteModelMutation = useMutation({
    mutationFn: deleteModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchCustomModels"] })
      queryClient.invalidateQueries({ queryKey: ["getAllModelsForSelect"] })
    }
  })

  const handleSave = async () => {
    const values = await form.validateFields()
    saveMutation.mutate(values.apiKey)
  }

  if (isLoading || !provider) {
    return <Skeleton active paragraph={{ rows: 6 }} />
  }

  const showKeyNotice = !provider.apiKey

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t("openai:heading")}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("openai:subheading")}
            </p>
          </div>
          <a
            href={Y_API_PROVIDER.apiKeyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap text-sm text-blue-600 hover:underline dark:text-blue-400">
            {t("openai:modal.apiKey.create")}
          </a>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-[#262626]">
        <Form
          form={form}
          layout="vertical"
          initialValues={{ apiKey: provider.apiKey }}
          onFinish={handleSave}>
          <Form.Item label={t("openai:table.name")}>
            <Input value={Y_API_PROVIDER.name} disabled />
          </Form.Item>

          <Form.Item label={t("openai:table.baseUrl")}>
            <Input value={Y_API_PROVIDER.baseUrl} disabled />
          </Form.Item>

          <Form.Item
            label={t("openai:modal.apiKey.label")}
            name="apiKey"
            rules={[
              {
                required: true,
                message: t("openai:modal.apiKey.required")
              }
            ]}>
            <Input.Password
              placeholder={t("openai:modal.apiKey.placeholder")}
              autoComplete="off"
            />
          </Form.Item>

          {showKeyNotice && (
            <p className="mb-4 text-xs text-amber-600 dark:text-amber-400">
              {t(
                "openai:modal.apiKey.help",
                "Paste the key you created on the Y-API site. It is stored locally in this browser."
              )}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="inline-flex items-center rounded-md border border-transparent bg-black px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100">
              {saveMutation.isPending ? t("openai:saving") : t("openai:save")}
            </button>

            <button
              type="button"
              onClick={() => setOpenModelModal(true)}
              disabled={!provider.apiKey}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[#333]">
              <Sparkles className="size-4" />
              {t("openai:newModel")}
            </button>
          </div>
        </Form>
      </div>

      <div className="mt-8">
        <h3 className="mb-3 text-base font-medium text-gray-900 dark:text-gray-100">
          {t("openai:manageModels.columns.name")}
        </h3>

        {modelsLoading && <Skeleton active paragraph={{ rows: 4 }} />}

        {!modelsLoading && models.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("openai:noModelFound")}
          </p>
        )}

        {!modelsLoading && models.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t("openai:manageModels.columns.nickname")}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t("openai:manageModels.columns.model_id")}
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t("openai:manageModels.columns.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {models.map((model) => (
                  <tr key={model.id}>
                    <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200">
                      <div className="flex items-center gap-2">
                        <Settings className="size-3 text-gray-400" />
                        {model.nickname}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                      {model.model_id}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Tooltip title={t("openai:manageModels.tooltip.delete")}>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(t("openai:manageModels.confirm.delete"))
                            ) {
                              deleteModelMutation.mutate(model.id)
                            }
                          }}
                          disabled={isFireFoxPrivateMode}
                          className="text-sm text-red-500 hover:underline disabled:opacity-50 dark:text-red-400">
                          {t("openai:delete")}
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={openModelModal}
        onCancel={() => setOpenModelModal(false)}
        footer={null}
        title={t("openai:modal.model.title")}
        width={600}>
        {openModelModal && (
          <OpenAIFetchModel
            openaiId={Y_API_PROVIDER_ID}
            setOpenModelModal={setOpenModelModal}
          />
        )}
      </Modal>
    </div>
  )
}
