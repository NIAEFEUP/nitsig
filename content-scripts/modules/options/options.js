import addStyles from "./addStyles";
import removeElement from "../utilities/removeElement";

export const hideShortcuts = async (shortcuts) => {
    switch (shortcuts) {
        case "on":
            addStyles(
                "se-hide-shortcuts",
                `
          #caixa-atalhos{
            display: none
          }
        `,
            );
            break;

        case "off":
            removeElement("#se-hide-shortcuts");
            break;
    }
};

export const changeFont = async (font) => {
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

export const useNavBar = async (navbar) => {
    switch (navbar) {
        case "on":
            addStyles(
                "se-use-navbar",
                `
                #colunaprincipal, #rodape,  #ferramentas{
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
