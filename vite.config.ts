import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Todo List Pwa",
        short_name: "Todo List",
        description: "A Progressive Todo List Web App",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-72x72.png",
            type: "image/png",
            sizes: "72x72",
          },
          {
            src: "/icons/icon-96x96.png",
            type: "image/png",
            sizes: "96x96",
          },
          {
            src: "/icons/icon-128x128.png",
            type: "image/png",
            sizes: "128x128",
          },
          {
            src: "/icons/icon-384x384.png",
            type: "image/png",
            sizes: "384x384",
          },
          {
            src: "/icons/icon-512x512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
      },
    }),
  ],
})
