import addStyles from "./addStyle";
import removeElement from "../utilities/removeElement";

export const hideShortcuts = async (): Promise<void> => {
    // yummy comi os atalhos
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
