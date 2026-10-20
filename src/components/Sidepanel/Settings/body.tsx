import { Select, Switch } from "antd"
import { useDarkMode } from "~/hooks/useDarkmode"
import { SUPPORTED_LANGUAGES } from "~/utils/supported-languages"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useI18n } from "@/hooks/useI18n"
import { useStorage } from "@plasmohq/storage/hook"
import { SSTSettings } from "@/components/Option/Settings/sst-settings"

export const SettingsBody = () => {
  const { t } = useTranslation("settings")

  const [copilotResumeLastChat, setCopilotResumeLastChat] = useStorage(
    "copilotResumeLastChat",
    false
  )

  const [hideCurrentChatModelSettings, setHideCurrentChatModelSettings] =
    useStorage("hideCurrentChatModelSettings", false)

  const [speechToTextLanguage, setSpeechToTextLanguage] = useStorage(
    "speechToTextLanguage",
    "en-US"
  )
  const { mode, toggleDarkMode } = useDarkMode()

  const { changeLocale, locale, supportLanguage } = useI18n()

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
      <div className="border space-y-3 w-full border-gray-300 dark:border-gray-700 rounded p-4 bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-base mb-4 font-semibold leading-7 text-gray-900 dark:text-white">
          {t("generalSettings.title")}
        </h2>
        <div className="flex flex-col  space-y-4">
          <span className="text-gray-500   dark:text-neutral-50">
            {t("generalSettings.settings.copilotResumeLastChat.label")}
          </span>

          <div>
            <Switch
              checked={copilotResumeLastChat}
              onChange={(checked) => setCopilotResumeLastChat(checked)}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="text-gray-500   dark:text-neutral-50">
              {t("generalSettings.settings.hideCurrentChatModelSettings.label")}
            </span>
          </div>
          <div>
            <Switch
              checked={hideCurrentChatModelSettings}
              onChange={(checked) => setHideCurrentChatModelSettings(checked)}
            />
          </div>
        </div>
        <div>
          <div className="text-xs mb-2  dark:text-white">
            {t("generalSettings.settings.speechRecognitionLang.label")}{" "}
          </div>
          <Select
            placeholder={t(
              "generalSettings.settings.speechRecognitionLang.placeholder"
            )}
            allowClear
            showSearch
            options={SUPPORTED_LANGUAGES}
            value={speechToTextLanguage}
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={(value) => {
              setSpeechToTextLanguage(value)
            }}
            style={{
              width: "100%"
            }}
          />
        </div>
        <div>
          <div className="text-xs mb-2  dark:text-white">
            {t("generalSettings.settings.language.label")}{" "}
          </div>

          <Select
            placeholder={t("generalSettings.settings.language.placeholder")}
            showSearch
            options={supportLanguage}
            value={locale}
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={(value) => {
              changeLocale(value)
            }}
            style={{
              width: "100%"
            }}
          />
        </div>
      </div>
      <div className="border border-gray-300 dark:border-gray-700 rounded p-4 bg-white dark:bg-[#1a1a1a]">
        <SSTSettings hideBorder />
      </div>
      <div className="border border-gray-300 dark:border-gray-700 rounded p-4 bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-md mb-4 font-semibold dark:text-white">
          {t("generalSettings.settings.darkMode.label")}{" "}
        </h2>
        {mode === "dark" ? (
          <button
            onClick={toggleDarkMode}
            className="select-none inline-flex text-center w-full rounded-lg border border-gray-900 py-3 px-6 justify-center font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none dark:border-gray-100 dark:text-white dark:hover:opacity-75 dark:focus:ring-dark dark:active:opacity-75 dark:disabled:pointer-events-none dark:disabled:opacity-50 dark:disabled:shadow-none">
            <SunIcon className="h-4 w-4 mr-2" />
            {t("generalSettings.settings.darkMode.options.light")}
          </button>
        ) : (
          <button
            onClick={toggleDarkMode}
            className="select-none inline-flex text-center w-full rounded-lg border border-gray-900 py-3 px-6 justify-center font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none dark:border-gray-100 dark:text-white dark:hover:opacity-75 dark:focus:ring-dark dark:active:opacity-75 dark:disabled:pointer-events-none dark:disabled:opacity-50 dark:disabled:shadow-none">
            <MoonIcon className="h-4 w-4 mr-2" />
            {t("generalSettings.settings.darkMode.options.dark")}
          </button>
        )}
      </div>
    </div>
  )
}
