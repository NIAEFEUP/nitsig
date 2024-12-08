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
    const expandableCards = document.querySelectorAll<HTMLElement>(".se-expandable-card-wrapper");

    switch (expand) {
        case "on":
            expandableCards.forEach((card) => {
                card.style.maxHeight = `${card.scrollHeight}px`;
            });
            break;

        case "off":
            expandableCards.forEach((card) => {
                card.style.maxHeight = "0px";
            });
            break;
    }
};