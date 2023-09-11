import { lcmAll } from "./utilities/math";
import { fetchSigarraPage } from "./utilities/pageUtils";

const CLASS_TYPE_TO_ABBR = {
    Teórica: "TE",
    "Teórico-Prática": "TP",
    Prática: "P",
    Laboratório: "PL",
    "Orientação Tutorial": "OT",
    "Trabalho de Campo": "TC",
    Seminário: "S",
    Reservado: "existeexames",
    Outra: "O",
    Almoço: "almoco",
};
const CLASS_ABBR_TO_ABBR = {
    T: "TE",
    TP: "TP",
    P: "P",
    PL: "PL",
    OT: "OT",
    PL: "PL",
    TC: "TC",
    S: "S",
    O: "O",
};

export const improveSchedule = () => {
    /** @type {HTMLTableElement} */
    const scheduleElem = document.querySelector("table.horario");

    // Not on the schedule page, abort
    if (!scheduleElem) return;

    scheduleElem.classList.add("se-loading");

    const layout = document.querySelector("#conteudoinner");
    /** @type {HTMLTableElement} */
    const overlapping = document.querySelector("table.dados");

    fixForm();

    layout
        .querySelectorAll(":scope > :is(h2, h3, table, div)")
        .forEach((e) => e.remove());

    layout.append(scheduleElem);

    fixClasses(scheduleElem);
    fixScheduleTable(scheduleElem);
    createLegend(scheduleElem);
    fixOverlappingClasses(scheduleElem, overlapping);
    scheduleElem.classList.remove("se-loading");
};

/**
 * @param {HTMLTableElement} table
 */
