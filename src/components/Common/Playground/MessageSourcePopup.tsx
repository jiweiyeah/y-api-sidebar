import { Modal } from "antd"

type Props = {
  source: any
  open: boolean
  setOpen: (open: boolean) => void
}

export const MessageSourcePopup: React.FC<Props> = ({
  source,
  open,
  setOpen
}) => {
  return (
    <Modal
      open={open}
      // mask={false}
      zIndex={10000}
      onCancel={() => setOpen(false)}
      footer={null}
      onOk={() => setOpen(false)}>
      <div className="flex flex-col gap-2 mt-6">
        <h4 className="bg-gray-100 text-md dark:bg-gray-800 inline-flex gap-2 items-center text-gray-800 dark:text-gray-100 font-semibold p-2">
          {source?.name}
        </h4>
        <p className="text-gray-500 text-sm">{source?.pageContent}</p>
      </div>
    </Modal>
  )
}
