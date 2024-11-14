import jsx from "texsaur";

interface AccordionProps {
    id: string;
    title: string;
    data: (string | JSX.Element)[];
    max_size: number;
}

export const Accordion = ({ id, title, data, max_size }: AccordionProps): JSX.Element => {
    const toggleAccordion = (event: MouseEvent) => {
        const button = event.currentTarget as HTMLElement;
        const innerContent = document.getElementById(`${id}-content`);

        if (!innerContent) {
            console.log("Error: Content element not found.");
            return;
        }

        const isExpanded = button.getAttribute("data-expanded") === "true";

        if (!isExpanded) {
            button.setAttribute("data-expanded", "true");

            button.animate(
                [{ transform: "rotate(0)" }, { transform: "rotate(180deg)" }],
                { duration: 300, fill: "forwards", easing: "ease-in" }
            );

            innerContent.style.maxHeight = `${max_size}px`;
        } else {
            button.setAttribute("data-expanded", "false");

            button.animate(
                [{ transform: "rotate(180deg)" }, { transform: "rotate(0)" }],
                { duration: 300, fill: "forwards", easing: "ease-in" }
            );

            innerContent.style.maxHeight = `0px`;
        }
    };

    //This `setTimeout` function is used to delay attaching the event listener until after the component has rendered.
    // Using onClick handler directly in JSX wasn't working, not sure why, maybe rendering issues in React(??)
    setTimeout(() => {
        const button = document.querySelector(`#${id} .se-card-expand-button`) as HTMLElement;
        if (button) {
            button.addEventListener("click", toggleAccordion as EventListener);
            console.log("Event listener attached.");
        } else {
            console.log("Button element not found.");
        }
    }, 0);

    return (
        <div className="se-expandable-card" id={id}>
            <div className="se-card-header">
                <div className="se-card-content">
                    <h3>{title}</h3>
                </div>

                <button className="se-card-expand-button" data-expanded="false">
                    <i className="ri-arrow-down-s-line ri-2x"></i>
                </button>
            </div>

            <div className="se-expandable-card-wrapper" id={`${id}-content`} style={{ maxHeight: "0px", overflow: "hidden", transition: "max-height 0.3s ease" }}>
                {data}
            </div>
        </div>
    );
};
