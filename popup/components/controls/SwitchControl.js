import * as SwitchPrimitive from "@radix-ui/react-switch";
import { styled } from "@stitches/react";
import { RiQuestionLine } from "@remixicon/react";
import { Tooltip } from "react-tooltip";
import { usePreference } from "../../utils/usePreference";

function SwitchControl({
    label,
    storageKey,
    tooltipContent,
    tooltipId,
}) {
    const [preference, setPreference] = usePreference(storageKey);

    return (
        <div className="flex items-center justify-between w-full">
            <label htmlFor={storageKey} className="text-[15px] font-bold">
                {label}
                {tooltipContent && (
                    <span className="inline-block scale-80 ml-1 align-top text-gray-500">
                        <RiQuestionLine data-tooltip-id={tooltipId} />
                        <Tooltip
                            className="tooltip"
                            id={tooltipId}
                            content={tooltipContent}
                            place="top"
                        />
                    </span>
                )}
            </label>
            <StyledSwitch
                onCheckedChange={setPreference}
                checked={preference}
                id={storageKey}
            >
                <StyledThumb />
            </StyledSwitch>
        </div>
    );
}

const StyledSwitch = styled(SwitchPrimitive.Root, {
    all: "unset",
    width: 40,
    height: 14,
    backgroundColor: "#939393",
    borderRadius: "9999px",
    position: "relative",
    WebkitTapHighlightColor: "#1DA1F2",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    '&[data-state="checked"]': { backgroundColor: "#c24a4a" },
});

const StyledThumb = styled(SwitchPrimitive.Thumb, {
    display: "block",
    width: 20,
    height: 20,
    backgroundColor: "#fafafa",
    boxShadow: "rgb(0 0 0 / 50%) 0px 1px 3px",
    borderRadius: "9999px",
    transition: "transform 100ms",
    transform: "translateX(0px)",
    willChange: "transform",
    '&[data-state="checked"]': {
        backgroundColor: "#993333",
        transform: "translateX(20px)",
    },
});

export default SwitchControl;
