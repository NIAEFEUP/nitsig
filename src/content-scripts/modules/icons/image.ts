import { copyAttributes, proxyEvents } from "~/common/elements";
import { selectorModule } from "../base/selector";
import { IMG_ICON_MAP } from "./constants";

export default selectorModule<HTMLImageElement>("img", (i) => {
    const icon = (IMG_ICON_MAP as Record<string, string | undefined>)[
        i.src.substring(i.src.lastIndexOf("/") + 1)
    ];

    let span: HTMLSpanElement | null = null;

    if (i.nextElementSibling?.matches("span.se-icon"))
        span = i.nextElementSibling as HTMLSpanElement;

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
        proxyEvents(i, span);
    }

    const size = Math.max(
        Math.round(Math.max(i.width, i.height) / 24) * 24,
        24,
    );

    copyAttributes(i, span);
    span.classList.add(`ri-${icon}-line`);
    span.style.fontSize = `${size}px`;
    span.classList.add("se-icon");
    span.classList.remove("se-hidden-icon");
});
