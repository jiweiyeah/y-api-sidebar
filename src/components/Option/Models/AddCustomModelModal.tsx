import { createModel } from "@/db/dexie/models"
import { getYApiProvider } from "@/db/dexie/openai"
import { getAllOpenAIModels } from "@/libs/openai"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Modal, Form, Radio, AutoComplete, Spin } from "antd"
import { Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useMemo } from "react"
import { Y_API_PROVIDER_ID } from "@/utils/oai-api-providers"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export const AddCustomModelModal: React.FC<Props> = ({ open, setOpen }) => {
  const { t } = useTranslation(["openai"])
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const searchValue = Form.useWatch("model_id", form)
  const selectedModelType = Form.useWatch("model_type", form)

  const {
    data: providerModels,
    isFetching: isFetchingModels,
    status: modelsStatus
  } = useQuery({
    queryKey: ["providerModels", Y_API_PROVIDER_ID, selectedModelType],
    queryFn: async () => {
      const config = await getYApiProvider()
      const models = await getAllOpenAIModels({
        baseUrl: config.baseUrl,
        apiKey: config.apiKey,
        modelType: (selectedModelType as "chat" | "embedding") ?? "chat"
      })
      return models
    },
    enabled: open
  })

  const autoCompleteOptions = useMemo(() => {
    const list = providerModels ?? []
    const cleaned = list.map((m) => ({
      value: m.id,
      label: `${m.name ?? m.id}`.replaceAll(/accounts\/[^\/]+\/models\//g, "")
    }))
    if (searchValue && !cleaned.some((o) => o.value === searchValue)) {
      return [{ value: searchValue, label: searchValue }, ...cleaned]
    }
    return cleaned
  }, [providerModels, searchValue])

  const onFinish = async (values: {
    model_id: string
    model_type: "chat" | "embedding"
  }) => {
    await createModel(
      values.model_id,
      values.model_id,
      Y_API_PROVIDER_ID,
      values.model_type
    )

    return true
  }

  const { mutate: createModelMutation, isPending: isSaving } = useMutation({
    mutationFn: onFinish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchCustomModels"]
      })
      queryClient.invalidateQueries({
        queryKey: ["fetchModel"]
      })
      queryClient.invalidateQueries({
        queryKey: ["getAllModelsForSelect"]
      })
      form.resetFields()
      setOpen(false)
    }
  })

  return (
    <Modal
      footer={null}
      open={open}
      title={t("manageModels.modal.title")}
      onCancel={() => {
        form.resetFields()
        setOpen(false)
      }}>
      <Form form={form} onFinish={createModelMutation} layout="vertical">
        <Form.Item
          name="model_id"
          label={t("manageModels.modal.form.name.label")}
          rules={[
            {
              required: true,
              message: t("manageModels.modal.form.name.required")
            }
          ]}>
          <AutoComplete
            options={autoCompleteOptions}
            placeholder={t("manageModels.modal.form.name.placeholder")}
            size="large"
            filterOption={(inputValue, option) =>
              (option?.label as string)
                ?.toLowerCase()
                .includes(inputValue.toLowerCase()) ||
              (option?.value as string)
                ?.toLowerCase()
                .includes(inputValue.toLowerCase())
            }
            notFoundContent={
              modelsStatus === "pending" || isFetchingModels ? (
                <div className="flex items-center justify-center py-2">
                  <Spin size="small" />
                </div>
              ) : (
                t("noModelFound")
              )
            }
          />
        </Form.Item>

        <Form.Item
          name="model_type"
          label={t("manageModels.modal.form.type.label")}
          initialValue="chat"
          rules={[
            {
              required: true,
              message: t("manageModels.modal.form.type.required")
            }
          ]}>
          <Radio.Group>
            <Radio value="chat">{t("radio.chat")}</Radio>
            <Radio value="embedding">{t("radio.embedding")}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex justify-center w-full text-center mt-4 items-center rounded-md border border-transparent bg-black px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-100 disabled:opacity-50 ">
            {!isSaving ? (
              t("common:save")
            ) : (
              <Loader2 className="w-5 h-5  animate-spin" />
            )}
          </button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
