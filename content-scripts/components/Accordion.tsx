import jsx from "texsaur"
import Icon from "./Icon";
import {useRef, useState} from "react";

interface AccordionProps {
    title?: string;
    icon?: string;
    id?: string;
    className?: string;
    data: (string | Element)[]; //Items to be shown when expanded
}

const Accordion: JSX.Component<AccordionProps> = ({ title, icon, id, className, data }) => {

    const contentHeight = useRef(null);

    //to manage the state of the accordion (expanded or collapsed)
    const [isOpen, setOpen] = useState(false);

    const toggleAccordion = () => {
        setOpen(!isOpen);
    }

    return (
        <div className={`se-accordion ${className ? className : ""}`} id={id ? id : ""}>
            <button className={"se-accordion-header"} onClick={toggleAccordion}>
                {icon ? <Icon name={icon} /> : ""}
                {title ? <span>{title}</span> : ""}
            </button>

            <div ref={contentHeight} className="se-accordion-body" style={
                isOpen ? {height: `${contentHeight.current.scrollHeight}px`} : {height: "0px"}}>

                {isOpen && data.map((item, index) => (
                    <div key={index}> {item} </div>
                ))}
            </div>
        </div>
    )
}

export default Accordion;