import jsx from "texsaur";
import Button from "./Button";

interface CardProps {
    title: string;
    description?: string;
    imgSrc?: string;
    subtitles?: string[];
    button: string;
}

const Card: JSX.Component<CardProps> = ({ title, description, imgSrc, subtitles, button }) => {
    let finalClassName = "se_card";

    if (imgSrc && !subtitles && !description) {
        finalClassName += " imgonly";
        return(<div className={finalClassName} id="container">
          {imgSrc && <img src={imgSrc} alt = "Card Image" />}
          <div className="card__details">
            <h2 className= "title">{title}</h2>
          </div>
          {button && (
                  <Button color= "primary" size="lg" title= {button}>
                  </Button>
              )}
        </div>);
    } else if (!imgSrc && !subtitles && !description) {
        finalClassName += " titlebutton";
        return (<div className={finalClassName} id="container">
          <div className="card_details">
            <h2 className="title">{title}</h2>
          </div>
          {button && (
                  <Button color= "primary" size="lg" title= {button}>
                  </Button>
              )}
        </div>);
    } else {
        finalClassName += " default";
        return (
          <div className={finalClassName} id="container">
              {imgSrc && <img src={imgSrc} alt="Card Image" />}
              <div className="card__details">
                  <h2 className="title">{title}</h2>
                  {subtitles && subtitles.length > 0 && (
                      <div className="subtitles">
                        {subtitles[0]}
                      </div>
                  )}
                  {description && <p>{description}</p>}
              </div>
              {button && (
                  <Button color= "primary" size="lg" title= {button}>
                  </Button>
              )}
          </div>
      );
    }
};

export default Card;