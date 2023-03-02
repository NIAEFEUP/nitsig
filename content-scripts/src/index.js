import {
  addResizeListener,
  observe,
} from "./modules/initialize";
import { injectAllChanges, userPreferences } from "./modules/options/all";
import constructNewData from "./modules/utilities/constructNewData";
import { getStorage } from "./modules/utilities/storage";
import { changeProfileLink } from "./modules/links";
import { profileChanges } from "./modules/profile";

/*--
- Docs: https://developer.chrome.com/docs/extensions/reference/storage/#synchronous-response-to-storage-updates
- Listen to Chrome Storage changes
- Inject styles in respond to changes
--*/
chrome.storage.onChanged.addListener((changes) => {
  console.log(changes);
  const newChangesData = constructNewData(changes);
  injectAllChanges(newChangesData);
});

/*--
- Initializing function, runs once at start
- Get Chrome Storage and inject respective styles
--*/
const init = async () => {
  // // Start MutationObserver
  //observe();

  // // Watch for resize events
  // addResizeListener();

  // Inject user preferences
  const data = await getStorage(userPreferences);
  injectAllChanges(data);

  changeProfileLink();
  profileChanges();
  injectOverrideFunctions();
};

init();
