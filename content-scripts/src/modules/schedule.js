export const improveSchedule = () => {
    /** @type {HTMLTableElement} */
    const scheduleElem = document.querySelector(".horario");

    // Not on the schedule page, abort
    if (!scheduleElem) return;

    const layout = document.querySelector("#conteudoinner");
    const title = layout.querySelector("h1");
    title.innerText = title.innerText.replace(/\s+de\s+.+/, "");

    layout
        .querySelectorAll(":scope > :is(h2, h3, table)")
        .forEach((e) => e.remove());

    layout.append(scheduleElem);

    fixScheduleTable(scheduleElem);
    fixClasses(scheduleElem);
};

/**
 * @param {HTMLTableElement} table
 */
const fixScheduleTable = (table) => {
    // Use thead for the first row
    const head = table.tHead ?? document.createElement("thead");
    head.append(table.querySelector("tr:first-of-type"));
    table.append(head);

    // Remove "Horas" from the header
    head.querySelector("th:first-of-type").innerText = "";

    // Add colgroup
    const colgroup = document.createElement("colgroup");
    table.append(colgroup);

    const today = new Date();
    for (let i = 0; i < 7; ++i) {
        const col = document.createElement("col");

        if (today.getDay() == i)
            col.classList.add("today");

        colgroup.append(col);
    }

    // Only show time on 1 hour intervals
    const body = table.querySelector("tbody");
    const newRow = document.createElement("tr");

    for (let i = 0; i < 6; ++i) {
        const cell = document.createElement("td");
        cell.classList.add("horas");
        cell.innerHTML = "&nbsp;"; // ew
        newRow.append(cell);
    }

    body.insertBefore(newRow, body.firstElementChild);

    table
        .querySelectorAll("td.k")
        .forEach((/** @type {HTMLTableCellElement} */ e) => {
            if (/^\d{2}:00/.test(e.innerText)) {
                e.innerText = e.innerText.substring(0, 5);
                e.rowSpan = 2;
                // Move to previous row
                const row = e.parentElement.previousElementSibling;
                row.insertBefore(e, row.firstElementChild);
            } else {
                e.remove();
            }
        });
};

/**
 * @param {HTMLTableElement} table
 */
const fixClasses = (table) => {
    // TODO: Check if any class types are missing
    /** @type {NodeListOf<HTMLTableCellElement>} */
    const classes = table.querySelectorAll("td:is(.TP, .TE, .OT, .PL)");

    classes.forEach((e) => {
        const className = e.querySelector("b a");
        const classClass = e.querySelector("span > a");
        const classRoom = e.querySelector("table td:first-of-type a");
        const classTeacher = e.querySelector("table td:last-of-type a");

        const wrapper = document.createElement("div");
        wrapper.append(className, classClass, classRoom, classTeacher);

        e.replaceChildren(wrapper);
    })
};
