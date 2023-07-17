import React, { useCallback } from "react";
import { ToggleSwitch } from "flowbite-react";
import { Option } from "~/common/options";
import Browser from "webextension-polyfill";

interface Props {
    option: Option<"boolean">;
    optionKey: string;
    value: boolean;
}

export default function ({ option, optionKey, value }: Props) {
    const onChange = useCallback(
        (value: boolean) =>
            void Browser.storage.local.set({ [optionKey]: value }),
        [optionKey],
    );

    return (
        <ToggleSwitch label={option.name} checked={value} onChange={onChange} />
    );
}
