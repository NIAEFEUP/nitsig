
/**
 * @param {string} selector 
 * @param {string[]} classList 
 */
export function groupSectionTitleAndContent(selector, classList=[]) {
    //this detects if an element is an h3 and groups 
    //with the next element until the next h3 appears, if any
    const outerElement = document.querySelector(selector);
    let elementList = [];
    const listOfRows = [...outerElement.children]
    for (const row of listOfRows) {
        if (row.nodeName === "H3" && elementList.length === 0) {
            row.classList.add("se-group-title");
            elementList.push(row)
            continue
        }
        if (row.nodeName === "H3" && elementList.length !== 0) {
            const div = document.createElement("div")
            div.classList.add(...classList)
            elementList.forEach((element) => {
                element.remove()
                div.appendChild(element)
            })
            outerElement.appendChild(div)
            row.classList.add("se-group-title");
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
        div.classList.add(...classList)
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


export function removeTwoColumnTable(tableSelector, inverted=false, parent=null){
    const table = document.querySelector(tableSelector);
    
    if(table === null || table.tagName !== "TABLE") 
    throw Error("Couldnt find table with " + tableSelector +  " selector");
    parent ??= table.parentElement;
    
    const tbody = table.children[0];
    const div = document.createElement("div");
    div.classList.add("se-key-pair-table")
    for(const tr of tbody.children){
        if (tr.children[0].tagName === "TH") continue;
        if(tr.children.length !== 2){
            throw Error("Table with selector " + tableSelector + " isn't a two column table");
        }
        if (tr.children[0].children.length === 0 ||
            tr.children[0].children[0].textContent === ""){
            const p = document.createElement("p");
            p.textContent = tr.children[0].textContent;
            if(!inverted) p.classList.add("se-highlighted-part")
            p.classList.add("se-pair-start");
            div.appendChild(p);
        } else {
            const element = tr.children[0].children[0];
            const childText = tr.children[0].childNodes[0].textContent
            if (childText !== "") {
                element.textContent = `${childText} @ ${element.textContent}`
            }
            if(!inverted) element.classList.add("se-highlighted-part");
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
            const innerDiv = document.createElement("div");
            if(inverted) innerDiv.classList.add("se-highlighted-part");
            innerDiv.classList.add("se-content-part");

            const label = tr.children[0].textContent;
            
            if (tr.children[1].childNodes[0].nodeValue != ""){
                const p = document.createElement("p");
                p.style.display = "inline";
                if (label === "Salas: "){
                    // ensure all classrooms are present
                    const classrooms = tr.children[1].querySelectorAll("a");
                    classrooms.forEach((room) => {
                        p.append(room);
                        p.append(", ");
                    })
                    p.removeChild(p.lastChild);
                    innerDiv.append(p);
                } else {
                    if (label.startsWith("Telemóvel") || label.startsWith("Mobile phone")){
                        p.textContent = tr.children[1].childNodes[0].nodeValue;
                        innerDiv.append(p);
                    }
                    const element = tr.children[1].children[0];
                    innerDiv.append(element);
                }
            }
            div.append(innerDiv);
        }
        
    }
    parent.appendChild(div);
    table.remove();
    return div;
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

export async function fetchSigarraPage(url) {
    const r = await fetch(url);

    const decoder = new TextDecoder(
        r.headers.get("Content-Type").replace("text/html; charset=", "")
    );

    const text = decoder.decode(await r.arrayBuffer());

    const parser = new DOMParser();
    let html = parser.parseFromString(text, "text/html");

    return html;
}

export function makeTextNodesElements(selector){

    const element = document.querySelector(selector);
    let lastElement = null;
    for(let value of [...element.childNodes]){
        if(value.nodeType == Node.TEXT_NODE || value.nodeType == Node.ENTITY_NODE){
            const span = document.createElement('span');
            if(value.textContent == '\n') continue;
            span.textContent = value.textContent;
            if(lastElement == null){
                element.prepend(span);
            } else {
                element.insertBefore(span, lastElement.nextSibling)
            }
            element.removeChild(value)
        } else if (value.nodeType == Node.ELEMENT_NODE){
            lastElement = value
        }
    }
}
