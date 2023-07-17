import React, { useCallback } from "react";
import Browser from "webextension-polyfill";
import { Button } from "flowbite-react";

export default function () {
    const onClick = useCallback(
        () =>
            void Browser.permissions.request({
                origins: ["*://sigarra.up.pt/feup/*"],
            }),
        [],
    );

    return <Button onClick={onClick}>Autorizar</Button>;
}
