const statusProperties = {
    "Pago": {
        class: "success",
        text: "Pago",
    },
    "Não pago mas prazo ainda não foi excedido": {
        class: "pending",
        text: "Pendente",
    },
    "Anulado": {
        class: "cancelled",
        text: "Anulado",
    },
    "Prazo excedido": {
        class: "danger",
        text: "Excedido",
    },
} as const;

const mergeCreditDebit = (tab: HTMLElement, tabIndex: number) => {
    let creditColumnIndex: number | null = null;
    const columnsToRemove: number[] = [];
    const rows = [
        ...tab.querySelectorAll<HTMLTableRowElement>(":is(thead, tbody) > tr"),
    ];
    if (rows.length == 0) return;

    const headerTitles = [
        ...document.querySelectorAll<HTMLAnchorElement>(
            "ul.ui-tabs-nav > li > a",
        ),
    ].map((title) => title.textContent ?? "");
    const headerCells = rows[0]?.querySelectorAll("th");
    headerCells.forEach((th, index) => {
        switch (th.textContent) {
            case "Débito":
                th.textContent = "Valor";
                break;
            case "Crédito": {
                creditColumnIndex = index;
                // Colspan
                const colSpan = headerCells[0].colSpan;
                if (colSpan > 1) creditColumnIndex += colSpan;
                th.remove();
                break;
            }
            case "Valor Pago":
                columnsToRemove.push(index + headerCells[0].colSpan - 1);
                th.remove();
                break;
            case "Valor em Falta":
                th.textContent = "";
                th.colSpan = 1;
                columnsToRemove.push(index + headerCells[0].colSpan - 1);
                break;
            case "Juros de Mora":
                th.textContent = "Juros";
                // Remove "Juros de Mora" Column in "Juros de mora Proprinas" tab
                if (headerTitles[tabIndex] == "Juros de mora Propinas") {
                    columnsToRemove.push(index + headerCells[0].colSpan - 1);
                    th.remove();
                }
                break;
            case "Débito em Falta":
                columnsToRemove.push(index + headerCells[0].colSpan - 1);
                th.remove();
                break;
            case "Documento":
                th.colSpan = 1;
                columnsToRemove.push(index + headerCells[0].colSpan - 1);
                break;
            case "Estado":
                columnsToRemove.push(index + headerCells[0].colSpan - 1);
                th.remove();
                break;
        }
    });

    rows.shift();

    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        columnsToRemove.forEach((columnIndex) => {
            if (!cells[0].classList.contains("credito")) {
                cells[columnIndex].remove();
            }
        });
    });

    rows.forEach((row, index) => {
        if (creditColumnIndex === null) return;

        const isGeralExtract = headerTitles[tabIndex] == "Extrato Geral";

        const cells = row.querySelectorAll("td");
        const debitCell = cells[creditColumnIndex - 1];

        if (debitCell.innerHTML == "&nbsp;") {
            debitCell.innerHTML = "";
            debitCell.classList.add("n");
            if (isGeralExtract) {
                debitCell.classList.add("positive");
                debitCell.innerHTML = "+";
            }
            debitCell.innerHTML += cells[creditColumnIndex].innerHTML;
        } else {
            if (isGeralExtract) {
                debitCell.classList.add("negative");
                debitCell.innerHTML = "-" + debitCell.innerHTML;
            }
        }
        cells[creditColumnIndex].remove();

        if (cells[0].classList.contains("credito")) {
            //remove "Multibanco - SIBS" row
            //TODO: adicionar data a "pago em"

            //change the last cell of the last row to the value of the last cell of the current row
            const lastRowCells = rows[index - 1].querySelectorAll("td");

            const documentFile = cells[cells.length - 1].querySelector("a");
            lastRowCells[lastRowCells.length - 1].innerHTML = "";
            if (documentFile)
                lastRowCells[lastRowCells.length - 1].appendChild(documentFile);
            lastRowCells[lastRowCells.length - 1].style.paddingRight = "0.6rem";

            row.remove();
        }
    });
};

export default () => {
    const contaCorrente = document.querySelector<HTMLElement>(
        "#GPAG_CCORRENTE_GERAL_CONTA_CORRENTE_VIEW",
    );

    if (!contaCorrente) return;

    const tabs = contaCorrente.querySelectorAll<HTMLElement>(".tab");

    // merge "Crédito" and "Débito" columns and remove columns
    tabs.forEach(mergeCreditDebit);

    // Change "Data" column position in "Extrato Geral" tab
    const geralExtractTable = document.querySelector("#tab_extracto_geral");
    geralExtractTable?.querySelectorAll("tr")?.forEach((row) => {
        const cells = row.querySelectorAll("td, th");
        row.insertBefore(cells[1], cells[0]);
    });

    // Switch "Referência" action button to the right
    tabs[0]?.querySelectorAll("tbody > tr")?.forEach((row) => {
        const cells = row.querySelectorAll("td, th");
        const len = cells.length;
        row.insertBefore(cells[len - 1], cells[len - 2]);
    });

    // Improve the status badge
    tabs.forEach((tab) => {
        tab.querySelectorAll("tbody > tr").forEach((row) => {
            const cells = row.querySelectorAll("td");

            // Get title attribute from the first cell
            const cellStatus =
                (cells[0]?.querySelector("img")?.getAttribute("title") as
                    | keyof typeof statusProperties
                    | null) ?? null;
            if (cellStatus == null) return;

            // Creating a new status badge
            const statusDiv = document.createElement("div");
            statusDiv.innerHTML = statusProperties[cellStatus].text;
            statusDiv.classList.add("badge");
            statusDiv.classList.add(
                "badge-" + statusProperties[cellStatus].class,
            );
            statusDiv.title = cellStatus;

            cells[0].innerHTML = statusDiv.outerHTML;
        });
    });

    // Remove "Movimentos" h2
    contaCorrente.previousElementSibling?.remove();

    // Create Balance and NIF cards
    const saldo =
        document.querySelector(".formulario #span_saldo_total")?.textContent ??
        "0";
    const saldoCard = document.createElement("div");
    saldoCard.classList.add("card");
    const title = document.createElement("p");
    title.textContent = "Saldo";
    const saldoValue = document.createElement("h3");
    saldoValue.textContent = saldo + "€";
    saldoCard.appendChild(title);
    saldoCard.appendChild(saldoValue);

    const nif =
        [
            ...document.querySelectorAll<HTMLElement>(
                ".formulario .formulario-legenda",
            ),
        ].filter((el) => el.textContent?.includes("N.I.F."))[0]
            ?.nextElementSibling?.textContent ?? "";
    const nifCard = document.createElement("div");
    nifCard.classList.add("card");
    const nifTitle = document.createElement("p");
    nifTitle.innerHTML = "NIF";
    const nifValue = document.createElement("h3");
    nifValue.innerHTML = nif;
    nifCard.appendChild(nifTitle);
    nifCard.appendChild(nifValue);

    const accountDetails = document.createElement("div");
    accountDetails.style.display = "flex";
    accountDetails.style.gap = "1rem";
    accountDetails.style.marginBottom = "0.5rem";

    accountDetails.appendChild(saldoCard);
    accountDetails.appendChild(nifCard);
    contaCorrente.insertBefore(accountDetails, contaCorrente.firstChild);
};
