import removeElement from "./removeElement";

// Utility function to inject CSS into page
export default function addStyles(id: string, css: string) {
    // First remove before adding
    removeElement(id);

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `${css}`;
    document.head.appendChild(style);
}
