import { useNavBar, hideShortcuts, changeFont } from "./options";

// Array of user preferences, passed to `injectAllChanges`
export const userPreferences: string[] = [
    "navbar",
    "shortcuts",
    "autoLogin",
    "font",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const injectAllChanges = (data: any): void => {
    Promise.all([
        hideShortcuts(data?.shortcuts),
        useNavBar(data?.navbar),
        changeFont(data?.font),
    ]).catch((err) => console.error(err));
};
