import {
  injectOverrideFunctions,
  reverseDateDirection,
  currentAccountPage,
  addSortTableActions
} from "./modules/initialize";
import { injectAllChanges, userPreferences } from "./modules/options/all";
import constructNewData from "./modules/utilities/constructNewData";
import { getStorage } from "./modules/utilities/storage";
import { changeProfileLink } from "./modules/links";
import { rememberLogin } from "./modules/login";
import { replaceIcons } from "./modules/icons";
import { teacherPage } from "./pages/teacher_page";
import { classPage } from "./pages/class_page";
import { improveSchedule } from "./modules/schedule";
import { changeCourseCards, changeProfileRow } from "./pages/profile_page";
import { courseUnitPage } from "./pages/course_unit_page";
/*--
- Docs: https://developer.chrome.com/docs/extensions/reference/storage/#synchronous-response-to-storage-updates
- Listen to Chrome Storage changes
- Inject styles in respond to changes
--*/
chrome.storage.onChanged.addListener((changes) => {
  const newChangesData = constructNewData(changes);
  rememberLogin();
  injectAllChanges(newChangesData);
});

/*--
- Initializing function, runs once at start
- Get Chrome Storage and inject respective styles
--*/
const init = async () => {

  const path = window.location.pathname.split("/").slice(-1);

  // // Watch for resize events
  // addResizeListener();

  // // Inject user preferences
  const data = await getStorage(userPreferences);
  injectAllChanges(data);
  rememberLogin(data);
  changeProfileLink();
  teacherPage();

  if(path == "it_listagem.lista_turma_disciplina")
    classPage();
  courseUnitPage();

  injectOverrideFunctions();

  reverseDateDirection(); //TO FIX: the sort funcionality stop working because of this
  currentAccountPage();
  addSortTableActions();
  replaceIcons();
  improveSchedule();
  changeProfileRow();
  changeCourseCards();
};

init();
