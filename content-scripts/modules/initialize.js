import { isDate, reverseDate } from "./utilities/date";

// Append override-functions.js to the page
export const injectOverrideFunctions = () => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("js/override-functions.js");
    document.body.appendChild(script);
};

/**
 * Reverse the date direction
 * Ex: 2023-10-05 to 05-10-2023
 */
export const reverseDateDirection = () => {
    document.querySelectorAll(".data").forEach((date) => {
        if (isDate(date.innerHTML)) {
            date.innerHTML = reverseDate(date.innerHTML);
        }
    });
};

// We are now doing this on our own table component (components/table.tsx), but this still works for regular tables that we didn't reimplement yet
export const addSortTableActions = () => {
    document.querySelectorAll("th").forEach((th) => {
        th.addEventListener("click", () => {
            const table = th.closest("table");
            // Don't sort our tables with this function
            if (table.classList.contains("se-table")) return;
            let index = [...th.parentElement.children].indexOf(th);
            const aditionalColspan =
                parseInt(
                    th.parentElement.children[0].getAttribute("colspan"),
                ) || 1;
            const rows = [...table.querySelectorAll("tr")];

            // Removing header rows
            while (rows.length > 0 && rows[0].classList.length === 0)
                rows.shift();

            // Only sort rows with classList[0] starting with "i" "p" or "d"
            const rowsToSort = rows.filter((row) => {
                if (row.classList.length == 0) return false;
                const firstClass = row.classList[0];
                return (
                    firstClass.startsWith("i") ||
                    firstClass.startsWith("p") ||
                    firstClass.startsWith("d")
                );
            });

            // console.log("rows", rowsToSort)

            index += aditionalColspan - 1;

            if (rowsToSort.length <= 1) return;
            if (rowsToSort[0].querySelectorAll("td").length <= index) return;

            const classes = ["asc", "desc"];
            const currentClasses = th.classList;

            // Remove asc and desc classes from neighbors th
            th.parentElement.querySelectorAll("th").forEach((neighbor) => {
                if (neighbor == th) return;
                neighbor.classList.remove(...classes);
            });

            // Check if the current th has some class from classes
            if (
                currentClasses.length == 0 ||
                !classes.some((c) => currentClasses.contains(c))
            ) {
                th.classList.add(classes[0]);
            } else {
                classes.forEach((c) => th.classList.toggle(c));
            }

            rowsToSort.sort((a, b) => {
                let aValue = a.querySelectorAll("td")[index].innerHTML;
                let bValue = b.querySelectorAll("td")[index].innerHTML;
                if (th.classList.contains("desc"))
                    [aValue, bValue] = [bValue, aValue];

                // Date order
                if (
                    isDate(reverseDate(aValue)) &&
                    isDate(reverseDate(bValue))
                ) {
                    const aDate = new Date(reverseDate(aValue));
                    const bDate = new Date(reverseDate(bValue));
                    if (aDate < bDate) return -1;
                    if (aDate > bDate) return 1;
                    return 0;
                }

                // Alphabetical order
                return aValue.localeCompare(bValue, undefined, {
                    numeric: true,
                    sensitivity: "base",
                });
            });

            rowsToSort.forEach((row) => {
                table.appendChild(row);
            });
        });

        th.style.cursor = "pointer";
    });
};
