import { YApiIcon } from "../Icons/YApi"

/**
 * Y-API Sidebar has exactly one provider, so every model renders the Y-API
 * mark. The `provider` prop is kept because model rows still carry it and
 * imported data may contain other values — they all fall back here.
 */
export const ProviderIcons = ({
  className
}: {
  provider?: string
  className?: string
}) => {
  return <YApiIcon className={className} />
}
