import { getPath } from "../modules/utilities/sigarra";
import { Table } from "../components/Table";
import { extractTableData } from "../modules/table";

interface StatusProperties {
    [key: string]: {
        class: string;
        text: string;
    };
}

// TODO: Use our table, create a card component for the balance and NIF and use them
export const currentAccountPage = () => {
    if (getPath() != "gpag_ccorrente_geral.conta_corrente_view") return;

    const contaCorrente = document.getElementById(
        "GPAG_CCORRENTE_GERAL_CONTA_CORRENTE_VIEW",
    );

    if (!contaCorrente) return;

    const tabs = contaCorrente.querySelectorAll(".tab");

    // merge "Crédito" and "Débito" collumns and remove collumns
    tabs.forEach((tab, tab_index) => {
        let creditColumnIndex: number | undefined;
        const columnsToRemove: number[] = [];
        const rows = Array.from(
            tab.querySelectorAll("thead > tr, tbody > tr"),
        ) as HTMLTableRowElement[];
        if (rows.length == 0) return;

        const headerTitles = document.querySelectorAll(
            "ul.ui-tabs-nav > li > a",
        );
        const headerTitlesArray = Array.from(headerTitles).map(
            (title) => title.textContent || "",
        );
        const headerCells = rows[0].querySelectorAll(
            "th",
        ) as NodeListOf<HTMLTableCellElement>;
        headerCells.forEach((th, index) => {
            if (th.innerHTML == "Débito") {
                th.innerHTML = "Valor";
            } else if (th.innerHTML == "Crédito") {
                creditColumnIndex = index;
                // Colspan
                const colSpan = headerCells[0].colSpan;
                if (colSpan > 1) creditColumnIndex += colSpan;
                th.remove();
            }

            // Remove "Valor Pago" Column
            if (th.innerHTML == "Valor Pago") {
                columnsToRemove.push(index + headerCells[0].colSpan - 1);
                th.remove();
            }

            // Remove "Valor em Falta" Column
            if (th.innerHTML == "Valor em Falta") {
                th.innerHTML = "";
                th.colSpan = 1;
                columnsToRemove.push(index + headerCells[0].colSpan - 1);
            }

            // Rename "Juros em Mora" Column
            if (th.innerHTML == "Juros de Mora") {
                th.innerHTML = "Juros";
                // Remove "Juros de Mora" Column in "Juros de mora Proprinas" tab
                if (headerTitlesArray[tab_index] == "Juros de mora Propinas") {
                    columnsToRemove.push(index + headerCells[0].colSpan - 1);
                    th.remove();
                }
            }

            // Remove "Débito em Falta" Column
            if (th.innerHTML == "Débito em Falta") {
                columnsToRemove.push(index + headerCells[0].colSpan - 1);
                th.remove();
            }

            // Remove "Valor em Falta" Column
            if (th.innerHTML == "Documento") {
                th.colSpan = 1;
                columnsToRemove.push(index + headerCells[0].colSpan - 1);
            }

            // Remove "Estado" Column
            if (th.innerHTML == "Estado") {
                columnsToRemove.push(index + headerCells[0].colSpan - 1);
                th.remove();
            }
        });

        rows.shift();

        rows.forEach((row) => {
            const cells = Array.from(
                row.querySelectorAll("td"),
            ) as HTMLTableCellElement[];
            columnsToRemove.forEach((columnIndex) => {
                if (!cells[0].classList.contains("credito")) {
                    cells[columnIndex]?.remove();
                }
            });
        });

        if (creditColumnIndex != undefined) {
            rows.forEach((row, index) => {
                const isGeralExtract =
                    headerTitlesArray[tab_index] == "Extrato Geral";

                const cells = Array.from(
                    row.querySelectorAll("td"),
                ) as HTMLTableCellElement[];
                const debitCell = cells[creditColumnIndex! - 1];

                if (debitCell.innerHTML == "&nbsp;") {
                    debitCell.innerHTML = "";
                    debitCell.classList.add("n");
                    if (isGeralExtract) {
                        debitCell.classList.add("positive");
                        debitCell.innerHTML = "+";
                    }
                    debitCell.innerHTML += cells[creditColumnIndex!].innerHTML;
                } else {
                    if (isGeralExtract) {
                        debitCell.classList.add("negative");
                        debitCell.innerHTML = "-" + debitCell.innerHTML;
                    }
                }
                cells[creditColumnIndex!].remove();
                if (cells[0].classList.contains("credito")) {
                    //remove "Multibanco - SIBS" row
                    //TODO: adicionar data a "pago em"

                    //change the last cell of the last row to the value of the last cell of the current row
                    const lastRowCells = rows[index - 1].querySelectorAll("td");

                    const document_file =
                        cells[cells.length - 1].querySelector("a");
                    if (document_file) {
                        lastRowCells[lastRowCells.length - 1].innerHTML = "";
                        lastRowCells[lastRowCells.length - 1].appendChild(
                            document_file,
                        );
                        lastRowCells[
                            lastRowCells.length - 1
                        ].style.paddingRight = "0.6rem";
                    }
                    row.remove();
                }
            });
        }
    });

    // Change "Data" column position in "Extrato Geral" tab
    const geralExtractTable = document.querySelector("#tab_extracto_geral");
    if (geralExtractTable) {
        geralExtractTable.querySelectorAll("tr").forEach((row) => {
            const cells = [
                ...Array.from(row.querySelectorAll("td")),
                ...Array.from(row.querySelectorAll("th")),
            ];
            // len = cells.length;
            row.insertBefore(cells[1], cells[0]);
        });
    }

    // Switch "Refência" action button to the right
    if (tabs.length > 0) {
        tabs[0].querySelectorAll("tbody > tr").forEach((row) => {
            const cells = [
                ...Array.from(row.querySelectorAll("td")),
                ...Array.from(row.querySelectorAll("th")),
            ];
            const len = cells.length;
            row.insertBefore(cells[len - 1], cells[len - 2]);
        });
    }

    const statusProperties: StatusProperties = {
        Pago: {
            class: "success",
            text: "Pago",
        },
        "Não pago mas prazo ainda não foi excedido": {
            class: "pending",
            text: "Pendente",
        },
        Anulado: {
            class: "cancelled",
            text: "Anulado",
        },
        "Prazo excedido": {
            class: "danger",
            text: "Excedido",
        },
    };

    // Improve the status badge
    tabs.forEach((tab) => {
        tab.querySelectorAll("tbody > tr").forEach((row) => {
            const cells = Array.from(row.querySelectorAll("td"));
            if (cells.length == 0) return;

            // Get title atriuibute from the first cell
            const cellStatus =
                cells[0].querySelector("img")?.getAttribute("title") ?? null;
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

    // Replace original tables with Table component
    tabs.forEach((tab, index) => {
        const originalTable = tab.querySelector("table");
        if (!originalTable) return;

        const { headers, data } = extractTableData(originalTable);
        const tableComponent = Table({
            name: `account_table_${index}`,
            headers,
            data,
        });

        originalTable.parentNode?.replaceChild(
            tableComponent as HTMLElement,
            originalTable,
        );
    });

    // Remove "Movimentos" h2
    contaCorrente.previousElementSibling?.remove();

    // Create Balance and NIF cards
    const saldoElement = document.querySelector(
        ".formulario #span_saldo_total",
    ) as HTMLElement;
    if (!saldoElement) return;

    const saldo = saldoElement.textContent || "";
    const saldoCard = document.createElement("div");
    saldoCard.classList.add("card");
    const title = document.createElement("p");
    title.innerHTML = "Saldo";
    const saldoValue = document.createElement("h3");
    saldoValue.innerHTML = saldo + "€";
    saldoCard.appendChild(title);
    saldoCard.appendChild(saldoValue);

    const nifElements = Array.from(
        document.querySelectorAll(".formulario .formulario-legenda"),
    ).filter((el) => el.innerHTML.includes("N.I.F."));

    if (nifElements.length == 0) return;

    const nif = nifElements[0].nextElementSibling?.innerHTML || "";
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

    return;
};
