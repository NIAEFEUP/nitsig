import { groupSectionTitleAndContent, makeTextNodesElements } from "../modules/utilities/pageUtils";

export const courseUnitPage = () => {
    if (!document.location.href.toLowerCase().includes("ucurr_geral.ficha_uc_view")) {
        return;
    }
    makeTextNodesElements("#conteudoinner")
    groupSectionTitleAndContent("#conteudoinner")
};