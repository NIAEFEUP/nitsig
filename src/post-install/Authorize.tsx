import React from "react";

const Authorize = () => {
    return (
        <div className="authorize">
            <div className="authorize__icon" />
            <div className="authorize__text">
                <h1>Autorizar extensão</h1>
                <p>
                    Para poderes usar a extensão, precisas de autorizar o acesso
                    da extensão à página da secretaria virtual da FEUP.
                </p>
            </div>
            <button className="authorize__button">Autorizar</button>
        </div>
    );
}

export default Authorize;
