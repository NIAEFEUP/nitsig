/**
 * @param {HTMLElement} pagination
 */
const replacePagination = (pagination) => {
    const prevLinks = pagination.querySelectorAll(
        ".paginar-paginas-anteriores a"
    );
    const nextLinks = pagination.querySelectorAll(
        ".paginar-paginas-posteriores a"
    );
    const current = pagination.querySelector(".paginar-paginas-atual span");

    const icons = pagination.querySelector(
        ".paginar-saltar-barra-posicao"
    )?.children;

    const first = icons?.[0]?.querySelector("a");
    const last = icons?.[4]?.querySelector("a");
    const prev = icons?.[2]?.children?.[0];
    const next = icons?.[2]?.children?.[2];

    const newPagination = document.createElement("nav");
    newPagination.classList.add("se-pagination");

    if (first) {
        const firstIcon = document.createElement("span");
        firstIcon.classList.add("se-icon", "ri-skip-back-line");
        first.replaceChildren(firstIcon);
        newPagination.append(first);
    }

    if (prev?.tagName === "A") {
        const prevIcon = document.createElement("span");
        prevIcon.classList.add("se-icon", "ri-arrow-left-s-line");
        prev.replaceChildren(prevIcon);
        newPagination.append(prev);
    }

    prevLinks.forEach((link) => newPagination.append(link));

    if (current) newPagination.append(current);

    nextLinks.forEach((link) => newPagination.append(link));

    if (next?.tagName === "A") {
        const nextIcon = document.createElement("span");
        nextIcon.classList.add("se-icon", "ri-arrow-right-s-line");
        next.replaceChildren(nextIcon);
        newPagination.append(next);
    }

    if (last) {
        const lastIcon = document.createElement("span");
        lastIcon.classList.add("se-icon", "ri-skip-forward-line");
        last.replaceChildren(lastIcon);
        newPagination.append(last);
    }

    pagination.replaceWith(newPagination);
};

export const fixPagination = () =>
    document.querySelectorAll(".paginar").forEach(replacePagination);
