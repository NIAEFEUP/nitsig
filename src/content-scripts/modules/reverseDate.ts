import { selectorModule } from "./base/selector";

export default selectorModule(".data", (date) => {
    const dateObj = new Date(date.textContent ?? "");

    if (dateObj instanceof Date && !isNaN(dateObj.getTime()))
        date.innerHTML = dateObj
            .toLocaleDateString("pt-PT")
            .replace(/\//g, "-");
});
