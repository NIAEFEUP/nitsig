import {
    BANNER_ICON_MAP,
    BG_IMAGE_ICON_MAP,
    FA_ICON_MAP,
    IMG_ICON_MAP,
    EVENTS,
} from "./constants";

/**
 * Adds a link to the Remix Icon stylesheet if it's not already included in the document.
 */
const addCSS = (): void => {
    if (!document.querySelector('link[href$="remixicon.css"]')) {
        // TODO (thePeras): Why we don't shipped the css file with the extension already?
        document.head.innerHTML +=
            '<link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">';
    }
};

/**
 * Replaces <img> elements with corresponding icons based on their src attributes.
 */
const replaceImages = (): void => {
    /**
     * Handles the replacement of an individual image element with its corresponding icon.
     * @param {HTMLImageElement} i - The image element to process.
     */
    const handleImage = (i: HTMLImageElement): void => {
        const icon = IMG_ICON_MAP[i.src.substring(i.src.lastIndexOf("/") + 1)];

        let span: HTMLSpanElement | null = null;

        if (i.nextElementSibling?.matches(".se-icon")) {
            span = i.nextElementSibling as HTMLSpanElement;
        }

        if (icon === undefined) {
            span?.remove();
            i.classList.remove("se-hidden-icon");
            return;
        }

        i.classList.add("se-hidden-icon");

        if (icon === "") {
            span?.remove();
            return;
        }

        if (!span) {
            span = document.createElement("span");
            i.insertAdjacentElement("afterend", span);
            copyEvents(i, span);
        }

        const size = Math.max(
            Math.round(Math.max(i.width, i.height) / 24) * 24,
            24,
        );

        copyAttrs(i, span);
        span.classList.add(`ri-${icon}-line`, `ri-${icon}`);
        span.style.fontSize = `${size}px`;
        span.classList.add("se-icon");
        span.classList.remove("se-hidden-icon");
    };

    new MutationObserver((ms) =>
        ms.forEach((m) => {
            if (m.target instanceof HTMLImageElement) {
                handleImage(m.target);
            } else if (m.addedNodes) {
                m.addedNodes.forEach((n) => {
                    if (n instanceof HTMLImageElement) {
                        handleImage(n);
                    } else if (n instanceof HTMLElement) {
                        n.querySelectorAll("img").forEach(handleImage);
                    }
                });
            }
        }),
    ).observe(document, {
        subtree: true,
        childList: true,
        attributeFilter: ["src"],
    });

    document.querySelectorAll("img").forEach(handleImage);
};

/**
 * Copies all attributes from one HTML element to another, excluding event attributes.
 */
const copyAttrs = (source: HTMLElement, target: HTMLElement): void => {
    for (const attr of Array.from(source.attributes)) {
        if (!attr.name.startsWith("on")) {
            try {
                target.setAttribute(attr.name, attr.value);
            } catch (error) {
                console.error(error);
            }
        }
    }
};

/**
 * Copies specified event listeners from one element to another.
 */
const copyEvents = (source: HTMLElement, target: HTMLElement): void => {
    for (const event of EVENTS) {
        target.addEventListener(event, (e: Event) => {
            source.dispatchEvent(new Event(e.type, e));
            e.stopPropagation();
        });
    }
};

/**
 * Replaces one HTML element with another while preserving attributes and child nodes.
 * @param {HTMLElement} el1 - The element to be replaced.
 * @param {HTMLElement} el2 - The element that will replace the first element.
 */
const replaceWithAttrs = (el1: HTMLElement, el2: HTMLElement): void => {
    for (const attr of Array.from(el1.attributes)) {
        try {
            el2.setAttribute(attr.name, attr.value);
        } catch (error) {
            console.error(error);
        }
    }

    el2.append(...Array.from(el1.children));
    el1.replaceWith(el2);
};

/**
 * Replaces Font Awesome icons in the document with their corresponding Remix Icons.
 */
const replaceFA = (): void => {
    document.querySelectorAll(".fa").forEach((i) => {
        i.classList.remove("fa", "fa-fw");

        i.classList.forEach((c) => {
            if (!c.startsWith("fa-")) return;

            const icon = FA_ICON_MAP[c.replace("fa-", "")];
            if (icon) {
                i.classList.remove(c);
                i.classList.add(`ri-${icon}-line`, "se-icon");
            }
        });
    });
};

/**
 * Replaces background images in elements with corresponding icons based on a mapping.
 */
const replaceBgImages = (): void => {
    Object.entries(BG_IMAGE_ICON_MAP).forEach(([selector, icon]) => {
        document.querySelectorAll(selector).forEach((i) => {
            if (icon === "") return i.classList.add("se-hidden-icon");

            const span = document.createElement("span");
            span.classList.add("se-icon");
            span.classList.add(`ri-${icon}-line`);

            i.classList.add("se-remove-icon");

            if (i.tagName === "img") replaceWithAttrs(i as HTMLElement, span);
            else i.insertBefore(span, i.firstChild);
        });
    });
};

/**
 * Replaces banners in the document with corresponding icons based on a mapping.
 */
const replaceBanners = (): void => {
    Object.entries(BANNER_ICON_MAP).forEach(([k, v]) => {
        document.querySelectorAll(`.${k}`).forEach((i) => {
            const span = document.createElement("span");
            span.innerHTML = i.innerHTML;

            const icon = document.createElement("span");
            icon.classList.add("se-icon", `ri-${v}-fill`);
            icon.style.fontSize = "1.5em";

            i.replaceChildren(icon, span);
        });
    });
};

/**
 * Initiates the icon replacement process for the document.
 */
export const replaceIcons = (): void => {
    addCSS();
    replaceImages();
    replaceFA();
    replaceBgImages();
    replaceBanners();
};

// TODO (toino): handle this mess of a page
// https://sigarra.up.pt/feup/pt/FEST_GERAL.INQ_RAIDES_EDIT
