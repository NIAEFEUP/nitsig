export function groupSectionTitleAndContent(selector) {
    //this detects if an element is an h3 and groups 
    //with the next element until the next h3 appears, if any
    const outerElement = document.querySelector(selector);
    let elementList = [];
    const listOfRows = [...outerElement.children]
    for (const row of listOfRows) {
        if (row.nodeName === "H3" && elementList.length === 0) {
            elementList.push(row)
            continue
        }
        if (row.nodeName === "H3" && elementList.length !== 0) {
            const div = document.createElement("div")
            elementList.forEach((element) => {
                element.remove()
                div.appendChild(element)
            })
            outerElement.appendChild(div)
            elementList = [row]
            continue
        }
        if (elementList.length === 0) {
            continue
        }
        elementList.push(row)
    }
    if (elementList.length !== 0) {
        const div = document.createElement("div")
        elementList.forEach((element) => {
            element.remove()
            div.appendChild(element)
        })
        outerElement.appendChild(div)
    }
}

export function moveChildrenToAncestor(selector){
    const element = document.querySelector(selector);
    const parent = element.parentElement;
    const listOfChildren = [...element.children];
    listOfChildren.forEach((child)=>{
        child.remove();
        parent.insertBefore(child, element);
    });
    element.remove();
}


export function removeTwoColumnTable(tableSelector, inverted=false){
    const table = document.querySelector(tableSelector);
    if(table === null || table.tagName !== "TABLE") 
        throw Error("Couldnt find table with " + tableSelector +  " selector");
    const tbody = table.children[0];
    const div = document.createElement("div");
    div.classList.add("se-key-pair-table")
    for(const tr of tbody.children){
        if(tr.children.length !== 2){
            throw Error("Table with selector " + tableSelector + " isn't a two column table");
        }
        if (tr.children[0].children.length === 0){
            const p = document.createElement("p");
            p.textContent = tr.children[0].textContent;
            if(!inverted) p.classList.add("se-highlighted-part")
            p.classList.add("se-pair-start");
            div.appendChild(p);
        } else {
            const element = tr.children[0].children[0];
            if(!inverted) element.classList.add("se-highlighted-part");
            p.classList.add("se-pair-start");

            div.append(element);
        }


        if (tr.children[1].children.length === 0){
            const p = document.createElement("p");
            p.textContent = tr.children[1].textContent;
            if(inverted) p.classList.add("se-highlighted-part");
            p.classList.add("se-content-part");
            div.appendChild(p);
            
        } //sometimes table elements will not also include ::text but also a child element
          //aka villate's cellphone when the user is logged on :)  
        else {
            const innerDiv = document.createElement("div")
            if(tr.children[1].childNodes[0].nodeValue != ""){
                const p = document.createElement("p");
                p.style.display = "inline";
                p.textContent = tr.children[1].childNodes[0].nodeValue;
                innerDiv.append(p);
            }
            const element = tr.children[1].children[0];
            if(inverted) innerDiv.classList.add("se-highlighted-part");
            innerDiv.classList.add("se-content-part");
            innerDiv.append(element);
            div.append(innerDiv);
        }
        
    }
    table.parentElement.appendChild(div);
    table.remove();
}


export function groupChildrenBySelector(childSelectors, classList){
    if(childSelectors === null) return;
    if(childSelectors.length === 0) return;
    const parent = document.querySelector(childSelectors[0]).parentElement;

    const groupElement = document.createElement("div");

    parent.insertBefore(groupElement, document.querySelector(childSelectors[0]));
    if(classList !== null) groupElement.classList.add(...classList);

    childSelectors.forEach((childSelector) => {
        const child = document.querySelector(childSelector);
        if(child === null) return;
        child.remove();
        groupElement.appendChild(child);
    });

}