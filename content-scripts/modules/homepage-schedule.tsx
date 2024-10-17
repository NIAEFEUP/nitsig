// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";
import { getUP } from "./utilities/sigarra";
import { Lecture } from "../types";

// TODO: probably move this somewhere else
const getWeek: (date: Date) => number = function (date) {
    const newYear = new Date(date.getFullYear(), 0, 1);
    let day = newYear.getDay(); //the day of week the year begins on
    day = day >= 0 ? day : day + 7;
    const daynum =
        Math.floor(
            (date.getTime() -
                newYear.getTime() -
                (date.getTimezoneOffset() - newYear.getTimezoneOffset()) *
                    60000) /
                86400000,
        ) + 1;
    let weeknum;
    //if the year starts before the middle of a week
    if (day < 4) {
        weeknum = Math.floor((daynum + day - 1) / 7) + 1;
        if (weeknum > 52) {
            const nYear = new Date(date.getFullYear() + 1, 0, 1);
            let nday = nYear.getDay();
            nday = nday >= 0 ? nday : nday + 7;
            /*if the next year starts before the middle of
                the week, it is week #1 of that year*/
            weeknum = nday < 4 ? 1 : 53;
        }
    } else {
        weeknum = Math.floor((daynum + day - 1) / 7);
    }
    return weeknum;
};

const Schedule: (up: string) => Element = (up) => {
    const current_year: number = new Date().getFullYear();

    const schedule_url: (up: string) => string = (up: string) =>
        `https://sigarra.up.pt/feup/pt/hor_geral.estudantes_view?pv_num_unico=${up}&pv_ano_lectivo=${current_year}&pv_periodos=1`;

    return (
        <iframe
            src={schedule_url(up)}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="auto"
            style="display: none;"
            id="main-page-schedule"
        />
    );
};

export const addMainPageSchedule = async () => {
    const up = getUP();
    const schedule = Schedule(up);
    document.body.appendChild(schedule);

    const scheduleIframe = document.getElementById(
        "main-page-schedule",
    ) as HTMLIFrameElement;

    const json = await new Promise((resolve) => {
        scheduleIframe.onload = resolve;
        return;
    }).then(async () => {
        const api_url = scheduleIframe?.contentWindow?.document
            .getElementById("cal-shadow-container")
            ?.getAttribute("data-evt-source-url");

        const res = await fetch(api_url as string);
        return res.json();
    });

    const weeks_map: Map<number, Array<Lecture>> = new Map();
    json.data.forEach((lecture: Lecture) => {
        const start = getWeek(new Date(lecture.start));
        if (weeks_map.has(start)) {
            weeks_map.get(start)?.push(lecture);
        } else {
            weeks_map.set(start, [lecture]);
        }
    });

    // TODO: create the actual schedule element
    console.log(weeks_map);
};
