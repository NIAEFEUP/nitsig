// Used by the manifest v3 extension
const sigarraRegex = /.*:\/\/sigarra\.up\.pt\/feup\/.*/;

chrome.runtime.onInstalled.addListener((object) => {
  if (object.reason === "install") {
    chrome.tabs.query({ url: "*://sigarra.up.pt/feup/*" }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.reload(tab.id);
      });
    });
    chrome.tabs.create({
      url: chrome.runtime.getURL("html/install.html")
    });
  }
});


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if(!sender.tab.active){
    console.log("tab not active skipping message...")
    return;
  }
  if (message.type == "login") {
    const cookie = await chrome.cookies.get({ name: "SI_SESSION", url: sender.tab.url })
    console.log(cookie)
    if(cookie == null || cookie.value === "0"){
      sendResponse(false);
      return;
    }
    message.auto_login.verifed = true;
    await chrome.storage.local.set({ auto_login: message.auto_login });
    chrome.tabs.reload(sender.tab.id);

  }
});