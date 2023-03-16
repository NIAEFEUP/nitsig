import { injectOverrideFunctions } from "./initialize";
import removeElement from "./utilities/removeElement";

const improveSchedule = () => {
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

const createWeekDropdown = async () => {
    const blocks  = document.querySelectorAll('td.sem-quebra > a');

    const inputWrapper = document.createElement('div');
    const label = document.createElement('label', {
        for: 'semanas-select',
    });
    const select = document.createElement('select', {
        name: 'semanas-select',
    });
    
    inputWrapper.className = 'dropdown-wrapper';
    label.textContent = 'Semanas ';
    select.name = 'semanas-select';
    label.for = 'semanas-select';
    
    blocks.forEach((block) => {
        let content = block.textContent;
        let href = block.href;
        let opt = document.createElement('option');
        opt.value = href;
        opt.innerText = content;
        if (window.location.href == href) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });

    select.addEventListener('change', (event) => {
        window.location.replace(event.target.value);
    });

    inputWrapper.appendChild(label);
    inputWrapper.appendChild(select);

    const dropdown = document.querySelector('table.tabela ~ h3');
    dropdown.replaceWith(inputWrapper);

}

const createLegend = async () => {
    const oldLegend = document.querySelector('#conteudoinner > table.tabela');
    
    const newLegend = document.createElement('div');
    newLegend.id = 'new-legend';
    
    const classTypes = ["Teórica", "Teórico-Prática", "Prática", "Laboratório", "Orientação Tutorial", "Prática Laboratorial", "Almoço"];
    const classAbbrv = ["TE", "TP", "P", "PL", "OT", "PL"]
    for (const [index, element] of classTypes.entries()) {
        const classDiv = document.createElement("div");
        classDiv.className = "legend-class-item";
        const abbrv = document.createElement("p");
        abbrv.id = `legend-abbrv-${index}`;
        classDiv.innerHTML = element;
        if (element != "Almoço") {
            classDiv.id = classAbbrv[index];
            abbrv.innerHTML = classAbbrv[index];
        } else {
            classDiv.id = 'almoco';
        }

        classDiv.appendChild(abbrv);
        newLegend.appendChild(classDiv);
        
    }
    
    oldLegend.replaceWith(newLegend);

}

const createYearPeriodDropdown = async () => {
    const yearsSelect = document.querySelector('#conteudoinner > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select');
    const periodSelect = document.querySelector('#conteudoinner > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > select');
    const oldForm = document.querySelector('#conteudoinner > form');
    const div = document.createElement('div');
    const url = new URL(window.location.href);
    div.id = 'year-period';
    div.appendChild(yearsSelect);
    div.appendChild(periodSelect);
    yearsSelect.addEventListener('change', (event) => {
        url.searchParams.set('pv_ano_lectivo', event.target.value)
        console.log(url);
        window.location.replace(url);
    });
    periodSelect.addEventListener('change', (event) => {
        url.searchParams.set('pv_periodos', event.target.value)
        console.log(url);
        window.location.replace(url);
    });

    oldForm.replaceWith(div);
    removeElement('#conteudoinner > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select');

}

export const changeSchedule = async () => {
    createWeekDropdown();
    createLegend();
    createYearPeriodDropdown();
    improveSchedule();
}