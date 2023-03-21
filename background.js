// Used by the manifest v3 extension
const sigarraRegex = /.*:\/\/sigarra\.up\.pt\/feup\/.*/;
const loginPage = "https://sigarra.up.pt/feup/pt/vld_validacao.validacao?p_app=162&p_amo=55&p_address={0}&p_user={1}&p_pass={2}"

chrome.runtime.onInstalled.addListener((object) => {
  if (object.reason === "install") {
    chrome.tabs.query({ url: "*://sigarra.up.pt/feup/*" }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.reload(tab.id);
      });
    });
    chrome.tabs.create({
      url:chrome.runtime.getURL("html/install.html")
    });
  }
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, newTabState) => {
  if(newTabState.active && sigarraRegex.test(changeInfo.url)){
    chrome.cookies.get({name:"SI_SESSION",  url:changeInfo.url}, (cookie) => {
      if(cookie == null || cookie.value === "0"){
        //relogin logic
        console.log("SI_SESSION not set or is 0...");
        chrome.storage.local.get("autoLogin", (items) =>{
          if(items.autoLogin === undefined){
            console.log("No user credentials in localStorage sync...");
            return;
          }
          items = items.autoLogin;
          if(items.active === true && items.verfied == true){
            var userInfo = atob(items.user_info);
            console.log(userInfo);
            fetch(loginPage.format(
                new URL(changeInfo.url).href, 
                user_info.user, 
                user_info.pass), 
              {
                method:"post",
              }
            ).then((response) => {
              console.log(request.headers);
            });
          }
        });
      }
    }); 
  }
});
