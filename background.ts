// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sigarraRegex: RegExp = /.*:\/\/sigarra\.up\.pt\/feup\/.*/;

interface PopupOptions {
    navbar: "on" | "off";
    shortcuts: "on" | "off";
    autoLogin: "on" | "off";
    font: "on" | "off";
    expand: "on" | "off";
}

// Add default values for each option here
const popupOptions: PopupOptions = {
    navbar: "on",
    shortcuts: "on",
    autoLogin: "off",
    font: "on",
    expand: "off",
};

const reloadFEUPSigarraPages = (): void => {
    chrome.tabs.query({ url: "*://sigarra.up.pt/feup/*" }, (tabs) => {
        tabs.forEach((tab) => {
            if (tab.id !== undefined) {
                chrome.tabs.reload(tab.id);
            }
        });
    });
};

chrome.runtime.onInstalled.addListener((object) => {
    if (object.reason === "install") {
        reloadFEUPSigarraPages();

        if (navigator.userAgent.toLowerCase().includes("firefox")) {
            chrome.tabs.create({
                url: chrome.runtime.getURL("html/autorize.html"),
            });
        } else {
            chrome.tabs.create({
                url: chrome.runtime.getURL("html/installed.html"),
            });
        }

        chrome.storage.local.set(popupOptions);
    }

    if (object.reason === "update") {
        reloadFEUPSigarraPages();
        for (const opt in popupOptions) {
            chrome.storage.local.get(opt, (result) => {
                if (result[opt] == null) {
                    chrome.storage.local.set({
                        [opt]: popupOptions[opt as keyof PopupOptions],
                    });
                }
            });
        }
    }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (!sender.tab || !sender.tab.active) {
        console.log("tab not active skipping message...");
        return;
    }

    if (message.type === "login") {
        const cookie = await chrome.cookies.get({
            name: "SI_SESSION",
            url: sender.tab.url!,
        });
        console.log(cookie);
        if (!cookie || cookie.value === "0") {
            sendResponse(false);
            return;
        }
        message.auto_login.verified = true;
        await chrome.storage.local.set({ auto_login: message.auto_login });
        sendResponse(true);
    }
});

chrome.permissions.onRemoved.addListener(() => {
    //TODO:
});
