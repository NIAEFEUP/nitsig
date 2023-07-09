import addStyles from "../utilities/addStyles";
import removeElement from "../utilities/removeElement";

export default (value: boolean) => {
    if (value) {
        addStyles(
            "se-hide-shortcuts",
            `#caixa-atalhos { display: none !important; }`,
        );
    } else {
        removeElement("se-hide-shortcuts");
    }
};
