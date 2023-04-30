
const publicationWebsites = {
    "authenticus.pt": { icon: "authenticusID.png", text: "Authenticus ID" },
    "orcid.org": { icon: "orcid.png", text: "ORCID" },
    "cienciavitae.pt": { icon: "cienciaID.png", text: "Ciência ID" },
    "publons.com": { icon: "researchID.png", text: "Research-ID" },
    "scopus.com": { icon: "scopus.png", text: "Scopus" }
}


export const teacherPage = () => {
    if (!document.location.href.toLowerCase().includes("func_geral.formview")) {
        return;
    }
    makeTitleBar();
    moveResearchSection();
    makePublicationWebsiteButtons();
    groupSectionTitleAndContent(".informacao-pessoal-funcoes");
    groupSectionTitleAndContent(".informacao-pessoal-dados-dados");
    makeWebsiteButtonIfExists();

    tagGroupedElements();

    //nuke the html structure, leaving only the elements that contain the information
    removeElementWithoutChildren(".informacao-pessoal-dados-dados");
    removeElementWithoutChildren(".informacao-pessoal-dados");
    removeElementWithoutChildren(".informacao-pessoal-funcoes");


    //we group the page contents to be easier to style to
    groupChildrenBySelector([".teacherTitleBar", ".tabelasz", ".websiteButton"],
        ["mainInfoContent"]);
    
    groupChildrenBySelector([".informacao-pessoal-dados-foto", ".mainInfoContent"], 
        ["mainInfoRow"]);

    groupChildrenBySelector([".contact-info", ".roles", ".publicationWebsiteList"],
        ["extaInformationRow"]);

    removeTwoColumnTable(".contact-info > table", true);

    //i hate sigarra, for some reason it nests one table inside each other
    const rolesTable = document.querySelector(".roles > table > tbody > tr > td > table");
    if(rolesTable !== undefined){
        document.querySelector(".roles > table").remove();
        document.querySelector(".roles").appendChild(rolesTable);
        removeTwoColumnTable(".roles > table", true);
    }

    const investigationTable = document.querySelector(".informacao-pessoal-outras > table > tbody > tr > td > table");
    if(investigationTable !== undefined){
        document.querySelector(".informacao-pessoal-outras > table").remove();
        document.querySelector(".informacao-pessoal-outras").appendChild(investigationTable);
        removeTwoColumnTable(".informacao-pessoal-outras > table", true);

    }




};

function removeTwoColumnTable(tableSelector, inverted=false){
    const table = document.querySelector(tableSelector);
    if(table === undefined || table.tagName !== "TABLE") 
        throw Error("Couldnt find table with " + tableSelector +  " selector");
    const tbody = table.children[0];
    const div = document.createElement("div");
    div.classList.add("keyPairTable")
    for(const tr of tbody.children){
        if(tr.children.length !== 2){
            throw Error("Table with selector " + tableSelector + " isn't a two column table");
        }
        if (tr.children[0].children.length === 0){
            const p = document.createElement("p");
            p.textContent = tr.children[0].textContent;
            if(!inverted) p.classList.add("highlightedPart")
            p.classList.add("pairStart");
            div.appendChild(p);
        } else {
            const element = tr.children[0].children[0];
            if(!inverted) element.classList.add("highlightedPart");
            p.classList.add("pairStart");

            div.append(element);
        }


        if (tr.children[1].children.length === 0){
            const p = document.createElement("p");
            p.textContent = tr.children[1].textContent;
            if(inverted) p.classList.add("highlightedPart");
            p.classList.add("contentPart");
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
            if(inverted) innerDiv.classList.add("highlightedPart");
            innerDiv.classList.add("contentPart");
            innerDiv.append(element);
            div.append(innerDiv);
        }
        
    }
    table.parentElement.appendChild(div);
    table.remove();
}


function groupChildrenBySelector(childSelectors, classList){
    if(childSelectors === undefined) return;
    if(childSelectors.length === 0) return;
    const parent = document.querySelector(childSelectors[0]).parentElement;

    const groupElement = document.createElement("div");

    parent.insertBefore(groupElement, document.querySelector(childSelectors[0]));
    if(classList !== undefined) groupElement.classList.add(...classList);

    childSelectors.forEach((childSelector) => {
        const child = document.querySelector(childSelector);
        if(child === undefined) return;
        child.remove();
        groupElement.appendChild(child);
    });

}

