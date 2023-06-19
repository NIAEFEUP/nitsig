const getNumberClasses = (base) => {
    let last = base.nextElementSibling;
    let cnt = 0;
    while(last.nextElementSibling) {
        if (last.nodeName !== "BR") cnt++;
        last = last.nextElementSibling;
    }
    return cnt/2;
}

const createSelectionTable = (base, numberClasses) => {
    const selectionTable = document.createElement("div");
    selectionTable.id = "selectionTable";

    for (let i = 0; i < numberClasses; i++) {
        const classRegex = /[0-9]([A-Z\.])*([0-9])*/g;
        
        const classWrapper = document.createElement("div");
        classWrapper.className = "classOptWrapper";
        const className = document.createElement("div");
        classWrapper.className = "classOptName";
        const classOption = document.createElement("input");
        classWrapper.className = "classOpt";

        const classNameInner = document.querySelector(`#conteudoinner > h3:nth-child(${7+3*i})`).innerText;
        className.innerText = classRegex.exec(classNameInner)[0];

        classOption.type = "checkbox";

        classWrapper.appendChild(className);
        classWrapper.appendChild(classOption);
        selectionTable.appendChild(classWrapper);
    }

    base.parentNode.replaceChild(selectionTable, base);
}

export const classPage = () => {
    let base = document.querySelector("#conteudoinner > table:nth-child(6)");

    const numberClasses = getNumberClasses(base);
    createSelectionTable(base, numberClasses);
}