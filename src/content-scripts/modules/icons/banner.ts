import { keys } from "~/common/objects";
import { selectorModule } from "../base/selector";
import { BANNER_ICON_MAP } from "./constants";

export default selectorModule<HTMLElement, (keyof typeof BANNER_ICON_MAP)[]>(
    keys(BANNER_ICON_MAP),
    (i, selector) => {
        const v = BANNER_ICON_MAP[selector];

        const span = document.createElement("span");
        span.innerHTML = i.innerHTML;
        i.innerText = "";

        const icon = document.createElement("span");
        icon.classList.add("se-icon", `ri-${v}-line`);

        i.append(icon, span);
    },
);
