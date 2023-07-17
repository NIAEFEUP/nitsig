import Browser from "webextension-polyfill";
import pkg from "../package.json";

const target = process.env.TARGET ?? "chrome";

export function getManifest(): Browser.Manifest.WebExtensionManifest {
    return {
        author: pkg.author,
        description: pkg.description,
        name: pkg.displayName ?? pkg.name,
        version: pkg.version,
        manifest_version: 3,
        action: {
            default_popup: "src/popup/index.html",
        },
        // content_security_policy: {
        //     extension_pages: "script-src 'self' localhost; object-src 'self' localhost;",
        // },
        content_scripts: [
            {
                run_at: "document_start",
                js: ["src/content-scripts/index.ts"],
                matches: ["*://sigarra.up.pt/feup/*"],
            },
        ],
        background:
            target === "firefox"
                ? {
                      scripts: ["src/background/index.ts"],
                  }
                : {
                      service_worker: "src/background/index.ts",
                      type: "module",
                  },
        host_permissions: ["*://sigarra.up.pt/feup/*"],
        icons: {
            16: "logo/logo-16.png",
            32: "logo/logo-32.png",
            48: "logo/logo-48.png",
            64: "logo/logo-64.png",
            128: "logo/logo-128.png",
        },
        permissions: ["storage", "tabs", "cookies"],
        options_ui: {
            page: "src/options/index.html",
        },
    };
}
