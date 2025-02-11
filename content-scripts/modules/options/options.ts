import addStyles from "./addStyle";
import removeElement from "../utilities/removeElement";

// TODO(thePeras & toni): These functions can be extracted singles files
export const hideShortcuts = async (shortcuts: string): Promise<void> => {
    switch (shortcuts) {
        case "on":
            addStyles(
                "se-hide-shortcuts",
                `
                #caixa-atalhos {
                    display: none;
                }
                `,
            );
            break;

        case "off":
            removeElement("#se-hide-shortcuts");
            break;
    }
};

export const changeFont = async (font: string): Promise<void> => {
    switch (font) {
        case "on":
            addStyles(
                "se-change-font",
                `
                * {
                    font-family: Roboto, sans-serif;
                }
                `,
            );
            break;

        case "off":
            removeElement("#se-change-font");
            break;
    }
};

export const useNavBar = async (navbar: string): Promise<void> => {
    switch (navbar) {
        case "on":
            addStyles(
                "se-use-navbar",
                `
                #colunaprincipal, #rodape, #ferramentas {
                    display: none !important;
                }
                `,
            );
            removeElement("#se-dont-use-navbar");
            break;
        case "off":
            addStyles(
                "se-dont-use-navbar",
                `
                #se-header-links {
                    display: none !important;
                }
                #colunaextra #caixa-campus {
                    display: none !important;
                }
                `,
            );
            removeElement("#se-use-navbar");
            break;
    }
};

export const expandSections = async (expand: string): Promise<void> => {
    
    await new Promise<void>((resolve) => {
        if (document.readyState === "complete") {
            document.getElementsByTagName("html")[0].style.display = "block";
            resolve();
        } else {
            window.addEventListener("load", () => {
                document.getElementsByTagName("html")[0].style.display = "block";
                resolve();
            });
        }
    });

    const expandableCards = document.querySelectorAll<HTMLElement>(".se-expandable-card");

    expandableCards.forEach((card) => {
        const content = card.querySelector<HTMLElement>(".se-expandable-card-wrapper");
        const header = card.querySelector<HTMLElement>(".se-card-header");

        if (!content || !header) return;

        const button = header.querySelector<HTMLButtonElement>(".se-card-expand-button");

        if (!button) return;

        content.style.transition = "none";

        switch (expand) {
            case "on":
                content.style.maxHeight = "9999px";
                button.dataset.expanded = "true";
                button.animate(
                    [{ transform: "rotate(0deg)" }, { transform: "rotate(180deg)" }],
                    { duration: 300, fill: "forwards", easing: "ease-in-out" }
                );
                break;

            case "off":
                content.style.maxHeight = "0px";
                button.dataset.expanded = "false";
                button.animate(
                    [{ transform: "rotate(180deg)" }, { transform: "rotate(0deg)" }],
                    { duration: 300, fill: "forwards", easing: "ease-in-out" }
                );
                break;
        }
    });
};