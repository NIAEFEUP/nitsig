import {
  hideShortcuts,
  changeFont
} from "./some_options";

// Array of user preferences, passed to `injectAllChanges`
export const userPreferences = [
  "shortcuts",
  "autoLogin",
  "font"
];

export const injectAllChanges = (data) => {
  hideShortcuts(data?.shortcuts);
  changeFont(data?.font);
};
