//messages from offscreen should be passed as {msg:"reload"}
chrome.runtime.onMessage.addListener(async (object) => {
    console.log("Received message... %s", object.msg);
    if(object.msg === "reload"){
    
        var tabList = await chrome.tabs.query({url:"*://sigarra.up.pt/feup/*"});
        for(var tab of tabList){
            console.log("Reloading tab ID: %d", tab.id)
            chrome.tabs.reload(tab.id);
        }
        chrome.runtime.reload();
  }
}
);

  
chrome.offscreen.createDocument({
    url: chrome.runtime.getURL('watch.html'),
    reasons: ['WEB_RTC'],
    justification: 'live reload the app'
});
  
  