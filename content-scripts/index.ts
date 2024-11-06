/* eslint-disable no-useless-escape */
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

// prettier-ignore
const GENERIC_SIGARRA_URL: string = "^https:\/\/sigarra.up.pt\/feup\/(pt|en)\/";
// prettier-ignore
const BASE_SIGARRA_URL: string = GENERIC_SIGARRA_URL + "(?!.*\/components)";
// prettier-ignore
const COMPONENTS_URL: string = GENERIC_SIGARRA_URL + "(?=.*\/components)";
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

const functionsToExecute: {
    [x: string]: {
        name: string;
        func: () => void;
    }[];
} = {
    [`${BASE_SIGARRA_URL}.*$`]: [
        {
            name: "changeLayout",
            func: changeLayout,
        },
        {
            name: "reverseDateDirection",
            func: reverseDateDirection,
        },
        {
            name: "addSortTableActions",
            func: addSortTableActions,
        },
        {
            name: "replaceIcons",
            func: replaceIcons,
        },
        {
            name: "fixPagination",
            func: fixPagination,
        },
        {
            name: "injectOverrideFunctions",
            func: injectOverrideFunctions,
        },
    ],
    [`${BASE_SIGARRA_URL}gpag_ccorrente_geral\\.conta_corrente_view\\?pct_cod=.*$`]:
        [
            {
                name: "currentAccountPage",
                func: currentAccountPage,
            },
        ],
    [`${BASE_SIGARRA_URL}hor_geral\\.estudantes_view.*$`]: [
        {
            name: "improveSchedule",
            func: improveSchedule,
        },
    ],
    [`${STUDENT_PAGE_URL}`]: [
        {
            name: "changeProfileRow",
            func: changeProfileRow,
        },
        {
            name: "changeCourseCards",
            func: changeCourseCards,
        },
        {
            name: "addStarIconToCard",
            func: addStarIconToCard,
        },
    ],
    [`${BASE_SIGARRA_URL}func_geral\\.formview.*$`]: [
        {
            name: "teacherPage",
            func: teacherPage,
        },
    ],
    [`${BASE_SIGARRA_URL}it_listagem\\.lista_turma_disciplina.*$`]: [
        {
            name: "classPage",
            func: classPage,
        },
    ],
    [`${BASE_SIGARRA_URL}ucurr_geral\\.ficha_uc_view.*$`]: [
        {
            name: "courseUnitPage",
            func: courseUnitPage,
        },
    ],
    [`${COMPONENTS_URL}`]: [
        {
            name: "componentsPage",
            func: createComponentsPage,
        },
    ],
};

const init = async (): Promise<void> => {
    // Inject user preferences
    const data = await getStorage(userPreferences);
    injectAllChanges(data);

    if (!(await getStorage("favorite_courses"))) {
        await setStorage({ favorite_courses: "{}" }); //Insert empty object
    }

    for (const key in functionsToExecute) {
        const keyRegex = new RegExp(key);
        if (keyRegex.test(document.location.href)) {
            functionsToExecute[key].forEach((f) => {
                try {
                    f.func();
                } catch (error) {
                    console.error(`Error running ${f.name} init function!\n`);
                    console.error(error);
                }
            });
        }
    }

    // we run rememberLogin at last, because it's async
    // TODO (luisd): make a better mechanism for functions that depend on previous
    // steps and might be async
    await rememberLogin(data);
};

init();
