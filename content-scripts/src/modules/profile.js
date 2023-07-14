const hideSociodemographicData = () => {
    var x =  document.querySelector("#infopessoalh");
    if (x != null)
        x.style.display="none";
}

const hideCurricularUnitTab = () => {
    var x = document.querySelector(".estudantes-curso-opcao:nth-child(3)");
    if (x != null)
        x.style.display="none";
}

const renameStatusAndFrequency = () => {
    const element = document.querySelector(".estudantes-curso-opcao:nth-child(4) a") ?? document.querySelector(".estudantes-curso-opcao:nth-child(4)");
    if (element !== null) {
      element.innerText = "Estatutos / Frequência";
    }
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

// ------------------------
// Navbars
// ------------------------
const styleTextNavbar = () => {
    var z = document.querySelectorAll("li.estudantes-curso-opcao a");
    z.forEach(element => {
        element.style = `
        text-decoration: none !important;
        `;
    });
}

const styleButtonsNavbar = () => {
    styleTextNavbar();
    var y = document.querySelectorAll("li.estudantes-curso-opcao");
    y.forEach(element => {
        element.style = `
        border: none !important;
        padding: 0.5em 1em !important;
        `;
        
    });

    var y_ativo = document.querySelector("li.estudantes-curso-opcao.ativo");
    if (y_ativo != null) {
        y_ativo.style = `
        border: none !important;
        background: #8c2d19;
        color: white;
        padding: 0.5em 1em !important;
        `;
    }
}
const styleNavbar = () => {
    styleButtonsNavbar();
    var x = document.querySelector("ul.estudantes-curso-lista-opcoes");
    if (x == null){
        console.log("x is null");
    }
    if (x != null) {
        console.log("x is not null");
        x.style = `
        background: none !important;
        border: none !important;
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 0.7rem !important;; 
        padding: 0 !important;
        `;

    }
}

// ------------------------
// Table Percurso Académico
// ------------------------

const styleTableSizes = () => {
    

}
const styleTablePercursoAcademico = () => {
    styleTableSizes();
}


export const profileChanges = () => {

    hideSociodemographicData();
    hideCurricularUnitTab();
    renameStatusAndFrequency();    
    styleNavbar();
    
    if (window.location.href.toLowerCase().includes( "/fest_geral.curso_percurso_academico_view")){
        alignGPAandECTs();
        hideLegend();
        defaultCurrentYear();
        titleTableAcademicJourney();
        reduceTableAcademicJourney();
        linkToGradeResults();
        linkToCurrUnit();
        styleTablePercursoAcademico();

    }

}

