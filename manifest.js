let manifest = {
    name: "NitSig: Sigarra, but Neater",
    short_name: "NitSig",
    description: "A Neater Sigarra by improving its UI/UX experience and adding new features",
    version: "1.0.3",
    manifest_version: 3,
    icons: {
        16: "images/logo/logo-16.png",
        32: "images/logo/logo-32.png",
        48: "images/logo/logo-48.png",
        128: "images/logo/logo-128.png",
    },
    content_security_policy: {
        extension_pages: "script-src 'self'; object-src 'self';"
    },
    content_scripts: [
        {
            run_at: "document_start",
            matches: ["https://sigarra.up.pt/feup/*"],
            css: [
                "css/simpler.css",
                "css/custom.css",
                "css/icons.css",
                "css/teacherPage.css",
                "css/classPage.css",
                "css/profilePage.css",
                "css/card.css",
                "css/expandableCard.css"
            ],
        },
        {
            run_at: "document_end",
            matches: ["https://sigarra.up.pt/feup/*"],
            js: ["dist/main.js"],
        },
        {
            matches: ["*://sigarra.up.pt/*/web_page.inicial"],
            css: ["css/homepage.css"],
        }
    ],
    web_accessible_resources: [
        {
            resources: [
                "css/main.css",
                "css/custom.css",
                "css/simpler.css",
                "js/override-functions.js",
                "css/icons.css",
                "images/publicationWebsiteLogo/*",
                "images/FEUP.svg",
                "images/feup-map.svg",
            ],
            matches: ["https://sigarra.up.pt/*"],
        },
    ],
    host_permissions: ["https://sigarra.up.pt/*"],
    action: {
        default_icon: {
            16: "images/logo/logo-16.png",
            32: "images/logo/logo-32.png",
            48: "images/logo/logo-48.png",
        },
        default_title: "NitSig",
        default_popup: "index.html",
    },
    permissions: ["storage", "tabs", "cookies"],
};

export const MANIFEST_CHROME = {
    ...manifest,
    background: {
        service_worker: "background.js",
        type: "module",
    }
};

export const MANIFEST_FIREFOX = {
    ...manifest,
    browser_specific_settings: {
        gecko: {
            id: "nitsig@ni.fe.up.pt",
            update_url: "https://ni.fe.up.pt/nitsig/firefox/updates.json",
        },
    },
    background: {
        scripts: ["background.js"],
    }
};