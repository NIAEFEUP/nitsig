import jsx from "texsaur";
import Icon from "./Icon";

interface ButtonProps {
    title?: string;
    icon?: string;
    id?: string;
    className?: string;
    onclick?: (e: Event) => void;
}

const Button: JSX.Component<ButtonProps> = ({ title, icon, id, className, onclick }) => {
    return (
        <button id={id ? id : ""} className={className ? className : ""} onclick={onclick}>
            {icon ? <Icon name={icon} /> : ""}
            {title ? <span>{title}</span> : ""}
        </button>
    );
}

export default Button;