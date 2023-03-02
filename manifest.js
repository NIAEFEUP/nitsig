let manifest = {
    name: "Sigarra extension",
    short_name: "Sigarra extension",
    description: "Sigarra in a simpler way.",
    version: "1.0.0",
    icons: {
        16: "images/logo/logo-16.png",
        32: "images/logo/logo-32.png",
        48: "images/logo/logo-48.png",
        128: "images/logo/logo-128.png",
    },
    permissions: ["storage"],
};

export const MANIFEST_CHROME = {
    ...manifest,
    manifest_version: 3,
    background: {
        service_worker: "background.js",
        type: "module",
    },
    content_scripts: [
        {
        run_at: "document_start",
        matches: ["https://sigarra.up.pt/feup/*"],
        css: ["css/simpler.css", "css/custom.css"],
        },
        {
        run_at: "document_end",
        matches: ["https://sigarra.up.pt/feup/*"],
        js: ["dist/main.js"],
        },
    ],
    web_accessible_resources: [
        {
        resources: [
            "css/main.css",
            "css/custom.css",
            "css/simpler.css",
            "js/override-functions.js"
        ],
        matches: ["https://sigarra.up.pt/*"],
        },
    ],
    action: {
        default_icon: {
        16: "images/logo/logo-16.png",
        32: "images/logo/logo-32.png",
        48: "images/logo/logo-48.png",
        },
        default_title: "Sigarra extension",
        default_popup: "index.html",
    },
    };

export const MANIFEST_FIREFOX = {
    ...manifest,
    manifest_version: 2,
    browser_specific_settings: {
        gecko: {
            //id: "", //TODO: add this
        },
    },
    background: {
        scripts: ["background.js"],
        persistent: false,
    },
    content_scripts: [
        {
        run_at: "document_start",
        matches: ["https://sigarra.up.pt/feup/*"],
        css: ["css/simpler.css", "css/custom.css"],
        },
        {
        run_at: "document_end",
        matches: ["https://sigarra.up.pt/feup/*"],
        js: ["dist/main.js"],
        },
    ],
    web_accessible_resources: [
        "css/main.css",
        "css/simpler.css",
        "css/custom.css",
        "js/override-functions.js"
    ],
    browser_action: {
        default_icon: {
        16: "images/logo/logo-16.png",
        32: "images/logo/logo-32.png",
        48: "images/logo/logo-48.png",
        },
        default_title: "Sigarra extension",
        default_popup: "index.html",
    },
};