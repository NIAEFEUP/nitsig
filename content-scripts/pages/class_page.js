import { fetchSigarraPage } from "../modules/utilities/pageUtils";
import { getPath } from "../modules/utilities/sigarra";

const removeExtras = () => {
    document.querySelector("#conteudoinner > h2").remove();
    document.querySelectorAll("#conteudoinner br").forEach((x) => x.remove());
};

const titleClick = (table, title) => {
    if (title.dataset.expand == "true") {
        title.dataset.expand = "false";
        table.style.height = "0px";
    } else {
        title.dataset.expand = "true";
        table.style.height = "100%";
    }
};

const createPhotosDialog = async (title, index) => {
    const dialog = document.createElement("dialog");
    const wrapper = document.createElement("div");
    const closeButton = document.createElement("span");

    const url = getPhotosLink(title);

    const html = await fetchSigarraPage(url);
    const table = html.querySelector("#layout0 > table");

    dialog.id = "photosDialog" + index;
    closeButton.classList.add("closeDialog");
    closeButton.classList.add("ri-close-line");
    wrapper.classList.add("dialogContentWrapper");
    closeButton.addEventListener("click", () => {
        dialog.close();
    });

    wrapper.appendChild(closeButton);
    wrapper.appendChild(table);
    dialog.appendChild(wrapper);

    return dialog;
};

const createPhotosButton = (icon, title, classIndex) => {
    const button = document.createElement("span");
    button.appendChild(icon);
    button.classList.add("photosButton");

    button.addEventListener("click", async (event) => {
        event.stopPropagation();
        // HERE
        const dialog = await createPhotosDialog(title, classIndex);

        dialog.showModal();
    });

    return button;
};

const getPhotosLink = (title) => {
    console.log(title);

    return title.children[2].href;
};

const editTitle = async (title, table, enrolled, enrolledText, classIndex) => {
    const titleText = document.createElement("h3");
    const enrolledQnt = document.createElement("h3");
    const leftSide = document.createElement("div");
    const chevron = document.createElement("span");
    chevron.classList.add("ri-arrow-up-s-line", "rightChevron");
    leftSide.classList.add("titleContent");

    const titleContent = title.children[0];
    const className = titleContent.innerText.replaceAll(
        String.fromCharCode(160),
        "",
    );
    const classLinks = titleContent.children;

    titleText.classList.add("classTitle");
    leftSide.appendChild(titleText);

    titleText.innerText = className;
    leftSide.appendChild(classLinks[0]); // email button

    const photosButton = createPhotosButton(
        classLinks[1].children[0],
        title,
        classIndex,
    ); // photos button
    leftSide.appendChild(photosButton);

    enrolledQnt.classList.add("classTitle");
    enrolledQnt.innerText = `${enrolled} ${enrolledText.toLowerCase()}`;

    title.appendChild(leftSide);
    title.appendChild(chevron);
    leftSide.appendChild(enrolledQnt);

    titleContent.remove();
    title.addEventListener("click", () => titleClick(table, title));
};

/**
 *
 * @param {Element} enrolledTable
 *
 */
const groupClasses = async (enrolledTable) => {
    const parent = document.querySelector("#conteudoinner");
    let titleIndex = 5,
        tableIndex = 6,
        classIndex = 0,
        enrolledIndex = 2;
    let title = document.querySelector(
        `#conteudoinner > h3:nth-child(${titleIndex})`,
    );
    let enrolled = enrolledTable.querySelector(
        `td.l:nth-child(${enrolledIndex})`,
    ).textContent;
    let enrolledText = enrolledTable.querySelector(
        "tbody > tr.d > td.k.t",
    ).textContent;
    let table = document.querySelector(
        `#conteudoinner > table:nth-child(${tableIndex})`,
    );

    while (title || table) {
        const groupElement = document.createElement("section");
        const tableWrapperElement = document.createElement("div");
        const titleWrapperElement = document.createElement("div");
        const photosDialog = await createPhotosDialog(title, classIndex);

        parent.insertBefore(groupElement, title);
        groupElement.classList.add("classWrapper");
        tableWrapperElement.classList.add("tableWrapper");
        titleWrapperElement.classList.add("titleWrapper");

        title.remove();
        table.remove();

        titleWrapperElement.appendChild(title);
        tableWrapperElement.appendChild(table);
        groupElement.appendChild(titleWrapperElement);
        groupElement.appendChild(tableWrapperElement);
        groupElement.appendChild(photosDialog);

        editTitle(
            titleWrapperElement,
            tableWrapperElement,
            enrolled,
            enrolledText,
            classIndex,
        );
        titleWrapperElement.dataset.expand = "true";

        titleIndex++;
        tableIndex++;
        classIndex++;
        enrolledIndex++;

        title = document.querySelector(
            `#conteudoinner > h3:nth-child(${titleIndex})`,
        );
        table = document.querySelector(
            `#conteudoinner > table:nth-child(${tableIndex})`,
        );
        enrolled = enrolledTable.querySelector(
            `td.l:nth-child(${enrolledIndex})`,
        ).textContent;
    }
};

export const classPage = () => {
    // TODO: remove this check
    const path = getPath();
    if (!path.includes("it_listagem.lista_turma_disciplina")) return;

    removeExtras();
    const enrolledTable = document.querySelector(
        "#conteudoinner > table:nth-child(5)",
    );
    enrolledTable.remove();
    groupClasses(enrolledTable);
};
