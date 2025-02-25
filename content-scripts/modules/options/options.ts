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
                document.getElementsByTagName("html")[0].style.display =
                    "block";
                resolve();
            });
        }
    });

    const expandableCards = document.querySelectorAll<HTMLElement>(
        ".se-expandable-card",
    );

    expandableCards.forEach((card) => {
        const content = card.querySelector<HTMLElement>(
            ".se-expandable-card-wrapper",
        );
        const header = card.querySelector<HTMLButtonElement>(".se-card-header");
        const arrowIcon = header?.querySelector<HTMLElement>("i");

        if (!content || !header || !arrowIcon) return;

        if (
            (expand === "on" && header.dataset.expanded === "true") ||
            (expand === "off" && header.dataset.expanded === "false")
        ) {
            return;
        }

        switch (expand) {
            case "on":
                content.style.transition = "none";
                content.style.maxHeight = "9999px";
                header.dataset.expanded = "true";
                arrowIcon.animate(
                    [
                        { transform: "rotate(0deg)" },
                        { transform: "rotate(180deg)" },
                    ],
                    { duration: 300, fill: "forwards", easing: "ease-in-out" },
                );
                break;

            case "off":
                content.style.transition = "none";
                content.style.maxHeight = "0px";
                header.dataset.expanded = "false";
                arrowIcon.animate(
                    [
                        { transform: "rotate(180deg)" },
                        { transform: "rotate(0deg)" },
                    ],
                    { duration: 300, fill: "forwards", easing: "ease-in-out" },
                );
                break;
        }

        void content.offsetHeight;
        content.style.transition = "max-height 0.3s";
    });
};
