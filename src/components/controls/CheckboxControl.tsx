import React, { useEffect, useState } from "react";
import Browser from "webextension-polyfill";
// import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
// import { CheckIcon } from "@radix-ui/react-icons";
// import { styled } from "@stitches/react";

interface Props {
    label: string;
    storageKey: string;
    defaultState?: boolean;
}

function CheckboxControl({ label, storageKey, defaultState = false }: Props) {
    const [localState, setLocalState] = useState(defaultState);

    useEffect(() => {
        const getDefaultState = async () => {
            try {
                const userSetting = (
                    await Browser.storage.local.get(storageKey)
                )[storageKey];
                userSetting &&
                    setLocalState(userSetting === "on" ? true : false);
            } catch (error) {
                console.warn(error);
            }
        };

        getDefaultState();
    }, [storageKey]);

    return (
        <>
            <div className="flex w-full items-center justify-between py-1">
                <label
                    htmlFor={storageKey}
                    className="text-base tracking-normal">
                    {label}
                </label>
                <div className="hover:bg-accentFour grid h-9 w-9 cursor-pointer place-items-center rounded-full">
                    {/* <StyledCheckbox
                        onCheckedChange={async (checked) => {
                            setLocalState(checked);
                            try {
                                await setStorage({
                                    [storageKey]: checked ? "on" : "off",
                                });
                            } catch (error) {
                                console.warn(error);
                            }
                        }}
                        checked={localState}
                        id={storageKey}
                        className="flex items-center justify-center w-5 h-5 rounded-[4px] bg-accentThree"
                    >
                        <CheckboxPrimitive.Indicator className="text-white">
                            <CheckIcon />
                        </CheckboxPrimitive.Indicator>
                    </StyledCheckbox> */}
                </div>
            </div>
        </>
    );
}

// const StyledCheckbox = styled(CheckboxPrimitive.Root, {
//     position: "relative",
//     "&::after": {
//         content: "",
//         position: "absolute",
//         inset: `min(
//       0px,
//       calc((100% - 2.25rem) / 2)
//     )`,
//     },
//     '&[data-state="unchecked"]': {
//         backgroundColor: "transparent",
//         border: "2px solid var(--twitter-accent-one)",
//     },
// });

export default CheckboxControl;
