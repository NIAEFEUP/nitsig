import masterOptions from "~/common/options";
import autoLogin from "./autoLogin";
import hideShortcuts from "./hideShortcuts";

const options = {
    hideShortcuts,
    autoLogin,
} as const satisfies {
    [key in keyof typeof masterOptions]: (
        value: (typeof masterOptions)[key]["default"],
    ) => unknown;
};

export default options;
