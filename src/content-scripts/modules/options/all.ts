import {
  hideShortcuts,
} from "./some_options";

// Array of user preferences, passed to `injectAllChanges`
export const userPreferences = [
  "shortcuts",
  "autoLogin"
];

export const injectAllChanges = (data) => {
  hideShortcuts(data?.shortcuts); 
};
