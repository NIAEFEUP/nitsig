import masterOptions, {
    OptionTypeFromString,
    OptionTypeString,
} from "~/common/options";
import autoLogin from "./autoLogin";
import hideShortcuts from "./shortcuts";

export type Option<T extends OptionTypeString> = (
    value: OptionTypeFromString<T>,
) => unknown;

type Options = {
    [key in keyof typeof masterOptions]: Option<
        (typeof masterOptions)[key]["type"]
    >;
};

const options = {
    autoLogin,
    hideShortcuts,
} as const satisfies Options;

export default options;
