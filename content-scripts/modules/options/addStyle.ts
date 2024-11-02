import removeElement from "../utilities/removeElement";

// Utility function to inject CSS into the page
export default function addStyles(id: string, css: string): void {
    // If the element already exists, remove it
    removeElement(id);

    const head = document.querySelector("head");
    if (head) {
        const style = document.createElement("style");
        style.id = id;
        style.textContent = css;
        head.appendChild(style);
    }
}
