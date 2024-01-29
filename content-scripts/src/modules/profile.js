const renameStatutesAndAttendance = () => {
    // TODO: English
    const element =
        document.querySelector(".estudantes-curso-opcao:nth-child(4) a") ??
        document.querySelector(".estudantes-curso-opcao:nth-child(4)");
    if (element !== null) {
        element.innerText = "Estatutos / Frequência";
    }
};

const replaceResultsTable = () => {
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

    const yearlyAvgEl = document.createElement("p");
    yearlyAvgEl.style.display = "none";
    const yearlyAvgLabel = document.createElement("span");
    yearlyAvgLabel.classList.add("se-results-label");
    const yearlyAvgValue = document.createElement("span");
    yearlyAvgValue.classList.add("se-results-value");
    yearlyAvgEl.append(yearlyAvgLabel, " ", yearlyAvgValue);

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

    resultsElement.append(avgEl, yearlyAvgEl, ectsEl);
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

const addTooltips = () => {
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

const replaceUCLinks = () => {
    document
        .querySelectorAll("#tabelapercurso tr:is(.i, .p)")
        .forEach((elem) => {
            const name = elem.querySelector("td.uc");
            const code = elem.querySelector("td.t");
            const results = elem.querySelectorAll("td.n:not(.k)");

            if (!name || !code || !results) return;

            const nameLink = name.querySelector("a");
            const codeLink = code.querySelector("a");

            results.forEach((result) => {
                const link = nameLink.cloneNode(false);
                link.innerHTML = result.innerHTML;
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nameLink.click();
                });

                result.replaceChildren(link);
            });

            code.innerHTML = codeLink.innerHTML;

            codeLink.innerHTML = nameLink.innerHTML;
            name.replaceChildren(codeLink);
        });
};

const replaceMinorCourseUnitPlaceholders = () => {
    const pattern =
        /\d+ U.C. do tipo Unidade curricular da componente (\w+) com um total de (\d+) créditos/;

    const placeholders = document.querySelectorAll(
        "#tabelapercurso td[colspan='6']"
    );

    placeholders.forEach((placeholder) => {
        const match = placeholder.innerHTML.match(pattern);

        if (match) {
            const [, type, credits] = match;

            // Figure out year and period through some heuristics
            const row = placeholder.parentElement;
            let prevRow = row.previousElementSibling;
            while (prevRow && prevRow.querySelector("td[colspan='6']")) {
                prevRow = prevRow.previousElementSibling;
            }
            let nextRow = row.nextElementSibling;
            while (nextRow && nextRow.querySelector("td[colspan='6']")) {
                nextRow = nextRow.nextElementSibling;
            }

            const prevYear = parseInt(
                prevRow.querySelector("td.k.l:first-child").innerText
            );
            const nextYear = parseInt(
                nextRow.querySelector("td.k.l:first-child").innerText
            );

            const prevPeriod = parseInt(
                prevRow.querySelector("td.k.l:nth-child(2)").innerText
            );
            const nextPeriod = parseInt(
                nextRow.querySelector("td.k.l:nth-child(2)").innerText
            );

            const year =
                nextYear > prevYear && nextPeriod > prevPeriod
                    ? nextYear
                    : prevYear;
            const period = year === nextYear ? nextPeriod : prevPeriod + 1;

            // Fill in the table
            const yearElement = document.createElement("td");
            yearElement.classList.add("k", "l");
            yearElement.innerHTML = year;

            const periodElement = document.createElement("td");
            periodElement.classList.add("k", "l");
            periodElement.innerHTML = period + "S";

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

const changeYearPeriodRowSpan = () => {
    const rows = document.querySelectorAll("#tabelapercurso tr");

    /** @type {HTMLTableCellElement?} */
    let prevYear = null;
    /** @type {HTMLTableCellElement?} */
    let prevPeriod = null;

    rows.forEach((row) => {
        /** @type {HTMLTableCellElement?} */
        const year = row.querySelector("td.k.l:first-child");
        /** @type {HTMLTableCellElement?} */
        const period = row.querySelector("td.k.l:nth-child(2)");

        if (year && period) {
            if (year.innerText === prevYear?.innerText) {
                year.style.display = "none";
                prevYear.rowSpan ??= 1;
                prevYear.rowSpan += 1;
            } else {
                prevYear = year;
            }

            if (period.innerText === prevPeriod?.innerText) {
                period.style.display = "none";
                prevPeriod.rowSpan ??= 1;
                prevPeriod.rowSpan += 1;
            } else {
                prevPeriod = period;
            }
        }
    });
};

const avgForSelectedYear = () => {
    const yearlyAvgEl = document.querySelector(".se-results p:nth-child(2)");
    const yearlyAvgLabel = yearlyAvgEl.querySelector(".se-results-label");
    const yearlyAvgValue = yearlyAvgEl.querySelector(".se-results-value");

    const observer = new MutationObserver((mutations) => {
        const selectedHeader = document.querySelector(
            "#tabelapercurso th.selecionado"
        );

        if (!selectedHeader) {
            yearlyAvgEl.style.display = "none";
            return;
        }

        yearlyAvgEl.style.display = "";

        yearlyAvgLabel.innerHTML = `Média em ${selectedHeader.innerText}:`;

        let credits = 0;
        let sum = 0;

        const rows = document.querySelectorAll(
            "#tabelapercurso tr:not([style*='display: none'])"
        );
        rows.forEach((row) => {
            const creditsEl = row.querySelector("td.n.k");
            const resultEl = row.querySelector("td.n.aprovado");

            if (creditsEl && resultEl) {
                const currentCredits = parseFloat(
                    creditsEl.innerText.replace(",", ".")
                );
                credits += currentCredits;
                sum += parseInt(resultEl.innerText) * currentCredits;
            }
        });

        const result = sum / credits;
        yearlyAvgValue.innerHTML = result.toFixed(2).replace(/\.?0+$/, "");
    });

    const header = document.querySelector("#tabelapercurso tr:first-child");
    if (header)
        observer.observe(header, {
            subtree: true,
            attributes: true,
            attributeFilter: ["class"],
        });
};

export const profileChanges = () => {
    renameStatutesAndAttendance();

    if (
        window.location.href
            .toLowerCase()
            .includes("/fest_geral.curso_percurso_academico_view")
    ) {
        replaceResultsTable();
        avgForSelectedYear();
        hideLegend();
        defaultCurrentYear();
        addTooltips();
        replaceUCLinks();
        replaceMinorCourseUnitPlaceholders();
        changeYearPeriodRowSpan();
    }
};
