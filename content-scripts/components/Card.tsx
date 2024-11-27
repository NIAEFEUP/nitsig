import jsx from "texsaur";
import Button from "./Button";


interface CardProps{
    title: string;
    description?: string;
    imgSrc?: string;
    subtitles?: string[];
    button: Button;
    id?: string;
    className?: string;
}


const Card: JSX.Component<CardProps> = ({title, description, imgSrc, subtitles, button, id, className}) =>{
    let finalClassName = "se-card";
    if(description && imgSrc && subtitles){finalClassName += " default"}
    if(imgSrc && !subtitles && description){finalClassName += " imgdesconly"}
    if(!imgSrc && subtitles && description){finalClassName += " subdesconly"}
    if(imgSrc && subtitles && !description){finalClassName += " imgsubonly"}
    if(imgSrc && !subtitles && !description){finalClassName += " imgonly"}
    if(!imgSrc && !subtitles && description){finalClassName += " desconly"}
    if(!imgSrc && !subtitles && !description){finalClassName += " titlebutton"}

    return(<div class="se-card default" id="card-id">
        <img src="" alt="Card Image" class="se-card__image" />
        <h2 class="se-card__title">Card Title</h2>
        <ul class="se-card__subtitles">
          <li>Subtitle 1</li>
          <li>Subtitle 2</li>
          <li>Subtitle 3</li>
        </ul>
        <p class="se-card__description">
          description
        </p>
        <button class="se-card__button">
          read more
        </button>
      </div>) 
};


export default Card;