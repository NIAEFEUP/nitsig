import {
  useNavBar,
  hideShortcuts,
  changeFont
} from "./options";

// Array of user preferences, passed to `injectAllChanges`
export const userPreferences = [
  "navbar",
  "shortcuts",
  "autoLogin",
  "font"
];

export const injectAllChanges = (data) => {
  Promise.all([
    hideShortcuts(data?.shortcuts),
    useNavBar(data?.navbar),
    changeFont(data?.font)
  ]).catch((err) => console.error(err));
};
