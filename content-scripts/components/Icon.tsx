import jsx from "texsaur";

interface IconProps {
    name?: string;
}

const Icon: JSX.Component<IconProps> = ({ name }) => {
    return (
        <span className={"se-icon " + name}></span>
    );
}

export default Icon;