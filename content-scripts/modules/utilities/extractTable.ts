// Extracts table data from an HTML table element with proper column alignment
export function extractTableData(table: HTMLElement): {
    headers: [string, string | Element][];
    data: (string | Element)[][];
} {
    const headers: [string, string | Element][] = [];
    const data: (string | Element)[][] = [];

    const headerRow =
        table.querySelector("thead tr") || table.querySelector("tr");
    if (headerRow) {
        const headerCells = headerRow.querySelectorAll("th, td");
        headerCells.forEach((cell, index) => {
            const key = `col_${index}`;
            const value = cell.textContent?.trim() || "";
            headers.push([key, value]);
        });
    }

    const tbody = table.querySelector("tbody") || table;
    const rows = tbody.querySelectorAll("tr");
    const startIndex = table.querySelector("thead") ? 0 : 1;

    const hasDescription =
        headerRow?.querySelector('th[colspan="3"]')?.textContent?.trim() ===
            "Descrição" ||
        headerRow?.querySelector('th[colspan="3"]')?.textContent?.trim() ===
            "Description";

    const processCell = (cell: Element): string | Element => {
        if (cell.children.length === 0) {
            return cell.textContent?.trim() || "";
        }
        if (cell.children.length === 1) {
            return cell.firstElementChild!;
        }
        const wrapper = document.createElement("span");
        wrapper.innerHTML = cell.innerHTML;
        return wrapper;
    };

    for (let i = startIndex; i < rows.length; i++) {
        const row = rows[i];
        const cells = Array.from(row.querySelectorAll("td, th"));
        const rowData: (string | Element)[] = [];

        if (hasDescription && cells.length > 0) {
            const combinedContent = document.createElement("div");
            combinedContent.style.display = "grid";
            combinedContent.style.gridTemplateColumns =
                "minmax(6em, max-content) minmax(6em, max-content) 1fr";
            combinedContent.style.gap = "2em";
            combinedContent.style.alignItems = "start";

            const columnsToProcess = cells.slice(0, 3);

            columnsToProcess.forEach((cell) => {
                const columnDiv = document.createElement("div");

                const cellContent = cell.textContent?.trim() || "";
                const hasContent = cellContent || cell.children.length > 0;

                if (cell.children.length === 0) {
                    columnDiv.textContent = cellContent;
                } else if (cell.children.length === 1) {
                    columnDiv.appendChild(
                        cell.firstElementChild!.cloneNode(true),
                    );
                } else {
                    columnDiv.innerHTML = cell.innerHTML;
                }

                if (!hasContent) {
                    columnDiv.style.display = "none";
                }

                combinedContent.appendChild(columnDiv);
            });
            rowData.push(combinedContent);

            cells.slice(3).forEach((cell) => {
                rowData.push(processCell(cell));
            });
        } else {
            cells.forEach((cell) => {
                rowData.push(processCell(cell));
            });
        }

        if (rowData.length > 0) {
            data.push(rowData);
        }
    }

    return { headers, data };
}
