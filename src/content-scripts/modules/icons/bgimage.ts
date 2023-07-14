import { keys } from "~/common/objects";
import { selectorModule } from "../base/selector";
import { BG_IMAGE_ICON_MAP } from "./constants";
import { copyAttributes, proxyEvents } from "~/common/elements";

export default selectorModule<HTMLElement, (keyof typeof BG_IMAGE_ICON_MAP)[]>(
    keys(BG_IMAGE_ICON_MAP),
    (i, selector) => {
        const icon = BG_IMAGE_ICON_MAP[selector];

        if ((icon as string | undefined) === "")
            return i.classList.add("se-hidden-icon");

        const span =
            i.querySelector<HTMLSpanElement>(".se-icon") ??
            document.createElement("span");
        span.classList.add("se-icon");
        span.classList.add(`ri-${icon}-line`);

        i.classList.add("se-remove-icon");

        if (i.tagName == "img") {
            i.classList.add("se-hidden-icon");
            proxyEvents(i, span);
            copyAttributes(i, span);
        }
        i.insertBefore(span, i.firstChild);
    },
);
