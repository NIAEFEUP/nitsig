import React from "react";
import AuthorizeButton from "./AuthorizeButton";

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
            <AuthorizeButton />
        </div>
    );
};

export default Authorize;
