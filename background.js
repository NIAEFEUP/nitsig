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
    
    if(cookie == null || cookie == 0){
      sendResponse(false);
      return;
    }
    message.auto_login.verifed = true;
    await chrome.storage.local.set({ autoLogin: message.auto_login });
    chrome.tabs.reload(sender.tab.id);

  }
})

// chrome.tabs.onUpdated.addListener(async (_, changeInfo, newTabState) => {
//   if (sigarraRegex.test(changeInfo.url)) {
//     const cookie = await chrome.cookies.get({ name: "SI_SESSION", url: changeInfo.url });
//     if (cookie == null || cookie.value === "0") {
//       //relogin logic
//       console.log("SI_SESSION not set or is 0...");
//       items = await chrome.storage.local.get("autoLogin");
//       if (items.autoLogin === undefined) {
//         console.log("No user credentials in localStorage sync...");
//         return;
//       }
//       items = items.autoLogin;
//       if (items.active === true && items.verifed == true) {
//         const userInfo = atob(items.user_info);
//         console.log("siuuu");
//         const cookies = await fetch(loginPage.format(
//           new URL(changeInfo.url).href,
//           user_info.user,
//           user_info.pass),
//           {
//             method: "post",
//           }
//         )
//         console.log("siuuu");
//         console.log(cookies);
//       }
//     }
//   }
// });
