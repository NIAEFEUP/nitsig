import {
    injectOverrideFunctions,
    reverseDateDirection,
    addSortTableActions,
} from "./modules/initialize";
import { injectAllChanges, userPreferences } from "./modules/options";
import constructNewData from "./modules/options/constructNewData";
import { currentAccountPage } from "./pages/current_account_page";
import { getStorage, setStorage } from "./modules/utilities/storage";
import { rememberLogin } from "./modules/login";
import { replaceIcons } from "./modules/icons";
import { teacherPage } from "./pages/teacher_page";
import { classPage } from "./pages/class_page";
import { improveSchedule } from "./modules/schedule";
import { changeCourseCards, changeProfileRow } from "./pages/profile_page";
import { courseUnitPage } from "./pages/course_unit_page";
import { fixPagination } from "./modules/pagination";
import { changeLayout } from "./modules/layout";
import { addStarIconToCard } from "./modules/favorite-course";
import { createComponentsPage } from "./pages/components_page";

const GENERIC_SIGARRA_URL: string = "^https://sigarra.up.pt/feup/(pt|en)/";
const BASE_SIGARRA_URL: string = GENERIC_SIGARRA_URL + "(?!.*/components)";
const COMPONENTS_URL: string = GENERIC_SIGARRA_URL + "(?=.*/components)";
const STUDENT_PAGE_URL: string =
    BASE_SIGARRA_URL +
    "fest_geral.(cursos_list|curso_percurso_academico_view|curso_posicao_plano_view|ucurr_inscricoes_list|estatutos_regimes_view|info_ingresso_view|info_pessoal_completa_view).*$";

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

const functionsToExecute: Array<{
    name: string;
    func: () => void;
    regex: RegExp;
}> = [
    {
        name: "changeLayout",
        func: changeLayout,
        regex: new RegExp(BASE_SIGARRA_URL + ".*$"),
    },
    {
        name: "reverseDateDirection",
        func: reverseDateDirection,
        regex: new RegExp(BASE_SIGARRA_URL + ".*$"),
    },
    {
        name: "currentAccountPage",
        func: currentAccountPage,
        regex: new RegExp(
            BASE_SIGARRA_URL +
                "gpag_ccorrente_geral.conta_corrente_view?pct_cod=.*$",
        ),
    },
    {
        name: "addSortTableActions",
        func: addSortTableActions,
        regex: new RegExp(BASE_SIGARRA_URL + ".*$"),
    },
    {
        name: "replaceIcons",
        func: replaceIcons,
        regex: new RegExp(BASE_SIGARRA_URL + ".*$"),
    },
    {
        name: "improveSchedule",
        func: improveSchedule,
        regex: new RegExp(BASE_SIGARRA_URL + "hor_geral.estudantes_view.*$"),
    },
    {
        name: "changeProfileRow",
        func: changeProfileRow,
        regex: new RegExp(STUDENT_PAGE_URL),
    },
    {
        name: "changeCourseCards",
        func: changeCourseCards,
        regex: new RegExp(STUDENT_PAGE_URL),
    },
    {
        name: "fixPagination",
        func: fixPagination,
        regex: new RegExp(BASE_SIGARRA_URL + ".*$"),
    },
    {
        name: "teacherPage",
        func: teacherPage,
        regex: new RegExp(BASE_SIGARRA_URL + "func_geral.formview.*$"),
    },
    {
        name: "classPage",
        func: classPage,
        regex: new RegExp(
            BASE_SIGARRA_URL + "it_listagem.lista_turma_disciplina.*$",
        ),
    },
    {
        name: "courseUnitPage",
        func: courseUnitPage,
        regex: new RegExp(BASE_SIGARRA_URL + "ucurr_geral.ficha_uc_view.*$"),
    },
    {
        name: "injectOverrideFunctions",
        func: injectOverrideFunctions,
        regex: new RegExp(BASE_SIGARRA_URL + ".*$"),
    },
    {
        name: "addStarIconToCard",
        func: addStarIconToCard,
        regex: new RegExp(STUDENT_PAGE_URL),
    },
    {
        name: "componentsPage",
        func: createComponentsPage,
        regex: new RegExp(COMPONENTS_URL),
    },
];

const init = async (): Promise<void> => {
    // Inject user preferences
    const data = await getStorage(userPreferences);
    injectAllChanges(data);

    if (!(await getStorage("favorite_courses"))) {
        await setStorage({ favorite_courses: "{}" }); //Insert empty object
    }

    functionsToExecute.forEach((f) => {
        try {
            if (f.regex.test(document.location.href)) f.func();
        } catch (error) {
            console.error(`Error running ${f.name} init function!\n`);
            console.error(error);
        }
    });
    // we run rememberLogin at last, because it's async
    // TODO (luisd): make a better mechanism for functions that depend on previous
    // steps and might be async
    await rememberLogin(data);
};

init();
