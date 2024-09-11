/**
 * @this {Element}
 * @param {Element} innerContent
 * @param {Number} max_size
 */
const toggleExpandableCard = (innerContent, max_size) => {
    function clickEvent() {
        /** @type {Keyframe[]} */
        if (this.dataset.expanded == "false") {
            this.dataset.expanded = "true";
            this.animate(
                [{ transform: "rotate(0)" }, { transform: "rotate(180deg)" }],
                { duration: 300, fill: "forwards", easing: "ease-in" },
            );
            innerContent.style.maxHeight = `${max_size}px`;
        } else {
            this.dataset.expanded = "false";
            this.animate(
                [{ transform: "rotate(180deg)" }, { transform: "rotate(0)" }],
                { duration: 300, fill: "forwards", easing: "ease-in" },
            );
            innerContent.style.maxHeight = `0px`;
        }
    }
    return clickEvent;
};

/**
 *
 * @param {string[]} content
 */
export const makeSigarraExpandableCard = (content) => {
    const elements = document.querySelectorAll(".se-expandable-card");
    elements.forEach((element) => {
        const collapesedCard = document.createElement("div");
        collapesedCard.classList.add("se-card-header");
        const div = document.createElement("div");
        div.classList.add("se-card-content");
        const contentElements = content
            .map((value) => Array.from(element.querySelectorAll(value)))
            .flat();
        div.prepend(...contentElements);
        const button = document.createElement("button");
        button.dataset.expanded = false;
        button.classList.add("se-card-expand-button");
        const icon = document.createElement("i");
        icon.classList.add("ri-arrow-down-s-line", "ri-2x");
        button.append(icon);
        collapesedCard.append(div, button);
        element.prepend(collapesedCard);

        const innerContent = Array.from(element.children);
        innerContent.shift();
        const innerContentDiv = document.createElement("div");
        innerContentDiv.append(...innerContent);
        innerContentDiv.classList.add("se-expandable-card-wrapper");

        element.append(innerContentDiv);

        let func = toggleExpandableCard(
            innerContentDiv,
            innerContentDiv.offsetHeight,
        );
        button.addEventListener("click", func);

        element.addEventListener("resize", () => {
            button.removeEventListener("click", func);
            const previousMaxHeight = innerContent.style.maxHeight;
            innerContent.style.maxHeight = "100%";
            func = toggleExpandableCard(
                innerContentDiv,
                innerContentDiv.offsetHeight,
            );
            innerContent.style.maxHeight = previousMaxHeight;
            button.addEventListener("click", func);
        });

        innerContentDiv.style.maxHeight = `0px`;
    });
};
