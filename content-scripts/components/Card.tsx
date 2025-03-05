import jsx from "texsaur";
interface CardProps {
    id: string;
    title?: string;
    description?: string;
    imgSrc?: string;
    subtitles?: string[];
    button?: Element;
}

const Card: JSX.Component<CardProps> = ({
    id,
    title,
    description,
    imgSrc,
    subtitles,
    button,
}) => {
    let finalClassName = "se-card";
    return (
        <div className={finalClassName} id={id}>
            <div className="container">
                {title && description && imgSrc && subtitles && button ? (
                    <div className="details">
                        {imgSrc ? (
                            <img className="img" src={imgSrc}></img>
                        ) : (
                            " "
                        )}
                        {title ? <h2 className="title">{title}</h2> : " "}
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
                            <p className="description">{description}</p>
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
                                    <h2 className="title">{title}</h2>
                                ) : (
                                    " "
                                )}
                                {description ? (
                                    <p className="description">{description}</p>
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
            </div>
        </div>
    );
};

export default Card;
