
/**
 * @this {Element}
 * @param {MouseEvent} ev 
 */
function toggleExpandableCard(ev) {
    /** @type {Keyframe[]} */
    if (this.dataset.expanded == "false") {
        this.dataset.expanded = "true";
        this.animate(
            [{ transform: "rotate(0)" }, { transform: "rotate(180deg)" }], 
            { duration: 300, fill: "forwards", easing:"ease-in"}
        )        
        
    } else {
        this.dataset.expanded = "false";
        this.animate(
            [{ transform: "rotate(180deg)" }, { transform: "rotate(0)" }], 
            { duration: 300, fill: "forwards", easing:"ease-in"}
        )

    }
};


/**
 * 
 * @param {string[]} content 
 */
export const makeSigarraExpandableCard = (content) => {
    const elements = document.querySelectorAll(".se-expandable-card");
    elements.forEach((element) => {
        const collapesedCard = document.createElement("div")
        collapesedCard.classList.add("se-card-header");
        const div = document.createElement("div");
        div.classList.add("se-card-content");
        const contentElements = content.map((value) => Array.from(element.querySelectorAll(value)))
            .flat();
        div.prepend(...contentElements);
        const button = document.createElement("button");
        button.dataset.expanded = false;
        button.classList.add("se-card-expand-button");
        button.addEventListener("click", toggleExpandableCard)
        const icon = document.createElement("i");
        icon.classList.add("ri-arrow-down-s-line", "ri-2x");
        button.append(icon);
        collapesedCard.append(div, button);
        element.prepend(collapesedCard);


    });
};