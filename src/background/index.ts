import Browser from "webextension-polyfill";

Browser.runtime.onInstalled.addListener((object) => {
    if (object.reason === "install") {
        Browser.tabs
            .query({ url: "*://sigarra.up.pt/feup/*" })
            .then((tabs) => {
                tabs.forEach(
                    (tab) =>
                        tab.id !== undefined &&
                        void Browser.tabs.reload(tab.id),
                );
            })
            .catch(console.error);

        void Browser.tabs.create({
            url: Browser.runtime.getURL("src/post-install/index.html"),
        });
    }
});

Browser.runtime.onMessage.addListener(async (message, sender) => {
    if (!sender.tab || !sender.tab.active) {
        console.log("tab not active skipping message...");
        return;
    }

    if (message.type == "login") {
        const cookie = await Browser.cookies.get({
            name: "SI_SESSION",
            url: sender.tab.url ?? "",
        });

        if (cookie == null || cookie.value === "0") return false;

        message.auto_login.verifed = true;
        await Browser.storage.local.set({ auto_login: message.auto_login });
        if (sender.tab.id !== undefined)
            void Browser.tabs.reload(sender.tab.id);
    }
});

Browser.permissions.onRemoved.addListener((permissions) => {
    //TODO:
});
