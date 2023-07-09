import React, { useEffect, useState } from "react";
import renderRoot from "../common/renderRoot";
import Loading from "./Loading";
import Authorized from "./Authorized";
import Authorize from "./Authorize";

const PostInstall = () => {
    const [authorized, setAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        chrome.permissions.contains(
            {
                origins: ["*://sigarra.up.pt/feup/*"],
            },
            setAuthorized,
        );
        chrome.permissions.onAdded.addListener(() => setAuthorized(true));
    }, []);

    return authorized === null ? (
        <Loading />
    ) : authorized ? (
        <Authorized />
    ) : (
        <Authorize />
    );
};

renderRoot(PostInstall);
