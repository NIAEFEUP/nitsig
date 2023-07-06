import throttle from "./utilities/throttle";
import { getPath } from "./utilities/sigarra";

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

/**
 * Reverse the date direction
 * Ex: 2023-10-05 to 05-10-2023
 */
export const reverseDateDirection = () => {
  document.querySelectorAll(".data").forEach(date => {
      const dateObj = new Date(date.innerHTML);
      if(dateObj instanceof Date && !isNaN(dateObj)){
        date.innerHTML = date.innerHTML.split('-').reverse().join('-');
      }
  });
}
