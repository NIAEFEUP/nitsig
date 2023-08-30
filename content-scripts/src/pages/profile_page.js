import { removeTwoColumnTable } from "../modules/utilities/pageUtils";
import { getUP } from "../modules/utilities/sigarra";

//this is are all pages AFAIK that contain an profile row
const profileRowPages = [
    "fest_geral.cursos_list",
    "fest_geral.curso_percurso_academico_view",
    "fest_geral.curso_posicao_plano_view",
    "fest_geral.ucurr_inscricoes_list",
    "fest_geral.estatutos_regimes_view",
    "fest_geral.info_ingresso_view",
    "fest_geral.info_pessoal_completa_view"
];

const currentSearchParams = (new URL(document.URL)).searchParams;

/**
 * 
 * @returns string
 */
function getStudentName(){
    return document.querySelector('.estudante-info-nome').textContent.trim();
}

/**
 * 
 * @param {Element} element 
 */
async function removeTitleRedudancy(element) {
    
    if(getUP() == currentSearchParams.get("pv_num_unico") && 
        document.location.href.toLowerCase().includes("fest_geral.cursos_list")){

        element.textContent = "O teu perfil";
        return;
    }
    element.textContent = element.textContent.split('-')[0].trim()
}

export const changeProfileRow = () => {
    const hasProfileRow = profileRowPages
        .map((value) => document.location.href.toLowerCase().includes(value))
        .reduce((prev, curr) => prev || curr);
    if (!hasProfileRow){
        return;
    }
    // first we change the h1, because it always repeats the student's full name
    const h1 = document.querySelector('#conteudoinner > h1:nth-child(3)');
    if(h1 !== null){
        removeTitleRedudancy(h1);
    }

    const personalInfo = document.querySelector('#infopessoalh')
    if(personalInfo !== null){
        personalInfo.remove();
    }

    const studentPhoto = document.querySelector('.estudante-foto');
    studentPhoto.classList.add('se-student-photo');

    const studentName = document.querySelector('.estudante-info-nome');
    const studentUP = document.querySelector('.estudante-info-numero');
    const studentInstitutionalEmail = document.querySelector('.email-institucional');
    const studentAlternativeEmail = document.querySelector('.email-alternativo');
    const studentWebPage = document.querySelector('.pagina-pessoal');

    const oldScheduleRow = document.querySelector('.container-fluid');
    const newScheduleRow = document.createElement('div');
    newScheduleRow.classList.add("se-profile-row");
    newScheduleRow.append(studentPhoto);

    const profileInfo = document.createElement('div');
    profileInfo.classList.add('se-profile-info');

    const userNameUPRow = document.createElement('div');
    userNameUPRow.append(studentName, studentUP);
    userNameUPRow.classList.add('se-profile-username-row');
    profileInfo.append(userNameUPRow);

    const emailList = document.createElement('div');
    profileInfo.append(emailList)
    emailList.append(studentInstitutionalEmail);
    if(studentAlternativeEmail != null) emailList.append(studentAlternativeEmail);

    if(studentWebPage != null) {
        const webpageLink = studentWebPage.lastElementChild;
        webpageLink.textContent = 'Website';
        webpageLink.classList.add('se-website-button');
        webpageLink.style.margin = 0;
        profileInfo.append(webpageLink);
    }
    

    newScheduleRow.append(profileInfo);

    //replacement should only be done at the end just in case something fails
    oldScheduleRow.parentElement.insertBefore(newScheduleRow, oldScheduleRow);
    oldScheduleRow.remove();
};

export const changeCourseCards = () => {
    const couldHaveCards = profileRowPages
        .map((value) => document.location.href.toLowerCase().includes(value))
        .reduce((prev, curr) => prev || curr);
    if(!couldHaveCards) return;

    const cards = Array.from(document.querySelectorAll('.estudante-lista-curso-activo'));
    if(cards.length == 0) return;

    const hasCardSelected = cards
        .map((card) => card.classList.contains('percurso'))
        .reduce((prev, curr) => prev || curr);

    const modifiedCards = cards.map((card) => {
        const active = card.classList.contains('percurso');
        card.classList = ["se-course-card"];
        const detailsElement = card.querySelector('.estudante-lista-curso-detalhes');
        if(detailsElement != null) {
            const url = detailsElement.querySelector('a').href;
            detailsElement.remove();

            const a = document.createElement('a');
            a.classList = card.classList;
            a.classList.add("se-course-card-clickable");
            if(active || hasCardSelected == false) a.classList.add('se-course-card-active')

            a.append(...card.children);
            a.href = url;
            return a;
        }
        return card;
    });

    const oldCardsList = document.querySelector('.estudantes-caixa-lista-cursos');
    const newCardsList = document.createElement('div');
    newCardsList.classList.add("se-course-card-list");

    newCardsList.append(...modifiedCards);


    oldCardsList.parentElement.insertBefore(newCardsList, oldCardsList);
    oldCardsList.remove();
};