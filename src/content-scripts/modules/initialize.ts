// Append override-functions.js to the page
export const injectOverrideFunctions = () => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("src/script-overrides/index.ts");
    document.body.appendChild(script);
};

/**
 * Reverse the date direction
 * Ex: 2023-10-05 to 05-10-2023
 */
export const reverseDateDirection = () => {
    document.querySelectorAll(".data").forEach((date) => {
        const dateObj = new Date(date.innerHTML);

        if (dateObj instanceof Date)
            date.innerHTML = date.innerHTML.split("-").reverse().join("-");
    });
};
