import {
    useNavBar,
  hideShortcuts,
  changeFont
} from "./some_options";

// Array of user preferences, passed to `injectAllChanges`
export const userPreferences = [
  "navbar",
  "shortcuts",
  "autoLogin",
  "font"
];

export const injectAllChanges = (data) => {
    useNavBar(data?.navbar);
  hideShortcuts(data?.shortcuts);
  changeFont(data?.font);
};
