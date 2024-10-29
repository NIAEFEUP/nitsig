// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";
import Icon from "./Icon";

type ButtonVariant = "solid" | "outline";
type ButtonColor = "primary";
type Radius = "full" | "sm" | "md" | "lg";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
    title?: string;
    icon?: string;
    id?: string;
    variant?: ButtonVariant;
    color?: ButtonColor;
    radius?: Radius;
    size?: Size;
    className?: string;
    onclick?: (e: Event) => void;
}

const Button: JSX.Component<ButtonProps> = ({
    title,
    icon,
    id,
    variant,
    color,
    radius,
    size,
    className,
    onclick,
}) => {
    let finalClassName = "se-button";
    if (variant) finalClassName += " " + variant;
    if (color) finalClassName += " " + color;
    if (radius) finalClassName += " rounded-" + radius;
    if (size) finalClassName += " " + size;
    if (className) finalClassName += " " + className;

    return (
        <button id={id ? id : ""} className={finalClassName} onclick={onclick}>
            {icon ? <Icon name={icon} /> : ""}
            {title ? <span>{title}</span> : ""}
        </button>
    );
};

export default Button;
