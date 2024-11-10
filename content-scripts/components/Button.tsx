// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";

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

const Button: JSX.Component<ButtonProps> = () => {
    return <></>;
};

export default Button;
