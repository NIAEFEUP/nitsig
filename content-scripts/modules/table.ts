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

    for (let i = startIndex; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll("td, th");
        const rowData: (string | Element)[] = [];

        cells.forEach((cell) => {
            if (cell.children.length > 0) {
                if (cell.children.length === 1) {
                    rowData.push(cell.firstElementChild!);
                } else {
                    const wrapper = document.createElement("span");
                    wrapper.innerHTML = cell.innerHTML;
                    rowData.push(wrapper);
                }
            } else {
                rowData.push(cell.textContent?.trim() || "");
            }
        });

        if (rowData.length > 0) {
            data.push(rowData);
        }
    }

    return { headers, data };
}