const fixScheduleTable = (table) => {
    // Use thead for the first row
    const head = table.tHead ?? document.createElement("thead");
    head.append(table.querySelector("tr:first-of-type"));
    table.append(head);

    const startingHour = parseInt(table.querySelector(".horas").textContent);

    // Remove "Horas" from the header
    head.querySelector("th:first-of-type").innerText = "";

    // Add colgroup
    const colCount = table.querySelector("tr").childElementCount;
    const colgroup = document.createElement("colgroup");
    table.append(colgroup);

    const today = new Date();
    for (let i = 0; i < colCount; ++i) {
        const col = document.createElement("col");

        if (
            (i > 0 && colCount == 7 && today.getDay() == i) ||
            (colCount == 8 && today.getDay() == i - 1)
        )
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

    for (let i = 1; i < colCount; ++i) {
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

    const defaultRows = [];
    for (let i = 1; i < colCount; ++i) defaultRows.push(i);

    body.querySelectorAll("tr").forEach((e, i) => {
        rows[i] ??= defaultRows.slice();

        // Add column info to cells (useful later)
        e.querySelectorAll("td").forEach((c, j) => {
            const weekday = rows[i].shift();
            c.dataset.seWeekday = weekday;
            c.dataset.seRows = `${i}`;

            for (let k = i + 1; k < i + c.rowSpan; ++k) {
                rows[k] = (rows[k] ?? defaultRows.slice()).filter(
                    (x) => x != weekday
                );
                c.dataset.seRows += ` ${k}`;
            }
        });

        // Replace time header with actual header
        const timeHeader = document.createElement("th");
        timeHeader.scope = "row";

        const hour = (
            (((Math.floor((i + 1) / 2) + startingHour - 1) % 24) + 24) %
            24
        )
            .toString()
            .padStart(2, "0");
        const minute = i % 2 ? "00" : "30";

        const span = document.createElement("span");
        span.innerText = `${hour}:${minute}`;
        span.classList.add("acs");
        timeHeader.append(span);

        timeHeader.dataset.seHourRule = `${hour}:${minute}`;

        e.insertBefore(timeHeader, e.firstElementChild);
    });

    // Add borders between columns before adding overlapping classes
    body.querySelectorAll("td").forEach((e) => e.classList.add("column-start"));
};

const createClass = (name, clazz, room, teacher, reservation) => {
    const wrapper = document.createElement("div");
    if (name?.textContent) wrapper.append(name);
    if (clazz?.textContent) wrapper.append(clazz);
    if (room?.textContent) wrapper.append(room);
    if (teacher?.textContent) wrapper.append(teacher);
    if (reservation) wrapper.append(reservation);

    return wrapper;
};

/**
 * @param {HTMLTableElement} table
 */
const fixClasses = (table) => {
    /** @type {NodeListOf<HTMLTableCellElement>} */
    const classes = table.querySelectorAll(
        "td:is(.TP, .TE, .P, .O, .OT, .PL, .TC, .S, .existeexames)"
    );

    classes.forEach((e) => {
        const className = e.querySelector(":scope b a");
        const classClass = e.querySelector(
            ":scope span.textopequenoc"
        )?.firstChild;
        const classRoom = e.querySelector(":scope table td:first-of-type a");
        const classTeacher = e.querySelector(":scope table td:last-of-type a");
        const classReservation = e.querySelector(
            ":scope acronym > a.acao.detalhar"
        )?.parentElement?.title;

        e.replaceChildren(
            createClass(
                className,
                classClass,
                classRoom,
                classTeacher,
                classReservation
            )
        );
    });
};

const getClassDuration = async (url) => {
    const html = await fetchSigarraPage(url);

    const a = html.querySelector("#conteudoinner > li > a");

    if (a) {
        return await getClassDuration(a.href);
    }

    const ret = new Map();

    html.querySelectorAll(
        ".horario :is(.TP, .TE, .O, .OT, .PL, .TC, .S, .existeexames)"
    ).forEach((/** @type {HTMLTableCellElement} */ e) => {
        const className = e.querySelector("b a").innerText;
        const classClass = e.querySelector("span > a").innerText;
        const classType = e.className;

        ret.set(`${className},${classType},${classClass}`, e.rowSpan);
    });

    return ret;
};

/**
 * @param {HTMLTableElement} table
 * @param {HTMLTableElement} overlapping
 */
const fixOverlappingClasses = async (table, overlapping) => {
    if (!overlapping) return;

    // I hate sigarra so much
    /** @type {Map<any, number>} */
    const durationCache = new Map();

    /** @type {Record<string, number} */
    const weekdays = {};
    /** @type {NodeListOf<HTMLTableCellElement>} */
    const headers = table.querySelectorAll("thead th");
    headers.forEach((e, i) => (weekdays[e.innerText.trim()] = i));

    await Promise.allSettled(
        [...overlapping.querySelectorAll("tr")].map(async (e) => {
            // Skip "headers"
            if (e.querySelector("th")) return;

            // Get class information
            /** @type {HTMLAnchorElement} */
            const className = e.querySelector("[headers=t1] a");
            const classType = /\((.+)\)/.exec(
                e.querySelector("[headers=t1]").innerText
            )[1];
            /** @type {string} */
            const weekday =
                weekdays[e.querySelector("[headers=t2]").innerText.trim()];
            /** @type {string} */
            const startingTime = e.querySelector("[headers=t3]").innerText;
            const classRoom = e.querySelector("[headers=t4] a");
            const classTeacher = e.querySelector("[headers=t5] a");
            const classClass = e.querySelector("[headers=t6] a");

            let classDuration = durationCache.get(
                `${className.innerText},${CLASS_ABBR_TO_ABBR[classType]},${classClass.innerText}`
            );

            if (!classDuration) {
                (await getClassDuration(classClass.href)).forEach(
                    (duration, k) => durationCache.set(k, duration)
                );
                classDuration =
                    durationCache.get(
                        `${className.innerText},${CLASS_ABBR_TO_ABBR[classType]},${classClass.innerText}`
                    ) ?? 1;
            }

            const row =
                (parseInt(startingTime.slice(0, startingTime.indexOf(":"))) -
                    8) *
                    2 +
                (startingTime.slice(startingTime.indexOf(":") + 1) == "30") +
                1;

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
        })
    );

    // Find the number of columns needed per weekday
    const set = new Set();
    for (let i = 1; i < 7; ++i) {
        for (let j = 0; j < 30; ++j) {
            const o = table.querySelectorAll(
                `[data-se-weekday="${i}"][data-se-rows~="${j}"]`
            );
            set.add(o.length);
        }
    }

    const span = lcmAll(...set);

    // Resize columns to the right size
    headers.forEach((e, i) => i && (e.colSpan = span));
    table.querySelectorAll("col").forEach((e, i) => i && (e.span = span));
    table
        .querySelectorAll("[data-se-weekday][data-se-rows]")
        .forEach((e) => (e.colSpan = span));
    for (let i = 1; i < 7; ++i) {
        for (let j = 0; j < 30; ++j) {
            const o = table.querySelectorAll(
                `[data-se-weekday="${i}"][data-se-rows~="${j}"]`
            );
            o.forEach(
                (c) => (c.colSpan = Math.min(span / o.length, c.colSpan))
            );
        }
    }

    table.querySelector("tfoot tr td").colSpan = span * 6 + 1;
    console.log(table.querySelector("tfoot tr td"));

    // Insert spaces where needed
    for (let i = 1; i < 7; ++i) {
        for (let j = 0; j < 30; ++j) {
            const o = table.querySelectorAll(
                `[data-se-weekday="${i}"][data-se-rows~="${j}"]`
            );
            let s = 0;
            o.forEach((c) => (s += c.colSpan));

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

/**
 * @param {HTMLTableElement} table
 */
const createLegend = async (table) => {
    const newLegend = document.createElement("div");
    newLegend.id = "new-legend";

    for (const type of Object.keys(CLASS_TYPE_TO_ABBR)) {
        const classDiv = document.createElement("div");
        classDiv.className = "legend-item";

        classDiv.innerHTML = type;
        classDiv.id = CLASS_TYPE_TO_ABBR[type];

        newLegend.appendChild(classDiv);
    }

    const cell = document.createElement("td");
    cell.colSpan = 7;
    cell.appendChild(newLegend);
    const row = document.createElement("tr");
    row.appendChild(cell);
    const foot = document.createElement("tfoot");
    foot.appendChild(row);
    table.appendChild(foot);
};

const fixForm = async () => {
    /** @type {HTMLFormElement} */
    const form =
        document.querySelector("#conteudoinner > form") ??
        document.createElement("form");
    /** @type {HTMLSelectElement | null} */
    const years = form?.querySelector("select[name=pv_ano_lectivo]");
    /** @type {HTMLSelectElement | null} */
    const period = form?.querySelector("select[name=pv_periodos]");

    const week = document.createElement("select");
    week.name = "p_semana_inicio";

    const currentUrl = new URL(window.location.href);

    document
        .querySelectorAll(":is(.horario-semanas, .escolhersemana) td")
        .forEach((e) => {
            const a = e.querySelector("a");
            const url = new URL(a.href);

            const option = document.createElement("option");
            option.value = url.searchParams.get("p_semana_inicio");
            option.innerText = e.innerText;
            option.selected =
                e.classList.contains("bloco-select") ||
                currentUrl.searchParams.get("p_semana_inicio") == option.value;
            const weekEnd = url.searchParams.get("p_semana_fim");
            if (weekEnd) option.dataset.seWeekEnd = weekEnd;
            week.appendChild(option);
        });

    week.addEventListener("change", (e) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "p_semana_fim";
        input.value = e.target.selectedOptions[0].dataset.seWeekEnd;
        if (input.value) form.appendChild(input);
    });

    [years, period, week].forEach((e) => {
        if (!e) return;

        e.id = e.name;
        e.querySelector("option:empty")?.remove();

        e.addEventListener("change", (_) => form.submit());
    });

    const yearsLabel = document.createElement("label");
    yearsLabel.htmlFor = years?.id;
    yearsLabel.innerText = "Ano Letivo";
    yearsLabel.className = "acs";

    const periodLabel = document.createElement("label");
    periodLabel.htmlFor = period?.id;
    periodLabel.innerText = "Período";
    periodLabel.className = "acs";

    const weekLabel = document.createElement("label");
    weekLabel.htmlFor = week.id;
    weekLabel.innerText = "Semana";
    weekLabel.className = "acs";

    form.method = "get";
    form.classList.add("schedule-form");
    form.textContent = "";

    document.querySelector("#conteudoinner")?.append(form);

    if (years) form.append(yearsLabel, years);
    if (period) form.append(periodLabel, period);
    if (week.children.length > 0) form.append(weekLabel, week);

    new URLSearchParams(window.location.search).forEach((value, key) => {
        if (
            (years && key == "pv_ano_lectivo") ||
            (period && key == "pv_periodos") ||
            (week && (key == "p_semana_inicio" || key == "p_semana_fim"))
        )
            return;

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;

        form.appendChild(input);
    });
};
