import {
    BANNER_ICON_MAP,
    BG_IMAGE_ICON_MAP,
    FA_ICON_MAP,
    IMG_ICON_MAP,
} from "./constants";

const addCSS = () => {
    if (!document.querySelector('link[href$="remixicon.css"]'))
        document.head.innerHTML +=
            '<link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">';
};

const replaceImages = () => {
    /** @type {(i: HTMLImageElement) => any} */
    const handleImage = (i) => {
        const icon = IMG_ICON_MAP[i.src.substring(i.src.lastIndexOf("/") + 1)];

        if (icon === undefined)
            return i.classList.remove("se-icon", "se-hidden-icon");

        if (icon === "") {
            i.classList.add("se-hidden-icon");
            i.classList.remove("se-icon");
            return;
        }

        i.classList.remove("se-hidden-icon");
        i.classList.add("se-icon");

        const span = document.createElement("span");
        replaceWithKeepAttrs(i, span);

        size = Math.max(Math.round(Math.max(i.width, i.height) / 24) * 24, 24);

        span.classList.add(`ri-${icon}-line`);
        span.style.fontSize = `${size}px`;
    };

    new MutationObserver((ms) =>
        ms.forEach((m) => {
            if (m.type == "attributes") handleImage(m.target);
            else m.target.querySelectorAll("img").forEach(handleImage);
        })
    ).observe(document, {
        subtree: true,
        childList: true,
        attributeFilter: ["src"],
    });

    document.querySelectorAll("img").forEach(handleImage);
};

/**
 * @param {HTMLElement} el1
 * @param {HTMLElement} el2
 */
const replaceWithKeepAttrs = (el1, el2) => {
    for (const attr of el1.attributes)
        try {
            el2.setAttribute(attr.name, attr.value);
        } catch (error) {
            console.error(error);
        }

    el2.append(...el1.children);

    console.debug(el2);
    el1.replaceWith(el2);
};

const replaceFA = () => {
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

const replaceBgImages = () => {
    Object.entries(BG_IMAGE_ICON_MAP).forEach(([selector, icon]) => {
        document.querySelectorAll(selector).forEach((i) => {
            if (icon === "") return i.classList.add("se-hidden-icon");

            const span = document.createElement("span");
            span.classList.add("se-icon");
            span.classList.add(`ri-${icon}-line`);

            i.classList.add("se-remove-icon");

            if (i.tagName == "img")
                replaceWithKeepAttrs(i, span);
            else
                i.insertBefore(span, i.firstChild);
        });
    });
};

const replaceBanners = () => {
    Object.entries(BANNER_ICON_MAP).forEach(([k, v]) => {
        document.querySelectorAll(`.${k}`).forEach((i) => {
            const span = document.createElement("span");
            span.innerHTML = i.innerHTML;
            i.innerText = "";

            const icon = document.createElement("span");
            icon.classList.add("se-icon", `ri-${v}-line`);

            i.append(icon, span);
        });
    });
};

// TODO (toino): handle this mess of a page
// https://sigarra.up.pt/feup/pt/FEST_GERAL.INQ_RAIDES_EDIT

export const replaceIcons = () => {
    addCSS();
    replaceImages();
    replaceFA();
    replaceBgImages();
    replaceBanners();
};
