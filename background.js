// Used by the manifest v3 extension

chrome.runtime.onInstalled.addListener((object) => {
  if (object.reason === "install") {
    chrome.tabs.query({ url: "*://sigarra.up.pt/feup/*" }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.reload(tab.id);
      });
    });
  }
});
