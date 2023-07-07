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

const createPhotosDialog = (table, index) => {
    const dialog = document.createElement("dialog");
    const wrapper = document.createElement("div");
    const closeButton = document.createElement("span");
    
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

const createClassPhotosButton = async (classLinks, title, classIndex, table) => {
    const url = classLinks[1].href;
    
    const r = await fetch(url);

    const decoder = new TextDecoder(
        r.headers.get("Content-Type").replace("text/html; charset=", "")
    );

    const text = decoder.decode(await r.arrayBuffer());

    const parser = new DOMParser();
    let html = parser.parseFromString(text, "text/html");

    const photosTable = html.querySelector("#layout0 > table");

    const photosDialog = createPhotosDialog(photosTable, classIndex);

    const photosButton = createPhotosButton(classLinks[1].children[0], photosDialog);
    
    table.appendChild(photosDialog);
    title.appendChild(photosButton);
}

const editTitle = async (title, table, classIndex) => {   
    const titleText = document.createElement("h3");
    const titleContent = title.children[0];
    const className = titleContent.innerText.replaceAll(String.fromCharCode(160), '');
    const classLinks = titleContent.children;

    titleText.classList.add("classTitle");
    title.appendChild(titleText);

    titleText.innerText = className;
    title.appendChild(classLinks[0]); // email button
    
    await createClassPhotosButton(classLinks, title, classIndex, table); // photos modal

    titleContent.remove();
    title.addEventListener("click", () => titleClick(title, table));
}

const groupClasses = () => {
    const parent = document.querySelector("#conteudoinner");
    let titleIndex = 5, tableIndex = 6, classIndex = 0;
    let title = document.querySelector(`#conteudoinner > h3:nth-child(${titleIndex})`);
    let table = document.querySelector(`#conteudoinner > table:nth-child(${tableIndex})`);
    
    while (title || table) {
        const groupElement = document.createElement("section");
        const tableWrapperElement = document.createElement("div");
        const titleWrapperElement = document.createElement("div");
        
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
        
        editTitle(titleWrapperElement, tableWrapperElement, classIndex);
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