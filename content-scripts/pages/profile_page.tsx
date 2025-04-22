import { getUP } from "../modules/utilities/sigarra";
import Card from "../components/Card";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";

//this is are all pages AFAIK that contain a profile row
const profileRowPages = [
    "fest_geral.cursos_list",
    "fest_geral.curso_percurso_academico_view",
    "fest_geral.curso_posicao_plano_view",
    "fest_geral.ucurr_inscricoes_list",
    "fest_geral.estatutos_regimes_view",
    "fest_geral.info_ingresso_view",
    "fest_geral.info_pessoal_completa_view",
];

const currentSearchParams = new URL(document.URL).searchParams;
/**
 *
 * @param {Element} element
 */
function removeAtSign(element: Element) {
    const atSign = element.querySelector(
        "span:nth-child(2) > a:nth-child(1) > span:nth-child(2)",
    );
    if (atSign && atSign.parentElement) {
        atSign.parentElement.insertBefore(document.createTextNode("@"), atSign);
        atSign.remove();
    }

    const aux = element.querySelector(
        "span:nth-child(2) > a:nth-child(1) > img:nth-child(1)",
    );
    aux?.remove();
}

/**
 *
 * @param {Element} element
 */
async function removeTitleRedundancy(element: Element) {
    if (
        getUP() == currentSearchParams.get("pv_num_unico") &&
        document.location.href.toLowerCase().includes("fest_geral.cursos_list")
    ) {
        element.textContent = "O teu perfil";
        return;
    }
    element.textContent = element.textContent?.split("-")[0].trim() || "";
}

export const changeProfileRow = () => {
    const hasProfileRow = profileRowPages
        .map((value) => document.location.href.toLowerCase().includes(value))
        .reduce((prev, curr) => prev || curr);
    if (!hasProfileRow) {
        return;
    }
    // first we change the h1, because it always repeats the student's full name
    const h1 = document.querySelector("#conteudoinner > h1:nth-child(3)");
    if (h1 !== null) {
        removeTitleRedundancy(h1);
    }

    const personalInfo = document.querySelector("#infopessoalh");
    if (personalInfo !== null) {
        personalInfo.remove();
    }

    const studentPhoto = document.querySelector(".estudante-foto");
    studentPhoto?.classList.add("se-student-photo");

    const studentName = document.querySelector(".estudante-info-nome");
    const studentUP = document.querySelector(".estudante-info-numero");
    const newStudentUP = document.createElement("p");
    newStudentUP.textContent = studentUP?.textContent || "";

    const studentInstitutionalEmail = document.querySelector(
        ".email-institucional",
    );
    const studentAlternativeEmail =
        document.querySelector(".email-alternativo");
    const studentWebPage = document.querySelector(".pagina-pessoal");

    const oldScheduleRow = document.querySelector(".container-fluid");
    if (!oldScheduleRow) return;

    const newScheduleRow = document.createElement("div");
    newScheduleRow.classList.add("se-profile-row");
    if (studentPhoto) newScheduleRow.append(studentPhoto);

    const profileInfo = document.createElement("div");
    profileInfo.classList.add("se-profile-info");

    const firstRow = document.createElement("div");
    firstRow.classList.add("se-profile-first-row");

    const userNameUPRow = document.createElement("div");
    if (studentName) userNameUPRow.append(studentName, newStudentUP);
    userNameUPRow.classList.add("se-profile-username-row");
    firstRow.append(userNameUPRow);

    const editButton = document.querySelector(".menu-contexto-principal");
    if (editButton != null) {
        const isInEditPage = location.href
            .toLowerCase()
            .includes("fest_geral.info_pessoal_completa_view");
        const href = isInEditPage
            ? "javascript:history.go(-1)"
            : `fest_geral.info_pessoal_completa_view?pv_num_unico=${getUP()}`;
        const a = document.createElement("a");
        a.classList.add("se-profile-edit-button");
        a.href = href;

        a.innerHTML = `<i class="${
            isInEditPage ? "ri-arrow-go-back-line" : "ri-edit-line"
        } ri-xl"></i>`;
        firstRow.append(a);
    }

    profileInfo.append(firstRow);

    const emailList = document.createElement("div");
    profileInfo.append(emailList);
    if (studentInstitutionalEmail) {
        removeAtSign(studentInstitutionalEmail);

        studentInstitutionalEmail
            .querySelectorAll(".cursormao")
            .forEach((val) => val.remove());
        emailList.append(studentInstitutionalEmail);
    }

    if (studentAlternativeEmail != null) {
        emailList.append(studentAlternativeEmail);
        removeAtSign(studentAlternativeEmail);
    }

    if (studentWebPage != null) {
        const webpageLink = studentWebPage.lastElementChild;
        if (webpageLink) {
            webpageLink.textContent = "Website";
            webpageLink.classList.add("se-website-button");
            (webpageLink as HTMLElement).style.margin = "0";
            profileInfo.append(webpageLink);
        }
    }

    newScheduleRow.append(profileInfo);

    //replacement should only be done at the end just in case something fails
    oldScheduleRow.parentElement?.insertBefore(newScheduleRow, oldScheduleRow);
    oldScheduleRow.remove();
};

