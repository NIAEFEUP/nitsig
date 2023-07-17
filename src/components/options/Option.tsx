import React from "react";
import {
    Option,
    OptionTypeFromString,
    OptionTypeString,
} from "~/common/options";
import BooleanOption from "./BooleanOption";

interface Props<T extends OptionTypeString> {
    option: Option<T>;
    optionKey: string;
    value: OptionTypeFromString<T>;
}

export default function <T extends OptionTypeString>(props: Props<T>) {
    switch (props.option.type) {
        case "boolean":
            return <BooleanOption {...(props as Props<"boolean">)} />;
    }
}
