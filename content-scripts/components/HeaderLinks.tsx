// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";

interface Props {
    links: Record<string, Record<string, string>>;
}

const HeaderLinks = ({ links }: Props) => {
    return (
        <nav id="se-header-links">
            {Object.entries(links).map(([key, value]) => (
                <div className="se-header-link" key={key}>
                    <button>{key}</button>
                    <div className="se-header-link-popover">
                        {Object.entries(value).map(([label, url]) => (
                            <a href={url} key={label}>
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    );
};

export default HeaderLinks;
