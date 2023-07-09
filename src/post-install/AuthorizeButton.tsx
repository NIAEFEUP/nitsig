import React, { useCallback } from "react";

const AuthorizeButton = () => {
    const onClick = useCallback(async () => {
        chrome.permissions.request({ origins: ["*://sigarra.up.pt/feup/*"] });
    }, []);

    return <button onClick={onClick}>Autorizar</button>;
};

export default AuthorizeButton;
