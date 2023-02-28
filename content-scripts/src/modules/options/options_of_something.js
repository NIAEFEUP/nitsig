import selectors from "../../selectors";
import addStyles from "../utilities/addStyles";
import removeElement from "../utilities/removeElement";
import { getStorage } from "../utilities/storage";

// Function to change Home Button
export const changeBasedOnPreference1 = (preference1) => {
  switch (preference1) {
    case "off":
      addStyles(
        "custom-id",
        /* 
        `
        STYLE HERE 
        `
        */
      );
      break;

    case "on":
      removeElement("custom-id");
      break;
  }
};