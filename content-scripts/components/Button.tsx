import jsx from "texsaur";

interface ButtonProps {
    title?: string;
    icon?: string;
    id?: string;
    className?: string;
    onClick?: (e: Event) => void;
}

const Button: JSX.Component<ButtonProps> = ({ title, icon, id, className, onClick }) => {
    return (
        <button id={id} className={className} onClick={onClick}>
            <span className={"se-icon " + icon}></span>
            {title}
        </button>
    );
}

export default Button;