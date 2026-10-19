import { useTranslation } from "react-i18next"
import { Descriptions } from "antd"
import { Y_API_SITE_URL } from "@/utils/oai-api-providers"

export const AboutApp = () => {
  const { t } = useTranslation("settings")
  const chromeVersion = browser.runtime.getManifest().version

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-col space-y-4">
        <Descriptions
          title={t("about.heading")}
          column={1}
          size="middle"
          items={[
            {
              key: 1,
              label: t("about.chromeVersion"),
              children: chromeVersion
            },
            {
              key: 2,
              label: "Y-API",
              children: (
                <a
                  href={Y_API_SITE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 dark:text-blue-400">
                  {Y_API_SITE_URL}
                </a>
              )
            },
            {
              key: 3,
              label: "API Keys",
              children: (
                <a
                  href={`${Y_API_SITE_URL}app/keys`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 dark:text-blue-400">
                  {`${Y_API_SITE_URL}app/keys`}
                </a>
              )
            }
          ]}
        />
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Y-API Sidebar is built on the open-source Page Assist project
            (MIT licensed, © 2023 Muhammed Nazeem) and is distributed by Y-API.
          </p>
        </div>
      </div>
    </div>
  )
}
