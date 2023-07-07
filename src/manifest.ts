import pkg from "../package.json";

const target = process.env.TARGET ?? "chrome";

type Manifest =
    | chrome.runtime.ManifestV3
    | (Omit<chrome.runtime.ManifestV3, "background"> & {
          background:
              | chrome.runtime.ManifestV3["background"]
              | {
                    scripts: string[];
                };
      });

export function getManifest(): Manifest {
    return {
        author: pkg.author,
        description: pkg.description,
        name: pkg.displayName ?? pkg.name,
        version: pkg.version,
        manifest_version: 3,
        action: {
            default_icon: {
                16: "icons/16.png",
                19: "icons/19.png",
                32: "icons/32.png",
                38: "icons/38.png",
                48: "icons/48.png",
                64: "icons/64.png",
                96: "icons/96.png",
                128: "icons/128.png",
                256: "icons/256.png",
                512: "icons/512.png",
            },
            default_popup: "src/popup/index.html",
        },
        content_security_policy: {
            extension_pages: "script-src 'self'; object-src 'self';",
        },
        content_scripts: [
            {
                run_at: "document_start",
                css: ["src/content-styles/index.css"],
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
        permissions: ["storage", "tabs", "cookies"],
        options_ui: {
            page: "src/options/index.html",
        },
    };
}
