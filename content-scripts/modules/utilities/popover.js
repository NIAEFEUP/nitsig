let popoverId = 0;

export const createPopover = (popover, target = popover) => {
    const id = popoverId++;

    popover.addEventListener(`popover-close:${id}`, (e) => e.stopPropagation());

    document.addEventListener(`popover-close:${id}`, () => {
        target?.classList.remove("se-popover-open");
        document.removeEventListener("click", close, {
            capture: true,
        });
    });

    const close = (/** @type {Event} */ e) =>
        e.target?.dispatchEvent(
            new CustomEvent(`popover-close:${id}`, { bubbles: true })
        );

    const fn = (/** @type {Event} */ e) => {
        if (target?.classList.contains("se-popover-open")) return;

        target?.classList.add("se-popover-open");
        document.addEventListener("click", close, {
            capture: true,
        });
    };

    return fn;
};
