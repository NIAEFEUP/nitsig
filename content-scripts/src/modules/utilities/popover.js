/**
 * @param {HTMLElement} popover
 * @param {HTMLElement} [target]
 */
export const createPopover = (popover, target = popover) => {
    popover.addEventListener("click", (e) => e.stopPropagation());

    const fn = (/** @type {Event} */ e) => {
        if (target?.classList.toggle("se-popover-open"))
            document.addEventListener("click", fn);
        else document.removeEventListener("click", fn);
        e.stopPropagation();
    };

    return fn;
};
