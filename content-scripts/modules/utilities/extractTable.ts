// Extracts table data from an HTML table element
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
            combinedContent.style.display = "flex";
            combinedContent.style.flexDirection = "row";
            combinedContent.style.gap = "4em";
            combinedContent.style.alignItems = "center";

            cells.slice(0, 3).forEach((cell) => {
                const processedCell = processCell(cell);
                const cellWrapper = document.createElement("div");

                if (processedCell instanceof Element) {
                    cellWrapper.appendChild(processedCell);
                } else if (processedCell) {
                    const textElement = document.createElement("span");
                    textElement.textContent = processedCell;
                    cellWrapper.appendChild(textElement);
                }

                combinedContent.appendChild(cellWrapper);
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
