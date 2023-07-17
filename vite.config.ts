import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import webExtension from "vite-plugin-web-extension";
import path from "node:path";
import { getManifest } from "./src/manifest";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        webExtension({
            manifest: getManifest,
            browser: process.env.TARGET ?? "chrome",
            webExtConfig: {
                startUrl: ["https://sigarra.up.pt/feup/pt/"],
            },
            additionalInputs: ["src/post-install/index.html"],
        }),
    ],
    resolve: {
        alias: {
            "~": path.resolve("src"),
            // In dev mode, make sure fast refresh works
            "/@react-refresh": path.resolve(
                "node_modules/@vitejs/plugin-react-swc/refresh-runtime.js",
            ),
        },
    },
});
