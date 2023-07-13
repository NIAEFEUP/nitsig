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
                16: "logo/logo-16.png",
                32: "logo/logo-32.png",
                48: "logo/logo-48.png",
                64: "logo/logo-64.png",
                128: "logo/logo-128.png",
            },
            default_popup: "src/popup/index.html",
        },
        content_security_policy: {
            extension_pages: "script-src 'self'; object-src 'self';",
        },
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
        permissions: ["storage", "tabs", "cookies"],
        options_ui: {
            page: "src/options/index.html",
        },
    };
}
