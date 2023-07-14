import { EVENTS } from "./constants";

/**
 * Proxies all events from one element to another.
 *
 * @param el1 The original element with the event listeners
 * @param el2 The new element whose events will be proxied
 */
export const proxyEvents = (el1: Element, el2: Element) => {
    for (const event of EVENTS)
        el2.addEventListener(event, (e) => {
            e.preventDefault();
            e.stopPropagation();
            el1.dispatchEvent(
                new (Object.getPrototypeOf(e).constructor)(e.type, e),
            );
        });
};

/**
 * Copies all attributes from one element to another.
 *
 * @param el1 The original element with the attributes
 * @param el2 The new element that will have the attributes
 */
export const copyAttributes = (el1: Element, el2: Element) => {
    for (const attr of el1.attributes)
        try {
            el2.setAttribute(attr.name, attr.value);
        } catch (error) {
            console.error(error);
        }
};

export const removeElement = (query: string) =>
    document.querySelector(query)?.remove();
