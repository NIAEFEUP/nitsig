
document.addEventListener('DOMContentLoaded', (ev) =>{
    document.getElementById("permissions").addEventListener("click", (ev) =>{
        chrome.permissions.request({origins:["https://sigarra.up.pt/*"]});
    });
});
