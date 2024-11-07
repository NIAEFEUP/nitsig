// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";

import removeElement from "../utilities/removeElement";

// Utility function to inject CSS into the page
export default function addStyles(id: string, css: string): void {
    // If the element already exists, remove it
    removeElement(id);

    const style = <style id={id}>{css}</style>;
    const head = document.querySelector("head");
    if (head) head.appendChild(style);
}
