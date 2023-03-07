import throttle from "./utilities/throttle";

// Resize Listener
export const addResizeListener = () => {
  window.addEventListener(
    "resize",
    throttle(async () => {
      /*

        Code here

      */
    }, 1000)
  );
};

// Append override-functions.js to the page
export const injectOverrideFunctions = () => {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("js/override-functions.js");
  document.body.appendChild(script);
}
