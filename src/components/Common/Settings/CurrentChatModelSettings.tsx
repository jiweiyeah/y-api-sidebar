import { useMessage } from "@/hooks/useMessage"
import { getAllModelSettings, getModelSettings } from "@/services/model-settings"
import { useStoreChatModelSettings } from "@/store/model"
import { useQuery } from "@tanstack/react-query"
import {
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Skeleton,
  Switch
} from "antd"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { SaveButton } from "../SaveButton"
import { getOCRLanguage } from "@/services/ocr"
import { ocrLanguages } from "@/data/ocr-language"
import { useThinkingCapability } from "@/hooks/useThinkingCapability"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  useDrawer?: boolean
  isOCREnabled?: boolean
}

export const CurrentChatModelSettings = ({
  open,
  setOpen,
  useDrawer,
  isOCREnabled
}: Props) => {
  const { t } = useTranslation("common")
  const [form] = Form.useForm()
  const cUserSettings = useStoreChatModelSettings()
  const { selectedModel } = useMessage()
  const { supportsThinking, isGptOss } = useThinkingCapability(selectedModel)

  const savePrompt = useCallback(
    (value: string) => {
      cUserSettings.setX("systemPrompt", value)
    },
    [cUserSettings]
  )

  const saveSettings = useCallback(
    (values: any) => {
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "systemPrompt" && key !== "ocrLanguage") {
          cUserSettings.setX(key, value)
        }
      })
    },
    [cUserSettings]
  )

  const { isPending: isLoading } = useQuery({
    queryKey: ["fetchModelConfig2", open, selectedModel],
    queryFn: async () => {
      const data = await getAllModelSettings()

      // Load model-specific settings if a model is selected
      let modelSpecificSettings = null
      if (selectedModel) {
        try {
          modelSpecificSettings = await getModelSettings(selectedModel)
        } catch (e) {
          console.error("Failed to load model-specific settings:", e)
        }
      }

      const ocrLang = await getOCRLanguage()

      if (isOCREnabled) {
        cUserSettings.setOcrLanguage(ocrLang)
      }

      form.setFieldsValue({
        temperature:
          cUserSettings.temperature ??
          modelSpecificSettings?.temperature ??
          data.temperature,
        topK: cUserSettings.topK ?? modelSpecificSettings?.topK ?? data.topK,
        topP: cUserSettings.topP ?? modelSpecificSettings?.topP ?? data.topP,
        numPredict:
          cUserSettings.numPredict ??
          modelSpecificSettings?.numPredict ??
          data.numPredict,
        minP: cUserSettings.minP ?? modelSpecificSettings?.minP ?? data.minP,
        reasoningEffort:
          cUserSettings?.reasoningEffort ??
          modelSpecificSettings?.reasoningEffort,
        systemPrompt: cUserSettings.systemPrompt ?? "",
        thinking:
          (cUserSettings?.thinking ?? modelSpecificSettings?.thinking) !== false
      })
      return data
    },
    enabled: open,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  const renderBody = () => {
    return (
      <>
        {!isLoading ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              saveSettings(values)
              setOpen(false)
            }}>
            {useDrawer && (
              <>
                <Form.Item
                  name="systemPrompt"
                  help={t("modelSettings.form.systemPrompt.help")}
                  label={t("modelSettings.form.systemPrompt.label")}>
                  <Input.TextArea
                    rows={4}
                    placeholder={t(
                      "modelSettings.form.systemPrompt.placeholder"
                    )}
                    onChange={(e) => savePrompt(e.target.value)}
                  />
                </Form.Item>
                <Divider />
              </>
            )}

            {isOCREnabled && (
              <div className="flex flex-col space-y-2 mb-3">
                <span className="text-gray-700   dark:text-neutral-50">
                  OCR Language
                </span>

                <Select
                  showSearch
                  style={{ width: "100%" }}
                  options={ocrLanguages}
                  value={cUserSettings.ocrLanguage}
                  filterOption={(input, option) =>
                    option!.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0 ||
                    option!.value.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                  }
                  onChange={(value) => {
                    cUserSettings.setOcrLanguage(value)
                  }}
                />
                <Divider />
              </div>
            )}

            <Form.Item
              name="temperature"
              label={t("modelSettings.form.temperature.label")}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder={t("modelSettings.form.temperature.placeholder")}
              />
            </Form.Item>

            <Form.Item
              name="numPredict"
              label={t("modelSettings.form.numPredict.label")}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder={t("modelSettings.form.numPredict.placeholder")}
              />
            </Form.Item>

            {supportsThinking && !isGptOss && (
              <Form.Item
                name="thinking"
                valuePropName="checked"
                label={t("modelSettings.form.thinking.label")}>
                <Switch />
              </Form.Item>
            )}

            <Divider />

            <React.Fragment>
              <Form.Item
                name="topK"
                label={t("modelSettings.form.topK.label")}>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={t("modelSettings.form.topK.placeholder")}
                />
              </Form.Item>

              <Form.Item
                name="topP"
                label={t("modelSettings.form.topP.label")}>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={t("modelSettings.form.topP.placeholder")}
                />
              </Form.Item>

              <Form.Item
                name="minP"
                label={t("modelSettings.form.minP.label")}>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={t("modelSettings.form.minP.placeholder")}
                />
              </Form.Item>

              <Form.Item
                name="reasoningEffort"
                label={t("modelSettings.form.reasoningEffort.label")}>
                <Input
                  style={{ width: "100%" }}
                  placeholder={t(
                    "modelSettings.form.reasoningEffort.placeholder"
                  )}
                />
              </Form.Item>
            </React.Fragment>

            <SaveButton
              className="w-full text-center inline-flex items-center justify-center"
              btnType="submit"
            />
          </Form>
        ) : (
          <Skeleton active />
        )}
      </>
    )
  }

  if (useDrawer) {
    return (
      <Drawer
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        width="min(500px, 100vw)"
        title={t("currentChatModelSettings")}>
        {renderBody()}
      </Drawer>
    )
  }

  return (
    <Modal
      title={t("currentChatModelSettings")}
      open={open}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      centered
      width={520}
      style={{ maxWidth: "calc(100vw - 2rem)" }}
      styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
      footer={null}>
      {renderBody()}
    </Modal>
  )
}
