import { injectOverrideFunctions } from "./initialize";
import { lcmAll } from "./utilities/math";
import removeElement from "./utilities/removeElement";

const CLASS_TYPE_TO_ABBR = {
    "Teórica": "TE",
    "Teórico-Prática": "TP",
    "Prática": "P",
    "Laboratório": "PL",
    "Orientação Tutorial": "OT",
    "Prática Laboratorial": "PL",
    "Almoço": "almoco",
};
const CLASS_TYPE_TO_ABBR_OVERLAPPING = {
    "Teórica": "T",
    "Teórico-Prática": "TP",
    "Prática": "P",
    "Laboratório": "PL",
    "Orientação Tutorial": "OT",
    "Prática Laboratorial": "PL"
};
const CLASS_ABBR_TO_ABBR = {
    "T": "TE",
    "TP": "TP",
    "P": "P",
    "PL": "PL",
    "OT": "OT",
    "PL": "PL"
};

const improveSchedule = () => {
    /** @type {HTMLTableElement} */
    const scheduleElem = document.querySelector(".horario");

    // Not on the schedule page, abort
    if (!scheduleElem) return;

    const layout = document.querySelector("#conteudoinner");
    /** @type {HTMLTableElement} */
    const overlapping = document.querySelector("table.dados");

    layout
        .querySelectorAll(":scope > :is(h2, h3, table)")
        .forEach((e) => e.remove());

    layout.append(scheduleElem);

    fixClasses(scheduleElem);
    fixScheduleTable(scheduleElem);
    fixOverlappingClasses(scheduleElem, overlapping);
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

    // Change almoço to target the row itself
    table.querySelectorAll(".almoco").forEach((e) => {
        e.parentElement.classList.add("almoco");
        e.classList.remove("almoco");
    });

    // Add another row at the start
    const body = table.querySelector("tbody");
    const newRow = document.createElement("tr");

    for (let i = 0; i < 6; ++i) {
        const cell = document.createElement("td");
        cell.classList.add("horas");
        cell.innerHTML = "&nbsp;"; // ew
        newRow.append(cell);
    }
    body.insertBefore(newRow, body.firstElementChild);

    // Remove time headers
    table.querySelectorAll("td.k").forEach((e) => e.remove());

    /** @type {int[][]} */
    const rows = [];

    body.querySelectorAll("tr").forEach((e, i) => {
        rows[i] ??= [1, 2, 3, 4, 5, 6];

        // Add column info to cells (useful later)
        e.querySelectorAll("td").forEach((c, j) => {
            const weekday = rows[i].shift();
            c.dataset.seWeekday = weekday;
            c.dataset.seRows = `${i}`;

            for (let k = i + 1; k < i + c.rowSpan; ++k) {
                rows[k] = (rows[k] ?? [1, 2, 3, 4, 5, 6]).filter(
                    (x) => x != weekday
                );
                c.dataset.seRows += ` ${k}`;
            }
        });

        // Replace time header with actual header
        const timeHeader = document.createElement("th");
        timeHeader.scope = "row";

        const hour = String(Math.floor((i + 1)/2) + 7).padStart(2, "0");
        const minute = i%2 ? "00" : "30";

        const span = document.createElement("span");
        span.innerText = `${hour}:${minute}`;
        span.classList.add("acs");
        timeHeader.append(span);
        
        if (minute == "00") 
            timeHeader.dataset.seHourRule = `${hour}:${minute}`;

        e.insertBefore(timeHeader, e.firstElementChild);
    })

    // Add borders between columns before adding overlapping classes
    body.querySelectorAll("td").forEach((e) => e.classList.add("column-start"));
};

const createClass = (name, clazz, room, teacher) => {
    const wrapper = document.createElement("div");
    wrapper.append(name, clazz, room, teacher);

    return wrapper;
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

        e.replaceChildren(createClass(className, classClass, classRoom, classTeacher));
    })
};

const getClassDuration = async (url) => {
    const r = await fetch(url);

    const decoder = new TextDecoder(
        r.headers.get("Content-Type").replace("text/html; charset=", "")
    );
    const text = decoder.decode(await r.arrayBuffer());

    const parser = new DOMParser();
    const html = parser.parseFromString(text, "text/html");

    const ret = {};

    html.querySelectorAll(".horas .formulario tr").forEach(
        (/** @type {HTMLTableRowElement} */ e) => {
            const type =
                CLASS_TYPE_TO_ABBR_OVERLAPPING[
                    e.cells[0].innerText.trim().replace(/s?:$/, "")
                ];
            const time = parseFloat(e.cells[1].innerText.replace(",", "."));
            ret[type] = time;
        }
    );

    return ret;
};

/**
 * @param {HTMLTableElement} table
 * @param {HTMLTableElement} overlapping
 */
