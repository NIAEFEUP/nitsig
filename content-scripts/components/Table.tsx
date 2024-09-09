import jsx from "texsaur";
import { isDate, reverseDate } from "../modules/utilities/date.js";

// Props for the Table component
interface TableProps {
    // content may be a JSX component or a string
    name: string;
    headers: [string, (string | Element)][];
    data: (string | Element)[][];
}

export const Table:JSX.Component<TableProps> = ({ name, headers, data }) => {
    const headerKeys = headers.map((header) => header[0]);

    const sortHeader = (event: any) => {        
        const states = ["asc", "desc"];
        let table = document.querySelector(`[aria-name=${name}]`)!;
        const rows = Array.from(table.querySelectorAll("tbody tr"));
        
        let el = event.target as HTMLElement;
        // Checking if a button/anchor within the th was clicked
        if (el.parentElement?.tagName != "TH" && (el.tagName == "BUTTON" || el.tagName == "A")) return;
        // It was not a button therefore we need to find the original button
        if (el.tagName !== "TH") el = el.closest(".se-sort-button")!;

        let currentState = el.getAttribute("aria-sort");
        const key = el.getAttribute("aria-key");

        if (currentState === "none") {
            el.setAttribute("aria-sort", "asc");
            currentState = "asc";
        } else {
            const nextState = states[(states.indexOf(currentState || "") + 1) % 2];
            el.setAttribute("aria-sort", nextState);
            currentState = nextState;
        }

        rows.sort((a: Element, b: Element): number => {
            let aValue = a.querySelector(`td[key=${key}]`)!.innerHTML;
            let bValue = b.querySelector(`td[key=${key}]`)!.innerHTML;
            
            if(currentState == "desc") [aValue, bValue] = [bValue, aValue];

            // Date order
            if(isDate(reverseDate(aValue)) && isDate(reverseDate(bValue))){
                const aDate = new Date(reverseDate(aValue));
                const bDate = new Date(reverseDate(bValue));
                if(aDate < bDate) return -1;
                if(aDate > bDate) return 1;
                return 0;
            }
    
            // Alphabetical order
            return aValue.localeCompare(bValue, undefined, {
                numeric: true,
                sensitivity: 'base'
            });
        });

        rows.forEach((row) => {
            table.querySelector("tbody")!.appendChild(row);
        });
    }

    return (
        <table class="se-table" aria-name={name}>
        <thead>
            <tr>
            {headers.map(([key, value]) => (
                <th class="se-table-header" key={key}>
                    <button class="se-sort-button" aria-key={key} aria-sort="none" onclick={sortHeader}>
                        {value}
                    </button>
                </th>
            ))}
            </tr>
        </thead>
        <tbody>
            {data.map((row, index) => (
            <tr key={index}>
                {row.map((cell, index) => (
                    <td key={headerKeys[index]}>{cell}</td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    );
}