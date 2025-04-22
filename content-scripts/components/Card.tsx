// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";
interface CardProps {
    id: string;
    className: string;
    title?: Element | string;
    description?: Element | string;
    imgSrc?: string;
    subtitles?: (Element | string)[];
    button?: Element;
}

const Card: JSX.Component<CardProps> = ({
    id,
    className,
    title,
    description,
    imgSrc,
    subtitles,
    button,
}) => {
    return (
        <a className={className} id={id}>
                {title && description && imgSrc && subtitles && button ? (
                    <div className="details">
                        {imgSrc ? (
                            <img className="img" src={imgSrc}></img>
                        ) : (
                            " "
                        )}
                        {title ? <div className="title">{title}</div> : " "}
                        {subtitles && subtitles.length > 0
                            ? subtitles.map((subtitle) => {
                                  return (
                                      <div className="subtitles">
                                          {subtitle}
                                      </div>
                                  );
                              })
                            : " "}
                        {description ? (
                            <div className="description">{description}</div>
                        ) : (
                            ""
                        )}
                        {button ? button : " "}
                    </div>
                ) : (
                    <div className="detailsalt">
                        {imgSrc ? (
                            <img className="img" src={imgSrc}></img>
                        ) : (
                            " "
                        )}
                        <div className="other">
                            <div className="textbox">
                                {title ? (
                                    <div className="title">{title}</div>
                                ) : (
                                    " "
                                )}
                                {description ? (
                                    <div className="description">{description}</div>
                                ) : (
                                    " "
                                )}
                            </div>
                            <div className="buttonbox">
                                {button ? button : " "}
                            </div>
                        </div>
                    </div>
                )}
        </a>
    );
};

export default Card;
