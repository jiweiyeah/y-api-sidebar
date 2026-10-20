import { useDarkMode } from "~/hooks/useDarkmode"
import { Select, Switch } from "antd"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useI18n } from "@/hooks/useI18n"
import { useStorage } from "@plasmohq/storage/hook"
import { SystemSettings } from "./system-settings"
import { SSTSettings } from "./sst-settings"
import { getDefaultOcrLanguage, ocrLanguages } from "@/data/ocr-language"

export const GeneralSettings = () => {
  const [userChatBubble, setUserChatBubble] = useStorage("userChatBubble", true)

  const [hideChatScrollbar, setHideChatScrollbar] = useStorage(
    "hideChatScrollbar",
    false
  )

  const [copilotResumeLastChat, setCopilotResumeLastChat] = useStorage(
    "copilotResumeLastChat",
    false
  )

  const [webUIResumeLastChat, setWebUIResumeLastChat] = useStorage(
    "webUIResumeLastChat",
    false
  )

  const [restoreLastChatModel, setRestoreLastChatModel] = useStorage(
    "restoreLastChatModel",
    false
  )

  const [copyAsFormattedText, setCopyAsFormattedText] = useStorage(
    "copyAsFormattedText",
    false
  )

  const [autoCopyResponseToClipboard, setAutoCopyResponseToClipboard] =
    useStorage("autoCopyResponseToClipboard", false)

  const [generateTitle, setGenerateTitle] = useStorage("titleGenEnabled", false)

  const [hideCurrentChatModelSettings, setHideCurrentChatModelSettings] =
    useStorage("hideCurrentChatModelSettings", false)

  const [checkWideMode, setCheckWideMode] = useStorage("checkWideMode", false)

  const [openReasoning, setOpenReasoning] = useStorage("openReasoning", false)

  const [defaultThinkingMode, setDefaultThinkingMode] = useStorage(
    "defaultThinkingMode",
    true
  )

  const [useMarkdownForUserMessage, setUseMarkdownForUserMessage] = useStorage(
    "useMarkdownForUserMessage",
    false
  )

  const [defaultOCRLanguage, setDefaultOCRLanguage] = useStorage(
    "defaultOCRLanguage",
    getDefaultOcrLanguage()
  )

  const [sidepanelTemporaryChat, setSidepanelTemporaryChat] = useStorage(
    "sidepanelTemporaryChat",
    false
  )

  const [webuiTemporaryChat, setWebuiTemporaryChat] = useStorage(
    "webuiTemporaryChat",
    false
  )

  const [removeReasoningTagFromCopy, setRemoveReasoningTagFromCopy] =
    useStorage("removeReasoningTagFromCopy", true)

  const [hideReasoningWidget, setHideReasoningWidget] = useStorage(
    "hideReasoningWidget",
    false
  )

  const [persistChatInput, setPersistChatInput] = useStorage(
    "persistChatInput",
    false
  )

  const [tableTextWrap, setTableTextWrap] = useStorage("tableTextWrap", false)

  const [showMoreForLargeMessage, setShowMoreForLargeMessage] = useStorage(
    "showMoreForLargeMessage",
    false
  )

  const [showMessageTimestamp, setShowMessageTimestamp] = useStorage(
    "showMessageTimestamp",
    false
  )

  const [sidebarPosition, setSidebarPosition] = useStorage(
    "sidebarPosition",
    "left"
  )

  const [forceRTL, setForceRTL] = useStorage("forceRTL", false)

  const { mode, toggleDarkMode } = useDarkMode()
  const { t } = useTranslation("settings")
  const { changeLocale, locale, supportLanguage } = useI18n()

  return (
    <dl className="flex flex-col space-y-6 text-sm">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
          {t("generalSettings.title")}
        </h2>
        <div className="border border-b border-gray-200 dark:border-gray-600 mt-3"></div>
      </div>

      <div className="flex flex-row justify-between">
        <span className="text-gray-700   dark:text-neutral-50">
          {t("generalSettings.settings.language.label")}
        </span>

        <Select
          placeholder={t("generalSettings.settings.language.placeholder")}
          allowClear
          showSearch
          style={{ width: "200px" }}
          options={supportLanguage}
          value={locale}
          filterOption={(input, option) =>
            option!.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
            option!.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={(value) => {
            changeLocale(value)
          }}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.copilotResumeLastChat.label")}
          </span>
        </div>
        <Switch
          checked={copilotResumeLastChat}
          onChange={(checked) => setCopilotResumeLastChat(checked)}
        />
      </div>
      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.webUIResumeLastChat.label")}
          </span>
        </div>
        <Switch
          checked={webUIResumeLastChat}
          onChange={(checked) => setWebUIResumeLastChat(checked)}
        />
      </div>
      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.hideCurrentChatModelSettings.label")}
          </span>
        </div>

        <Switch
          checked={hideCurrentChatModelSettings}
          onChange={(checked) => setHideCurrentChatModelSettings(checked)}
        />
      </div>
      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.restoreLastChatModel.label")}
          </span>
        </div>

        <Switch
          checked={restoreLastChatModel}
          onChange={(checked) => setRestoreLastChatModel(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.generateTitle.label")}
          </span>
        </div>

        <Switch
          checked={generateTitle}
          onChange={(checked) => setGenerateTitle(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.wideMode.label")}
          </span>
        </div>

        <Switch
          checked={checkWideMode}
          onChange={(checked) => setCheckWideMode(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.openReasoning.label")}
          </span>
        </div>

        <Switch
          checked={openReasoning}
          onChange={(checked) => setOpenReasoning(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.userChatBubble.label")}
          </span>
        </div>

        <Switch
          checked={userChatBubble}
          onChange={(checked) => setUserChatBubble(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.autoCopyResponseToClipboard.label")}
          </span>
        </div>

        <Switch
          checked={autoCopyResponseToClipboard}
          onChange={(checked) => setAutoCopyResponseToClipboard(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.useMarkdownForUserMessage.label")}
          </span>
        </div>

        <Switch
          checked={useMarkdownForUserMessage}
          onChange={(checked) => setUseMarkdownForUserMessage(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.copyAsFormattedText.label")}
          </span>
        </div>

        <Switch
          checked={copyAsFormattedText}
          onChange={(checked) => setCopyAsFormattedText(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <span className="text-gray-700   dark:text-neutral-50">
          {t("generalSettings.settings.ocrLanguage.label")}
        </span>

        <Select
          placeholder={t("generalSettings.settings.ocrLanguage.placeholder")}
          showSearch
          style={{ width: "200px" }}
          options={ocrLanguages}
          value={defaultOCRLanguage}
          filterOption={(input, option) =>
            option!.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
            option!.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={(value) => {
            setDefaultOCRLanguage(value)
          }}
        />
      </div>

      <div className="flex flex-row justify-between">
        <span className="text-gray-700 dark:text-neutral-50 ">
          {t("generalSettings.settings.sidepanelTemporaryChat.label")}
        </span>

        <Switch
          checked={sidepanelTemporaryChat}
          onChange={(checked) => setSidepanelTemporaryChat(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <span className="text-gray-700 dark:text-neutral-50 ">
          {t("generalSettings.settings.removeReasoningTagFromCopy.label")}
        </span>

        <Switch
          checked={removeReasoningTagFromCopy}
          onChange={(checked) => setRemoveReasoningTagFromCopy(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <span className="text-gray-700 dark:text-neutral-50 ">
          {t("generalSettings.settings.webuiTemporaryChat.label")}
        </span>

        <Switch
          checked={webuiTemporaryChat}
          onChange={(checked) => setWebuiTemporaryChat(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.defaultThinkingMode.label")}
          </span>
        </div>

        <Switch
          checked={defaultThinkingMode}
          onChange={(checked) => setDefaultThinkingMode(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.hideReasoningWidget.label")}
          </span>
        </div>

        <Switch
          checked={hideReasoningWidget}
          onChange={(checked) => setHideReasoningWidget(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.persistChatInput.label")}
          </span>
        </div>

        <Switch
          checked={persistChatInput}
          onChange={(checked) => setPersistChatInput(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.tableTextWrap.label")}
          </span>
        </div>

        <Switch
          checked={tableTextWrap}
          onChange={(checked) => setTableTextWrap(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t("generalSettings.settings.showMoreForLargeMessage.label")}
          </span>
        </div>

        <Switch
          checked={showMoreForLargeMessage}
          onChange={(checked) => setShowMoreForLargeMessage(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t(
              "generalSettings.settings.showMessageTimestamp.label",
              "Show Message Timestamp"
            )}
          </span>
        </div>

        <Switch
          checked={showMessageTimestamp}
          onChange={(checked) => setShowMessageTimestamp(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <span className="text-gray-700 dark:text-neutral-50 ">
          {t("generalSettings.settings.sidebarPosition.label")}
        </span>

        <Select
          allowClear={false}
          style={{ width: "200px" }}
          options={[
            {
              value: "left",
              label: t("generalSettings.settings.sidebarPosition.options.left")
            },
            {
              value: "right",
              label: t("generalSettings.settings.sidebarPosition.options.right")
            }
          ]}
          value={sidebarPosition}
          onChange={(value) => {
            setSidebarPosition(value)
          }}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t(
              "generalSettings.settings.hideChatScrollbar.label",
              "Hide Chat Scrollbar"
            )}
          </span>
        </div>

        <Switch
          checked={hideChatScrollbar}
          onChange={(checked) => setHideChatScrollbar(checked)}
        />
      </div>

      <div className="flex flex-row justify-between">
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-700   dark:text-neutral-50">
            {t(
              "generalSettings.settings.forceRTL.label",
              "Always Use RTL Layout (Right-to-Left in Any Language)"
            )}
          </span>
        </div>
        <Switch checked={forceRTL} onChange={(checked) => setForceRTL(checked)} />
      </div>

      <div className="flex flex-row justify-between">
        <span className="text-gray-700 dark:text-neutral-50 ">
          {t("generalSettings.settings.darkMode.label")}
        </span>

        <button
          onClick={toggleDarkMode}
          className={`inline-flex mt-4 items-center rounded-md border border-transparent bg-black px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm  dark:bg-white dark:text-gray-800 disabled:opacity-50 `}>
          {mode === "dark" ? (
            <SunIcon className="w-4 h-4 mr-2" />
          ) : (
            <MoonIcon className="w-4 h-4 mr-2" />
          )}
          {mode === "dark"
            ? t("generalSettings.settings.darkMode.options.light")
            : t("generalSettings.settings.darkMode.options.dark")}
        </button>
      </div>
      <SSTSettings />
      <SystemSettings />
    </dl>
  )
}
