const renameStatusAndFrequency = () => {
    const element =
        document.querySelector(".estudantes-curso-opcao:nth-child(4) a") ??
        document.querySelector(".estudantes-curso-opcao:nth-child(4)");
    if (element !== null) {
        element.innerText = "Estatutos / Frequência";
    }
};

const alignGPAandECTs = () => {
    const avgTable = document.querySelector(".caixa > table:first-child");

    if (!avgTable) return;

    const [avg, ects, ectsRecognition] =
        avgTable.querySelectorAll("tr td:last-child");

    const resultsElement = document.createElement("div");
    resultsElement.classList.add("se-results");

    const avgEl = document.createElement("p");
    const avgLabel = document.createElement("span");
    avgLabel.classList.add("se-results-label");
    avgLabel.innerHTML = "Média:";
    const avgValue = document.createElement("span");
    avgValue.classList.add("se-results-value");
    avgValue.innerHTML = avg.innerHTML;
    avgEl.append(avgLabel, " ", avgValue);

    const ectsEl = document.createElement("p");
    const ectsLabel = document.createElement("span");
    ectsLabel.classList.add("se-results-label");
    ectsLabel.innerHTML = "ECTS:";
    const ectsValue = document.createElement("span");
    ectsValue.classList.add("se-results-value");
    ectsValue.innerHTML = ects.innerHTML;
    ectsEl.append(ectsLabel, " ", ectsValue);

    if (parseInt(ectsRecognition.innerHTML) > 0) {
        const ectsRecognitionEl = document.createElement("span");
        ectsRecognitionEl.classList.add("se-results-secondary-value");
        ectsRecognitionEl.innerHTML = `(${ectsRecognition.innerHTML} por reconhecimento)`;
        ectsEl.append(" ", ectsRecognitionEl);
    }

    resultsElement.append(avgEl, ectsEl);
    avgTable.replaceWith(resultsElement);
};

const hideLegend = () => {
    document.querySelector(".caixa > :last-child").style.display = "none";
};

const defaultCurrentYear = () => {
    document
        .querySelector("#tabelapercurso > tbody > tr:first-child > :last-child")
        .click();
};

const titleTableAcademicJourney = () => {
    document.querySelectorAll("#tabelapercurso .l").forEach((elem) => {
        switch (elem.innerHTML) {
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
    });
};

const linkToGradeResults = () => {
    document
        .querySelectorAll("#tabelapercurso tr:is(.i, .p)")
        .forEach((elem) => {
            elem.querySelectorAll("td.n").forEach((e1) => {
                if (
                    e1.classList.contains("aprovado") ||
                    e1.classList.contains("nao-aprovado")
                ) {
                    e1.classList.add("cursormao");
                    e1.onclick = (_) => {
                        elem.querySelector("td a.unidade-curricular").click();
                    };
                }
            });
        });
};

const linkToCurrUnit = () => {
    document
        .querySelectorAll("#tabelapercurso tr:is(.i, .p)")
        .forEach((elem) => {
            elem.querySelectorAll("td.k.t.uc").forEach((e1) => {
                e1.onclick = (e) => {
                    if (e.isTrusted) elem.querySelector("td.k.t a").click();
                };
            });
        });
};

const replaceOptionalPlaceholder = () => {
    const pattern =
        /\d+ U.C. do tipo Unidade curricular da componente (\w+) com um total de (\d+) créditos/;

    const placeholders = document.querySelectorAll(
        "#tabelapercurso td[colspan='6']"
    );

    placeholders.forEach((placeholder) => {
        const match = placeholder.innerHTML.match(pattern);

        if (match) {
            const [, type, credits] = match;

            const yearElement = document.createElement("td");
            yearElement.classList.add("k", "l");

            const periodElement = document.createElement("td");
            periodElement.classList.add("k", "l");

            const codeElement = document.createElement("td");
            codeElement.classList.add("k", "t");

            const nameElement = document.createElement("td");
            nameElement.classList.add("k", "t", "uc");

            const typeElement = document.createElement("td");
            typeElement.classList.add("k", "t");
            typeElement.innerHTML = type;

            const creditsElement = document.createElement("td");
            creditsElement.classList.add("k", "n");
            creditsElement.innerHTML = credits;

            placeholder.replaceWith(
                yearElement,
                periodElement,
                codeElement,
                nameElement,
                typeElement,
                creditsElement
            );
        }
    });
};

// ------------------------
// Table Percurso Académico
// ------------------------

const styleTableSizes = () => {};
const styleTablePercursoAcademico = () => {
    styleTableSizes();
};

export const profileChanges = () => {
    renameStatusAndFrequency();

    if (
        window.location.href
            .toLowerCase()
            .includes("/fest_geral.curso_percurso_academico_view")
    ) {
        alignGPAandECTs();
        hideLegend();
        defaultCurrentYear();
        titleTableAcademicJourney();
        linkToGradeResults();
        linkToCurrUnit();
        styleTablePercursoAcademico();

        replaceOptionalPlaceholder();
    }
};
