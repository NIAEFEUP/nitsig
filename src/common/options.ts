interface Option<T extends "boolean" | "string" | "number" = "boolean"> {
    name: string;
    description: string;
    type: T;
    default: T extends "boolean"
        ? boolean
        : T extends "string"
        ? string
        : number;
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
    }
} as const satisfies Record<string, Option>;

export default options;
