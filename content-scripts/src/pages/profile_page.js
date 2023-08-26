
const profileRowPages = [
    "fest_geral.cursos_list",
    "fest_geral.curso_percurso_academico_view",
    "fest_geral.curso_posicao_plano_view",
    "fest_geral.ucurr_inscricoes_list",
    "fest_geral.estatutos_regimes_view",
    "fest_geral.info_ingresso_view",
    "fest_geral.info_pessoal_completa_view"
];

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
function removeTitleRedudancy(element){
    if(element.textContent.trim() == getStudentName()){
        element.textContent = "O teu perfil";
        return;
    }
    element.textContent = (element.textContent.replace(`- ${getStudentName()}`, '')).trim()
}

export const changeProfileRow = () => {
    const hasProfileRow = profileRowPages
        .map((value) => document.location.href.includes(value))
        .reduce((prev, curr) => prev || curr);
    if (!hasProfileRow){
        return;
    }
    // first we change the h1, because it always repeats the student's full name
    const h1 = document.querySelector('#conteudoinner > h1:nth-child(3)');
    if(h1 !== null){
        removeTitleRedudancy(h1);
    }

};