const fixOverlappingClasses = async (table, overlapping) => {
    // I hate sigarra so much
    /** @type {Record<string, Record<string, number>>} */
    const durationCache = {};

    /** @type {Record<string, number} */
    const weekdays = {};
    /** @type {NodeListOf<HTMLTableCellElement>} */
    const headers = table.querySelectorAll("thead th");
    headers.forEach((e, i) => (weekdays[e.innerText.trim()] = i));

    console.log(weekdays);

    for (const e of overlapping.querySelectorAll("tr")) {
        // Skip "headers"
        if (e.querySelector("th")) continue;

        // Get class information
        /** @type {HTMLAnchorElement} */
        const className = e.querySelector("[headers=t1] a");
        const classType = /\((.+)\)/.exec(
            e.querySelector("[headers=t1]").innerText
        )[1];
        /** @type {string} */
        const weekday = weekdays[e.querySelector("[headers=t2]").innerText.trim()];
        /** @type {string} */
        const startingTime = e.querySelector("[headers=t3]").innerText;
        const classRoom = e.querySelector("[headers=t4] a");
        const classTeacher = e.querySelector("[headers=t5] a");
        const classClass = e.querySelector("[headers=t6] a");

        const classDuration = (durationCache[className] ??=
            await getClassDuration(className.href))[classType] * 2;

        const row =
            (parseInt(startingTime.slice(0, startingTime.indexOf(":"))) - 7) *
                2 +
            (startingTime.slice(startingTime.indexOf(":")) == "30");

        // Create class cell with the right info and insert it
        const cell = document.createElement("td");
        cell.rowSpan = classDuration;
        cell.classList.add(CLASS_ABBR_TO_ABBR[classType]);
        cell.append(
            createClass(className, classClass, classRoom, classTeacher)
        );
        cell.dataset.seWeekday = weekday;
        cell.dataset.seRows = row;
        for (let i = row + 1; i < row + classDuration; ++i) {
            cell.dataset.seRows += ` ${i}`;
        }

        const tr = table.querySelector(`tr:nth-of-type(${row + 1})`);
        let next = null;

        for (let i = weekday + 1; i < 7; ++i) {
            next = tr.querySelector(`[data-se-weekday="${i}"]`);
            if (next) break; 
        }

        tr.insertBefore(cell, next);
    }

    // Find the number of columns needed per weekday
    const set = new Set();
    for (let i = 1; i < 7; ++i) {
        for (let j = 0; j < 30; ++j) {
            const o = table.querySelectorAll(`[data-se-weekday="${i}"][data-se-rows~="${j}"]`);
            set.add(o.length);
        }
    }

    const span = lcmAll(...set);

    // Resize columns to the right size
    headers.forEach((e, i) => i && (e.colSpan = span));
    table.querySelectorAll("col").forEach((e, i) => i && (e.span = span));
    table.querySelectorAll("[data-se-weekday][data-se-rows]").forEach((e) => e.colSpan = span);
    for (let i = 1; i < 7; ++i) {
        for (let j = 0; j < 30; ++j) {
            const o = table.querySelectorAll(`[data-se-weekday="${i}"][data-se-rows~="${j}"]`);
            o.forEach((c) => c.colSpan = Math.min(span/o.length, c.colSpan));
        }
    }

    // Insert spaces where needed
    // FIXME: Still not perfect, in this page the space in row 4 should be inserted first, not last
    // https://sigarra.up.pt/feup/pt/HOR_GERAL.UCURR_VIEW?pv_ocorrencia_id=501662&pv_ano_lectivo=2022&pv_periodos=2
    for (let i = 1; i < 7; ++i) {
        for (let j = 0; j < 30; ++j) {
            const o = table.querySelectorAll(`[data-se-weekday="${i}"][data-se-rows~="${j}"]`);
            let s = 0;
            o.forEach((c) => s += c.colSpan);
            
            if (s < span) {
                const space = document.createElement("td");
                space.colSpan = span - s;

                const tr = table.querySelector(`tr:nth-of-type(${j + 1})`);
                let next = null;
                for (let k = i + 1; k < 7; ++k) {
                    next = tr.querySelector(`[data-se-weekday="${k}"]`);
                    if (next) break; 
                }

                tr.insertBefore(space, next);
            }
        }
    }
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
    
    for (const type of Object.keys(CLASS_TYPE_TO_ABBR)) {
        const classDiv = document.createElement("div");
        classDiv.className = "legend-class-item";

        const abbrv = document.createElement("p");
        classDiv.innerHTML = type;
        classDiv.id = CLASS_TYPE_TO_ABBR[type];
        if (type != "Almoço") {
            abbrv.innerHTML = CLASS_TYPE_TO_ABBR[type];
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
