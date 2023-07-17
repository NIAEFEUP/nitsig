import React, { useCallback, useEffect, useState } from "react";
import options, { OptionValues, getOptions } from "~/common/options";
import { entries, keys } from "~/common/objects";
import Option from "./Option";
import Browser from "webextension-polyfill";

export default function () {
    const [optionValues, setOptionValues] = useState<OptionValues | null>(null);

    const onChanged = useCallback(
        (changes: Browser.Storage.StorageAreaOnChangedChangesType) => {
            const newOptionValues = structuredClone(optionValues);

            if (newOptionValues === null) return;

            keys(newOptionValues).forEach((key) => {
                const newValue = changes[key]
                    ?.newValue as OptionValues[typeof key];

                if (newValue !== undefined && newValue !== null)
                    newOptionValues[key] = newValue;
            });

            setOptionValues(newOptionValues);
        },
        [optionValues, setOptionValues],
    );

    useEffect(() => {
        getOptions().then(setOptionValues).catch(console.error);
        Browser.storage.local.onChanged.addListener(onChanged);

        return () => {
            Browser.storage.local.onChanged.removeListener(onChanged);
        };
    }, [onChanged]);

    if (optionValues === null) return <span>Loading</span>;

    return (
        <ul className="flex flex-col gap-3 p-4">
            {entries(options).map(([key, option]) => (
                <li key={key}>
                    <Option
                        optionKey={key}
                        option={option}
                        value={optionValues[key]}
                    />
                </li>
            ))}
        </ul>
    );
}
