document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("permissions").addEventListener("click", () => {
        chrome.permissions
            .request({ origins: ["https://sigarra.up.pt/*"] })
            .then((granted) => {
                if (granted) {
                    chrome.tabs.query(
                        { url: "*://sigarra.up.pt/feup/*" },
                        (tabs) => {
                            tabs.forEach((tab) => {
                                chrome.tabs.reload(tab.id);
                            });
                        },
                    );
                    chrome.tabs.update({
                        url: chrome.runtime.getURL("html/installed.html"),
                    });
                } else {
                    //TODO: Handle when the user didn't grant permissions
                }
            });
    });
});
