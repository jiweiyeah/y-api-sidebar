import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Modal, notification } from "antd"
import { RefreshCw } from "lucide-react"
import { CustomModelsTable } from "./CustomModelsTable"
import { AddCustomModelModal } from "./AddCustomModelModal"
import { OpenAIFetchModel } from "@/components/Option/Settings/openai-fetch-model"
import { isFireFoxPrivateMode } from "@/utils/is-private-mode"
import { Y_API_PROVIDER_ID } from "@/utils/oai-api-providers"

export const ModelsBody = () => {
  const [openAddModelModal, setOpenAddModelModal] = useState(false)
  const [openFetchModelModal, setOpenFetchModelModal] = useState(false)
  const { t } = useTranslation(["settings", "common", "openai"])

  const canWrite = () => {
    if (isFireFoxPrivateMode) {
      notification.error({
        message: "Y-API Sidebar can't save data",
        description:
          "Firefox Private Mode does not support saving data to IndexedDB. Please add models from a normal window."
      })
      return false
    }
    return true
  }

  return (
    <div>
      <div className="mb-6">
        <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
          <div className="ml-4 mt-2 flex flex-shrink-0 gap-2">
            <button
              onClick={() => {
                if (!canWrite()) {
                  return
                }
                setOpenFetchModelModal(true)
              }}
              className="inline-flex items-center gap-2 rounded-md border border-transparent bg-black px-2 py-2 text-md font-medium leading-4 text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-100 disabled:opacity-50">
              <RefreshCw className="size-4" />
              {t("openai:fetchModels")}
            </button>

            <button
              onClick={() => {
                if (!canWrite()) {
                  return
                }
                setOpenAddModelModal(true)
              }}
              className="inline-flex items-center rounded-md border border-gray-300 px-2 py-2 text-md font-medium leading-4 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[#333] disabled:opacity-50">
              {t("manageModels.addBtn")}
            </button>
          </div>
        </div>
      </div>

      <CustomModelsTable />

      <AddCustomModelModal
        open={openAddModelModal}
        setOpen={setOpenAddModelModal}
      />

      <Modal
        open={openFetchModelModal}
        onCancel={() => setOpenFetchModelModal(false)}
        footer={null}
        title={t("openai:modal.model.title")}
        width={600}>
        {openFetchModelModal && (
          <OpenAIFetchModel
            openaiId={Y_API_PROVIDER_ID}
            setOpenModelModal={setOpenFetchModelModal}
          />
        )}
      </Modal>
    </div>
  )
}
