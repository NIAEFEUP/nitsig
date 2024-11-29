import { makeSigarraExpandableCard } from "../modules/expandable-card";
import {
    groupSectionTitleAndContent,
    makeTextNodesElements,
    // removeTwoColumnTable,
} from "../modules/utilities/pageUtils";

export const courseUnitPage = () => {
    // TODO: remove this check
    if (
        !document.location.href
            .toLowerCase()
            .includes("ucurr_geral.ficha_uc_view")
    ) {
        return;
    }
    makeTextNodesElements("#conteudoinner");
    groupSectionTitleAndContent("#conteudoinner", [
        "se-card",
        "se-expandable-card",
    ]);
    makeSigarraExpandableCard([".se-group-title"]);
    //TODO (luisd): make removeTwoColumnTable return an element and maybe add an class/id
    //in order to order it later
    //removeTwoColumnTable("table.formulario:nth-child(8)");
};
