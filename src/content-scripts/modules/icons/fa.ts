import { selectorModule } from "../base/selector";
import { FA_ICON_MAP } from "./constants";

export default selectorModule<HTMLElement>(".fa", (i) => {
    i.classList.remove("fa", "fa-fw");

    i.classList.forEach((c) => {
        if (!c.startsWith("fa-")) return;

        const icon = (FA_ICON_MAP as Record<string, string | undefined>)[
            c.replace("fa-", "")
        ];
        if (icon) {
            i.classList.remove(c);
            i.classList.add(`ri-${icon}-line`, "se-icon");
        }
    });
});
