import { removeElement } from "~/common/elements";
import type { Option } from "..";
import Browser from "webextension-polyfill";

export const toggleStyleOption = (url: string): Option<"boolean"> => {
    const extUrl = Browser.runtime.getURL(url);

    return (value) => {
        if (value) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = extUrl;
            document.head.appendChild(link);
        } else {
            removeElement(`link[href="${extUrl}"]`);
        }
    };
};
