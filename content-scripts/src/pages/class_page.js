import { fetchSigarraPage } from "../modules/utilities/pageUtils";

const removeExtras = () => {
    document.querySelector("#conteudoinner > h2").remove();
    document.querySelector("#conteudoinner > table:nth-child(5)").remove();
    document.querySelectorAll("#conteudoinner br").forEach( x => x.remove());
}

const titleClick = (table) => {
    if (table.dataset.expand == "true") {
        table.dataset.expand = "false";
    } else {
        table.dataset.expand = "true";
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
    closeButton.innerText = "X";
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
    const titleContent = title.children[0];
    const className = titleContent.innerText.replaceAll(String.fromCharCode(160), '');
    const classLinks = titleContent.children;

    titleText.classList.add("classTitle");
    title.appendChild(titleText);

    titleText.innerText = className;
    title.appendChild(classLinks[0]); // email button
    
    const photosButton = createPhotosButton(classLinks[1].children[0], dialog); // photos button
    title.appendChild(photosButton);

    titleContent.remove();
    title.addEventListener("click", () => titleClick(table));
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
        tableWrapperElement.dataset.expand = "true";

        titleIndex++;
        tableIndex++;
        classIndex++;

        title = document.querySelector(`#conteudoinner > h3:nth-child(${titleIndex})`);
        table = document.querySelector(`#conteudoinner > table:nth-child(${tableIndex})`);
    }
}

export const classPage = () => {
    removeExtras();
    groupClasses();
}