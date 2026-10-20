// this is a temp fix for firefox
// because chunks getting 4mb+ and it's not working on firefox addon store
import { lazy } from "react"
import { Route, Routes } from "react-router-dom"

const SidepanelChat = lazy(() => import("./sidepanel-chat"))
const SidepanelSettings = lazy(() => import("./sidepanel-settings"))
const SidepanelSettingsOpenAI = lazy(() => import("./sidepanel-settings-openai"))
const SidepanelSettingsModel = lazy(() => import("./sidepanel-settings-model"))

const OptionIndex = lazy(() => import("./option-index"))
const OptionModal = lazy(() => import("./option-settings-model"))
const OptionSettings = lazy(() => import("./option-settings"))
const OptionAbout = lazy(() => import("./option-settings-about"))
const OptionOpenAI = lazy(() => import("./option-settings-openai"))

export const OptionRoutingFirefox = () => {
  return (
    <Routes>
      <Route path="/" element={<OptionIndex />} />
      <Route path="/settings" element={<OptionSettings />} />
      <Route path="/settings/model" element={<OptionModal />} />
      <Route path="/settings/openai" element={<OptionOpenAI />} />
      <Route path="/settings/about" element={<OptionAbout />} />
    </Routes>
  )
}

export const SidepanelRoutingFirefox = () => {
  return (
    <Routes>
      <Route path="/" element={<SidepanelChat />} />
      <Route path="/settings" element={<SidepanelSettings />} />
      <Route path="/settings/openai" element={<SidepanelSettingsOpenAI />} />
      <Route path="/settings/model" element={<SidepanelSettingsModel />} />
    </Routes>
  )
}
