import { defineConfig } from "wxt"
import react from "@vitejs/plugin-react"
import topLevelAwait from "vite-plugin-top-level-await"

const chromeMV3Permissions = [
  "storage",
  "sidePanel",
  "unlimitedStorage",
  "contextMenus"
]

const firefoxMV2Permissions = [
  "storage",
  "unlimitedStorage",
  "contextMenus",
  "https://api.y-api.bestvirtualgoods.com/*"
]

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [
      react(),
      topLevelAwait({
        promiseExportName: "__tla",
        promiseImportName: (i) => `__tla_${i}`
      }) as any
    ],
    build: {
      rollupOptions: {
        external: ["langchain", "@langchain/community"]
      }
    }
  }),
  entrypointsDir:
    process.env.TARGET === "firefox" ? "entries-firefox" : "entries",
  srcDir: "src",
  outDir: "build",

  manifest: {
    version: "1.0.0",
    name:
      process.env.TARGET === "firefox"
        ? "Y-API Sidebar - AI assistant for any page"
        : "__MSG_extName__",
    description: "__MSG_extDescription__",
    default_locale: "en",
    action: {},
    author: "Y-API",
    homepage_url: "https://y-api.bestvirtualgoods.com/",
    browser_specific_settings:
      process.env.TARGET === "firefox"
        ? {
          gecko: {
            id: "y-api-sidebar@bestvirtualgoods"
          }
        }
        : undefined,
    host_permissions:
      process.env.TARGET !== "firefox"
        ? ["https://api.y-api.bestvirtualgoods.com/*"]
        : undefined,
    commands: {
      _execute_action: {
        description: "Open the Web UI",
        suggested_key: {
          default: "Ctrl+Shift+L"
        }
      },
      execute_side_panel: {
        description: "Open the side panel",
        suggested_key: {
          default: "Ctrl+Shift+Y"
        }
      }
    },
    content_security_policy:
      process.env.TARGET !== "firefox" ?
        {
          extension_pages:
            "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
        } :  "script-src 'self' 'wasm-unsafe-eval' blob:; object-src 'self'; worker-src 'self' blob:;",
    permissions:
      process.env.TARGET === "firefox"
        ? firefoxMV2Permissions
        : chromeMV3Permissions
  }
}) as any
