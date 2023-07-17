import Browser from "webextension-polyfill";
import { map } from "./objects";

export type OptionTypeString = "boolean" | "string" | "number";

export type OptionTypeFromString<T extends OptionTypeString> =
    T extends "boolean" ? boolean : T extends "string" ? string : number;

export interface Option<T extends OptionTypeString> {
    name: string;
    description: string;
    type: T;
    default: OptionTypeFromString<T>;
}

const options = {
    hideShortcuts: {
        name: "Hide Shortcuts",
        description: "Hide the shortcuts on the sidebar",
        type: "boolean",
        default: true,
    },
    autoLogin: {
        name: "Auto Login",
        description: "Automatically login to sigarra",
        type: "boolean",
        default: false,
    },
} as const satisfies Record<string, Option<OptionTypeString>>;

export type Options = typeof options;

export type OptionName = keyof Options;

export type OptionType<T extends OptionName> = OptionTypeFromString<
    Options[T]["type"]
>;

export type OptionValues = {
    [key in OptionName]: OptionType<key>;
};

export const getOption = async <T extends OptionName>(
    name: T,
): Promise<OptionType<T>> =>
    ((await Browser.storage.local.get(name))[name] as OptionType<T>) ??
    options[name].default;

export const getOptions = async (): Promise<OptionValues> => {
    const values = (await Browser.storage.local.get(null)) as OptionValues;

    return map(options, (option, key) => values[key] ?? option.default);
};

export default options;
