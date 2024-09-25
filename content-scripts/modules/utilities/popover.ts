export const togglePopover = (popoverId: string) => {
    const popover = document.getElementById(popoverId);
    if (!popover) return;

    const menuDivs = document.querySelectorAll('div[id$="-menu"]');
    menuDivs.forEach((div) => {
        if (div !== popover) div.classList.remove("se-popover-open");
    });

    if (popover.classList.contains("se-popover-open")) {
        popover.classList.remove("se-popover-open");
    } else {
        popover.classList.add("se-popover-open");
    }
    return;
};
