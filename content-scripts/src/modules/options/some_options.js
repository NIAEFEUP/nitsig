//import selectors from "../../selectors";
import addStyles from "../utilities/addStyles";
import removeElement from "../utilities/removeElement";
//import { getStorage } from "../utilities/storage";

// Function to hide shortcuts 
export const hideShortcuts = (shortcuts) => {
  switch (shortcuts) {
    case "on":
      addStyles(
        "se-hide-shortcuts",
        `
          #caixa-atalhos{
            display: none
          }
        `
      );
      break;

    case "off":
      removeElement("se-hide-shortcuts");
      break;
  }
};