export const changeCourseCards = () => {
    if (
        !profileRowPages.some((page) =>
            document.location.href.toLowerCase().includes(page),
        )
    ) {
        return;
    }

    const cards = Array.from(
        document.querySelectorAll(".estudante-lista-curso-activo"),
    );
    if (cards.length === 0) return;

    const hasCardSelected = cards.some((card) =>
        card.classList.contains("percurso"),
    );
    const oldCardsList = document.querySelector(
        ".estudantes-caixa-lista-cursos",
    );
    if (!oldCardsList) return;

    const newCardsList = document.createElement("div");
    newCardsList.classList.add("se-course-card-list");

    cards.forEach((card) => {
        const active = card.classList.contains("percurso");
        const detailsElement = card.querySelector(
            ".estudante-lista-curso-detalhes",
        );
        if (!detailsElement) return;

        const link = detailsElement.querySelector("a");
        if (!link) return;

        const url = link.href;
        detailsElement.remove();

        const urlParams = new URLSearchParams(url.split("?")[1] || "");
        const festId =
            urlParams.get("pv_fest_id") ||
            new URLSearchParams(location.search).get("pv_fest_id");

        const courseName =
            card.querySelector(".estudante-lista-curso-nome a")?.textContent ||
            "";
        const courseInstitution =
            card.querySelector(".estudante-lista-curso-instit")?.textContent ||
            "";
        const courseLink =
            card
                .querySelector(".estudante-lista-curso-nome a")
                ?.getAttribute("href") || "#";
        const courseTable = card.querySelector("table.formulario");

        const cardTitle = (
            <div>
                <a href={courseLink} className="estudante-lista-curso-nome">
                    {courseName}
                </a>
                <div className="estudante-lista-curso-instit">
                    {courseInstitution}
                </div>
            </div>
        );


        // Creates the card wrapper  : se-course-card-wrapper / se-course-card-clickable / se-course-card-active 
        /* const cardWrapper = document.createElement("div");
        cardWrapper.classList.add(
            "se-course-card-wrapper",
            "se-course-card-clickable",
        );

        if (active || !hasCardSelected) {
            cardWrapper.classList.add("se-course-card-active");
        } */
        //////////////////////////////////////////////////////////////////////////


        const cardElement = (
            <Card
                id={`course-card-${festId}`}
                className="se-course-card"
                title={cardTitle}
                description={courseTable || ""}
            ></Card>
        );

        if (festId) {
            cardElement.setAttribute("data-course-enrollment-id", festId);
        }

        cardElement.classList.add(
            "se-course-card-clickable",
        );
        if (active || !hasCardSelected) {
            cardElement.classList.add("se-course-card-active");
        }

        //cardWrapper.appendChild(cardElement);

        cardElement.addEventListener("click", (e) => {
            if (!(e.target as Element).closest("a")) {  
                window.location.href = url;
            }
        });

        newCardsList.appendChild(cardElement);
    });

    oldCardsList.parentNode?.insertBefore(newCardsList, oldCardsList);
    oldCardsList.remove();
};
