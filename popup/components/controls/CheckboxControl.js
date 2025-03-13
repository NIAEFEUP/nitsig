import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { styled } from "@stitches/react";
import { usePreference } from "../../utils/usePreference";

function CheckboxControl({ label, storageKey }) {
    const [preference, setPreference] = usePreference(storageKey);

    return (
        <div className="flex items-center justify-between w-full py-1">
            <label htmlFor={storageKey} className="text-base tracking-normal">
                {label}
            </label>
            <div className="grid rounded-full cursor-pointer w-9 h-9 place-items-center hover:bg-accentFour">
                <StyledCheckbox
                    onCheckedChange={setPreference}
                    checked={preference}
                    id={storageKey}
                    className="flex items-center justify-center w-5 h-5 rounded-[4px] bg-accentThree"
                >
                    <CheckboxPrimitive.Indicator className="text-white">
                        <CheckIcon />
                    </CheckboxPrimitive.Indicator>
                </StyledCheckbox>
            </div>
        </div>
    );
}

const StyledCheckbox = styled(CheckboxPrimitive.Root, {
    position: "relative",
    "&::after": {
        content: "",
        position: "absolute",
        inset: `min(
      0px,
      calc((100% - 2.25rem) / 2)
    )`,
    },
    '&[data-state="unchecked"]': {
        backgroundColor: "transparent",
        border: "2px solid var(--twitter-accent-one)",
    },
});

export default CheckboxControl;
