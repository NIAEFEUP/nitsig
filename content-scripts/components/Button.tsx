// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";
import Icon from "./Icon";

type ButtonVariant = "solid" | "outline" | "link";
type ButtonColor = "primary";
type Radius = "full" | "lg" | "md" | "sm" | "none";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
    title?: string;
    icon?: string;
    variant?: ButtonVariant;
    color?: ButtonColor;
    radius?: Radius;
    size?: Size;
    id?: string;
    className?: string;
    onclick?: (e: Event) => void;
}

const Button: JSX.Component<ButtonProps> = ({
    title,
    icon,
    onclick,

    variant = "solid",
    color,
    radius = "md",
    size = "md",

    id,
    className,
}) => {
    let finalClassName = "se-button";
    if (variant) finalClassName += " " + variant;
    if (color) finalClassName += " " + color;
    if (radius) finalClassName += " rounded-" + radius;
    if (size) finalClassName += " " + size;
    if (className) finalClassName += " " + className;
    if (icon && !title) finalClassName += " icon-only";

    return (
        <button id={id ? id : ""} className={finalClassName} onclick={onclick}>
            {icon ? <Icon name={icon} /> : ""}
            {title ? <span>{title}</span> : ""}
        </button>
    );
};

export default Button;
