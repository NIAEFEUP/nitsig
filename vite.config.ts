import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import webExtension from "vite-plugin-web-extension";
import path from "node:path";
import fs from "node:fs/promises";
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
            additionalInputs: [
                "src/post-install/index.html",
                ...(await fs.readdir("src/content-styles/options"))
                    .filter((s) => s.endsWith(".css"))
                    .map((s) => `src/content-styles/options/${s}`),
            ],
            scriptViteConfig: {
                build: {
                    rollupOptions: {
                        output: {
                            assetFileNames: "[name]-[hash].[ext]",
                        },
                    },
                },
            },
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
