import { useNavBar, hideShortcuts, changeFont, expandSections } from "./options";

// Array of user preferences, passed to `injectAllChanges`
export const userPreferences: string[] = [
    "navbar",
    "shortcuts",
    "autoLogin",
    "font",
    "expand",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const injectAllChanges = (data: any): void => {
    Promise.all([
        hideShortcuts(data?.shortcuts),
        useNavBar(data?.navbar),
        changeFont(data?.font),
        expandSections(data?.expand),
    ]).catch((err) => console.error(err));
};
