import React, { useCallback, useEffect, useState } from "react";
import Browser from "webextension-polyfill";
import Loading from "./Loading";
import Authorized from "./Authorized";
import Authorize from "./Authorize";

export default function () {
    const [authorized, setAuthorized] = useState<boolean | null>(null);

    const onAdded = useCallback(() => setAuthorized(true), []);
    const onRemoved = useCallback(() => setAuthorized(false), []);

    useEffect(() => {
        Browser.permissions
            .contains({
                origins: ["*://sigarra.up.pt/feup/*"],
            })
            .then(setAuthorized)
            .catch(console.error);
        Browser.permissions.onAdded.addListener(onAdded);
        Browser.permissions.onRemoved.addListener(onRemoved);

        return () => {
            Browser.permissions.onAdded.removeListener(onAdded);
            Browser.permissions.onRemoved.removeListener(onRemoved);
        };
    }, [onAdded, onRemoved]);

    return authorized === null ? (
        <Loading />
    ) : authorized ? (
        <Authorized />
    ) : (
        <Authorize />
    );
}
