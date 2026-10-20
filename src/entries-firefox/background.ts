import { browser } from "wxt/browser"
import { Storage } from "@plasmohq/storage"
import { getInitialConfig } from "@/services/action"

export default defineBackground({
  main() {
    const storage = new Storage({
      area: "local"
    })
    let actionIconClick: string = "webui"
    let contextMenuClick: string = "sidePanel"

    const contextMenuId = {
      webui: "open-web-ui-pa",
      sidePanel: "open-side-panel-pa"
    }

    const contextMenuTitle = {
      webui: browser.i18n.getMessage("openOptionToChat"),
      sidePanel: browser.i18n.getMessage("openSidePanelToChat")
    }

    const initialize = async () => {
      try {
        storage.watch({
          actionIconClick: (value) => {
            const newValue = value?.newValue || "webui"
            actionIconClick = newValue
          },
          contextMenuClick: (value) => {
            const oldValue = value?.oldValue || "sidePanel"
            const newValue = value?.newValue || "sidePanel"
            if (oldValue !== newValue) {
              contextMenuClick = newValue
              browser.contextMenus.remove(contextMenuId[oldValue])
              browser.contextMenus.create({
                id: contextMenuId[newValue],
                title: contextMenuTitle[newValue],
                contexts: ["page", "selection"]
              })
            }
          }
        })
        const data = await getInitialConfig()
        contextMenuClick = data.contextMenuClick
        actionIconClick = data.actionIconClick
        browser.contextMenus.create({
          id: contextMenuId[contextMenuClick],
          title: contextMenuTitle[contextMenuClick],
          contexts: ["page", "selection"]
        })
      } catch (error) {
        console.error("Error in initLogic:", error)
      }
    }

    browser.runtime.onMessage.addListener(async (message) => {
      if (message.type === "sidepanel") {
        await browser.sidebarAction.open()
      }
    })

    browser.browserAction.onClicked.addListener((tab) => {
      if (actionIconClick === "webui") {
        browser.tabs.create({ url: browser.runtime.getURL("/options.html") })
      } else {
        browser.sidebarAction.toggle()
      }
    })

    browser.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === "open-side-panel-pa") {
        browser.sidebarAction.toggle()
      } else if (info.menuItemId === "open-web-ui-pa") {
        browser.tabs.create({
          url: browser.runtime.getURL("/options.html")
        })
      }
    })

    browser.commands.onCommand.addListener((command) => {
      switch (command) {
        case "execute_side_panel":
          browser.sidebarAction.toggle()
          break
        default:
          break
      }
    })

    initialize()
  },
  persistent: true
})