function tagGroupedElements(){
    const contacts = document.querySelector(".informacao-pessoal-dados-dados > div");
    if(contacts !== undefined){
        contacts.classList.add("contact-info")
    }
    const roles = document.querySelector(".informacao-pessoal-funcoes");
    if(roles !== undefined){
        if(roles.childElementCount === 1){
            roles.children[0].classList.add("roles");
        } else if (roles.childElementCount > 1){
            roles.children[0].classList.add("roles");
            roles.children[1].classList.add("positions");
        }
    }

}

function removeElementWithoutChildren(selector){
    const element = document.querySelector(selector);
    const parent = element.parentElement;
    const listOfChildren = [...element.children];
    listOfChildren.forEach((child)=>{
        child.remove();
        parent.insertBefore(child, element);
    });
    element.remove();
}

function makeWebsiteButtonIfExists(){
    const websiteIcon = document
        .querySelector(".informacao-pessoal-dados-dados > table > tbody > tr:nth-child(1) > td:nth-child(2) > a");
    const informationElement = document.querySelector(".informacao-pessoal-dados-dados")
    if(websiteIcon === undefined) return;

    const websiteLink = websiteIcon.href;
    const websiteButton = document.createElement("div");
    websiteButton.classList.add("websiteButton");
    websiteButton.onclick = () => {location.href = websiteLink};

    const websiteText = document.createElement("p");
    websiteText.textContent = "Website";
    websiteButton.appendChild(websiteText);

    informationElement.append(websiteButton);
    websiteIcon.remove();


}

function groupSectionTitleAndContent(selector) {
    //this detects if an element is an h3 and groups 
    //with the next element until the next h3 appears, if any
    const outerElement = document.querySelector(selector);
    var elementList = [];
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

function makePublicationWebsiteButtons() {
    const tabelasz = document.querySelector(".tabelasz > tbody")
    const informacaoPessoal = document.querySelector(".informacao-pessoal-dados");
    const websiteList = document.createElement("div")
    websiteList.classList.add("publicationWebsiteList")
    const listOfRows = [...tabelasz.children]
    listOfRows.forEach((row) => {
        console.log(row)
        const linkElement = row.querySelector("td:nth-child(2) > a")
        if (linkElement === null) {
            return;
        }
        const link = linkElement.href
        console.log(link)
        var found = false;
        for (website of Object.keys(publicationWebsites)) {
            if (link.includes(website)) {
                found = true
                const image = document.createElement("img")
                image.src = chrome.runtime.getURL("images/publicationWebsiteLogo/" +
                    publicationWebsites[website].icon);
                const text = document.createElement("p")
                text.textContent = publicationWebsites[website].text

                const div = document.createElement("div")
                div.appendChild(image)
                div.appendChild(text)
                div.classList.add("publicationWebsiteButton")
                div.onclick = () => { location.href = link }
                websiteList.appendChild(div)
                break;
            }
        }

        if (found) row.remove()
    })


    informacaoPessoal.appendChild(websiteList)

}

function moveResearchSection() {
    const researchSection = document.querySelector(".informacao-pessoal-outras");
    const informacaoPessoal = document.querySelector(".informacao-pessoal-dados");
    researchSection.remove();
    const rolesSection = document.querySelector(".informacao-pessoal-funcoes");
    informacaoPessoal.insertBefore(researchSection, rolesSection);
}

function makeTitleBar() {
    const informacaoPessoal = document.querySelector(".informacao-pessoal");

    const titleElement = document.querySelectorAll("#conteudoinner > h1")[1];
    const title = titleElement.textContent;
    titleElement.remove();
    const siglaRow = document.querySelector(".tabelasz > tbody:nth-child(1) > tr:nth-child(2)");
    const sigla = document.querySelector(".tabelasz > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > b:nth-child(1)")
        .textContent;
    siglaRow.remove();

    const titleBar = document.createElement("div");
    titleBar.classList.add("teacherTitleBar");

    const newTitle = document.createElement("h1");
    newTitle.textContent = title;

    const newSigla = document.createElement("h3");
    newSigla.textContent = sigla;

    titleBar.appendChild(newTitle);
    titleBar.appendChild(newSigla);


    informacaoPessoal.prepend(titleBar);
}
