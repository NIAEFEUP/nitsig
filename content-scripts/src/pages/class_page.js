import { fetchSigarraPage } from "../modules/utilities/pageUtils";
import { getPath } from "../modules/utilities/sigarra";

const removeExtras = () => {
    document.querySelector("#conteudoinner > h2").remove();
    document.querySelector("#conteudoinner > table:nth-child(5)").remove();
    document.querySelectorAll("#conteudoinner br").forEach( x => x.remove());
}

const titleClick = (table, title) => {
    if (title.dataset.expand == "true") {
        title.dataset.expand = "false";
        table.style.gridTemplateRows = "0fr";
    } else {
        title.dataset.expand = "true";
        table.style.gridTemplateRows = "1fr";
    }
}

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
    wrapper.classList.add("dialogContentWrapper")
    closeButton.addEventListener("click", () => {
        dialog.close();
    })

    wrapper.appendChild(closeButton);
    wrapper.appendChild(table);
    dialog.appendChild(wrapper);

    return dialog;
}

const createPhotosButton = (icon, dialog) => {
    const button = document.createElement("span");
    button.appendChild(icon);
    button.classList.add("photosButton");

    button.addEventListener("click", (event) => {
        event.stopPropagation();
        dialog.showModal();
    });

    return button;
}

const getPhotosLink = (title) => {
    return title.children[2].href;
}

const editTitle = async (title, table, dialog) => {   
    const titleText = document.createElement("h3");
    const leftSide = document.createElement("div");
    const chevron = document.createElement("span");
    chevron.classList.add("ri-arrow-up-s-line", "rightChevron");
    leftSide.classList.add("titleContent");
    
    const titleContent = title.children[0];
    const className = titleContent.innerText.replaceAll(String.fromCharCode(160), '');
    const classLinks = titleContent.children;

    titleText.classList.add("classTitle");
    leftSide.appendChild(titleText);

    titleText.innerText = className;
    leftSide.appendChild(classLinks[0]); // email button
    
    const photosButton = createPhotosButton(classLinks[1].children[0], dialog); // photos button
    leftSide.appendChild(photosButton);
    
    title.appendChild(leftSide);
    title.appendChild(chevron);

    titleContent.remove();
    title.addEventListener("click", () => titleClick(table, title));
}

const groupClasses = async () => {
    const parent = document.querySelector("#conteudoinner");
    let titleIndex = 5, tableIndex = 6, classIndex = 0;
    let title = document.querySelector(`#conteudoinner > h3:nth-child(${titleIndex})`);
    let table = document.querySelector(`#conteudoinner > table:nth-child(${tableIndex})`);
    
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
        
        editTitle(titleWrapperElement, tableWrapperElement, photosDialog);
        titleWrapperElement.dataset.expand = "true";

        titleIndex++;
        tableIndex++;
        classIndex++;

        title = document.querySelector(`#conteudoinner > h3:nth-child(${titleIndex})`);
        table = document.querySelector(`#conteudoinner > table:nth-child(${tableIndex})`);
    }
}

export const classPage = () => {
    const path = getPath();
    if(!path.includes("it_listagem.lista_turma_disciplina")) return;

    removeExtras();
    groupClasses();
}