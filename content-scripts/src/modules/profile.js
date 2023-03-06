const hideSociodemographicData = () => {
    document.querySelector("#infopessoalh").style.display="none";
}

const hideCurricularUnitTab = () => {
    document.querySelector(".estudantes-curso-opcao:nth-child(3)").style.display="none";
}

const renameStatusAndFrequency = () => {
    (
        document.querySelector(".estudantes-curso-opcao:nth-child(4) a") ??
        document.querySelector(".estudantes-curso-opcao:nth-child(4)")
    ).innerText="Estatutos / Frequência";
}

const alignGPAandECTs = () => {
    document.querySelector(".caixa > :nth-child(1) > tbody > :nth-child(3)").style.display="none"; // remove ects by recognition
    document.querySelector(".caixa > :nth-child(1) > tbody").style.display="flex";
}

const hideLegend = () => {
    document.querySelector(".caixa > :last-child").style.display="none";  
}

const defaultCurrentYear = () => {
    document.querySelector("#tabelapercurso > tbody > tr:first-child > :last-child").click();
}

const titleTableAcademicJourney = () => {
    document.querySelectorAll("#tabelapercurso .l").forEach( elem => {
        switch (elem.innerHTML){
            case "V":
                elem.title = "Válida";
                break;
            case "A":
                elem.title = "Anulada";
                break;
            case "AA":
                elem.title = "Anulada Administrativamente";
                break;
            case "C":
                elem.title = "Condicionada";
                break;
        }
    })
}

const reduceTableAcademicJourney = () => {
    document.querySelector("#tabelapercurso .totais.s").style.display="none";
    document.querySelector("#tabelapercurso .totais.n").style.display="none";
}

const linkToGradeResults = () => {
    document.querySelectorAll("#tabelapercurso tr:is(.i, .p)").forEach(elem => {
        elem.querySelectorAll("td.n").forEach(e1 => {
            if (e1.classList.contains("aprovado") || (e1.classList.contains("nao-aprovado"))) {
                e1.classList.add("cursormao");
                e1.onclick = (_) => { elem.querySelector("td a.unidade-curricular").click() };
            }
        })
    })
}

const linkToCurrUnit = () => {
    document.querySelectorAll("#tabelapercurso tr:is(.i, .p)").forEach(elem => {
        elem.querySelectorAll("td.k.t.uc").forEach(e1 => {
            e1.onclick = (e) => { 
                if (e.isTrusted)
                elem.querySelector("td.k.t a").click()
             };
        })
    })
}

export const profileChanges = () => {

    hideSociodemographicData();
    hideCurricularUnitTab();
    renameStatusAndFrequency();
    
    if (window.location.href.toLowerCase().includes( "/fest_geral.curso_percurso_academico_view")){
        alignGPAandECTs();
        hideLegend();
        defaultCurrentYear();
        titleTableAcademicJourney();
        reduceTableAcademicJourney();
        linkToGradeResults();
        linkToCurrUnit();
    }
}