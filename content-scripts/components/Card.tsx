import jsx from "texsaur";
interface CardProps {
    id: string;
    title?: string;
    description?: string;
    imgSrc?: string;
    subtitles?: string[];
    button?: Element;
}

const Card: JSX.Component<CardProps> = ({id, title, description, imgSrc, subtitles, button }) => {
    let finalClassName = "se-card";
    return (
        <div className = {finalClassName} id ={id}>
            <div className = "container">
            {title || description || imgSrc || subtitles ? 
                <div className = "details">
                    {imgSrc ?
                    <img className = "img" src ={imgSrc}>
                    </img> : " "
                    }
                    {title ? 
                    <h2 className = "title">
                        {title}
                    </h2> : " "
                    }
                    {(subtitles && subtitles.length > 0) ? 
                    subtitles.map(subtitle => {return <div className = "subtitles">{subtitle}</div>})
                    : " "}
                    {description ?
                    <p className = "description">
                        {description}
                    </p> : ""
                    }
                    </div>
                : " " 
            }
            {button ? button : " "}
            </div>

        </div>
        
    )
};

export default Card;