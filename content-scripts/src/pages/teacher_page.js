
const publicationWebsites = {
    "authenticus.pt": { icon: "authenticusID.png", text: "Authenticus ID" },
    "orcid.org": { icon: "orcid.png", text: "ORCID" },
    "cienciavitae.pt": { icon: "cienciaID.png", text: "Ciência ID" },
    "publons.com": { icon: "researchID.png", text: "Research-ID" },
    "scopus.com": { icon: "scopus.png", text: "Scopus" }
}


export const teacherPage = () => {
    if (!document.location.href.includes("func_geral.FormView")) {
        return;
    }
    makeTitleBar();
    moveResearchSection();
    makePublicationWebsiteButtons();
    groupSectionTitleAndContent();



};

function groupSectionTitleAndContent() {
    //this detects if an element is an h3 and groups 
    //with the next element until the next h3 appears, if any
    const outerElement = document.querySelector(".informacao-pessoal-funcoes");
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
