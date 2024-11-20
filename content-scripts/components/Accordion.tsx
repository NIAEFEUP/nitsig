// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";

interface AccordionProps {
    id: string;
    title: string;
    data: (string | JSX.Element)[];
    max_size: number;
}

export const Accordion = ({
    id,
    title,
    data,
    max_size,
}: AccordionProps): JSX.Element => {
    const toggleAccordion = (event: MouseEvent) => {
        const button: HTMLElement = event.currentTarget as HTMLElement;
        const icon: HTMLElement = button.querySelector("i") as HTMLElement;
        const innerContent = document.getElementById(`${id}-content`);

        if (!innerContent) {
            console.log("Error: Content element not found.");
            return;
        }

        const isExpanded = button.getAttribute("data-expanded") === "true";

        if (!isExpanded) {
            button.setAttribute("data-expanded", "true");

            icon.animate(
                [{ transform: "rotate(0)" }, { transform: "rotate(180deg)" }],
                { duration: 300, fill: "forwards", easing: "ease-in" },
            );

            innerContent.style.maxHeight = `${max_size}px`;
        } else {
            button.setAttribute("data-expanded", "false");

            icon.animate(
                [{ transform: "rotate(180deg)" }, { transform: "rotate(0)" }],
                { duration: 300, fill: "forwards", easing: "ease-in" },
            );

            innerContent.style.maxHeight = `0px`;
        }
    };

    return (
        <div className="se-expandable-card" id={id}>
            <button
                className="se-card-expand-button se-card-header"
                data-expanded="false"
                onclick={toggleAccordion}
            >
                <div className="se-card-content">
                    <h3>{title}</h3>
                </div>
                <i className="ri-arrow-down-s-line ri-2x"></i>
            </button>

            <div
                className="se-expandable-card-wrapper"
                id={`${id}-content`}
                style={{
                    maxHeight: "0px",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                }}
            >
                {data}
            </div>
        </div>
    );
};
