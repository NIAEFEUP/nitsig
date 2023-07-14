import { onceModule } from "./base/once";

export default onceModule(() => {
    const scriptElement = document.createElement("script");
    const scriptURL = chrome.runtime.getURL("src/script-overrides/index.ts");
    scriptElement.src = scriptURL;
    scriptElement.id = "se-script-overrides";
    document.head.appendChild(scriptElement);
});
