import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import webExtension from "vite-plugin-web-extension";
import path from "path";
import { getManifest } from "./src/manifest";

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [
            react(),
            webExtension({
                manifest: getManifest,
                webExtConfig: {
                    startUrl: ["https://sigarra.up.pt/feup/pt/"],
                },
            }),
        ],
        resolve: {
            "alias": {
                "~": path.resolve(__dirname, "./src"),
            },
            // In dev mode, make sure fast refresh works
            "/@react-refresh": path.resolve(
                __dirname,
                "./node_modules/@vitejs/plugin-react-swc/refresh-runtime.js",
            ),
        },
    };
});
