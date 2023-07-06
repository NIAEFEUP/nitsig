import { keys } from "~/common/objects";

const publicationWebsites = {
    "authenticus.pt": { icon: "authenticusID.png", text: "Authenticus ID" },
    "orcid.org": { icon: "orcid.png", text: "ORCID" },
    "cienciavitae.pt": { icon: "cienciaID.png", text: "Ciência ID" },
    "publons.com": { icon: "researchID.png", text: "Research-ID" },
    "scopus.com": { icon: "scopus.png", text: "Scopus" },
} as const;

export default () => {
    makeTitleBar();
    moveResearchSection();
    makePublicationWebsiteButtons();
    groupSectionTitleAndContent(".informacao-pessoal-funcoes");
    groupSectionTitleAndContent(".informacao-pessoal-dados-dados");
    makeWebsiteButtonIfExists();

    tagGroupedElements();

    //nuke the html structure, leaving only the elements that contain the information
    moveChildrenToAncestor(".informacao-pessoal-dados-dados");
    moveChildrenToAncestor(".informacao-pessoal-dados");
    moveChildrenToAncestor(".informacao-pessoal-funcoes");

    //we group the page contents to be easier to style to
    groupChildrenBySelector(
        [".se-teacher-title-bar", ".tabelasz", ".se-website-button"],
        ["se-main-info-content"],
    );

    groupChildrenBySelector(
        [".informacao-pessoal-dados-foto", ".se-main-info-content"],
        ["se-main-info-row"],
    );

    groupChildrenBySelector(
        [".se-contact-info", ".se-roles", ".se-publication-website-list"],
        ["se-extra-information-row"],
    );

    removeTwoColumnTable(".se-contact-info > table", true);

    //i hate sigarra, for some reason it nests one table inside each other
    const rolesTable = document.querySelector<HTMLTableElement>(
        ".se-roles > table > tbody > tr > td > table",
    );
    if (rolesTable !== null) {
        document.querySelector(".se-roles > table")?.remove();
        document.querySelector(".se-roles")?.appendChild(rolesTable);
        removeTwoColumnTable(".se-roles > table", true);
    }

    const investigationTable = document.querySelector<HTMLTableElement>(
        ".informacao-pessoal-outras > table > tbody > tr > td > table",
    );
    if (investigationTable !== null) {
        document.querySelector(".informacao-pessoal-outras > table")?.remove();
        document
            .querySelector(".informacao-pessoal-outras")
            ?.appendChild(investigationTable);
        removeTwoColumnTable(".informacao-pessoal-outras > table", true);
    }
};

function tagGroupedElements() {
    let contacts = document.querySelector<HTMLDivElement>(
        ".informacao-pessoal-dados-dados > div:not(.se-website-button)",
    );
    if (contacts !== null) {
        contacts.classList.add("se-contact-info");
    } else {
        contacts = document.querySelector<HTMLTableElement>(
            ".informacao-pessoal-dados-dados > table:not(.tabelasz)",
        );
        const div = document.createElement("div");
        const informacao_pessoal = document.querySelector(
            ".informacao-pessoal-dados-dados",
        );
        const h3 = document.createElement("h3");
        h3.textContent = "Contactos";
        if (contacts !== null) div.append(h3, contacts);
        div.classList.add("se-contact-info");
        informacao_pessoal?.appendChild(div);
    }
    const roles = document.querySelector(".informacao-pessoal-funcoes");
    if (roles !== null) {
        if (roles.childElementCount === 1) {
            roles.children[0].classList.add("se-roles");
        } else if (roles.childElementCount > 1) {
            roles.children[0].classList.add("se-roles");
            roles.children[1].classList.add("se-positions");
        }
    }
}

function makeWebsiteButtonIfExists() {
    const websiteIcon = document.querySelector<HTMLAnchorElement>(
        ".informacao-pessoal-dados-dados > table > tbody > tr:nth-child(1) > td:nth-child(2) > a",
    );
    const informationElement = document.querySelector(
        ".informacao-pessoal-dados-dados",
    );
    if (websiteIcon === null) return;

    const websiteLink = websiteIcon.href;
    const websiteButton = document.createElement("a");
    websiteButton.classList.add("se-website-button");
    websiteButton.href = websiteLink;
    websiteButton.textContent = "Website";

    informationElement?.append(websiteButton);
    websiteIcon.remove();
}

function makePublicationWebsiteButtons() {
    const tabelasz =
        document.querySelector<HTMLTableSectionElement>(".tabelasz > tbody");
    const informacaoPessoal = document.querySelector(
        ".informacao-pessoal-dados",
    );
    const websiteList = document.createElement("div");
    websiteList.classList.add("se-publication-website-list");
    const listOfRows = tabelasz && [...tabelasz.children];
    listOfRows?.forEach((row) => {
        const linkElement = row.querySelector<HTMLAnchorElement>(
            "td:nth-child(2) > a",
        );
        if (linkElement === null) {
            return;
        }
        const link = linkElement.href;
        let found = false;
        for (const website of keys(publicationWebsites)) {
            if (link.includes(website)) {
                found = true;
                const image = document.createElement("img");
                image.src = chrome.runtime.getURL(
                    "images/publicationWebsiteLogo/" +
                        publicationWebsites[website].icon,
                );
                const text = document.createElement("p");
                text.textContent = publicationWebsites[website].text;

                const a = document.createElement("a");
                a.appendChild(image);
                a.appendChild(text);
                a.classList.add("se-publication-website-button");
                a.href = link;
                websiteList.appendChild(a);
                break;
            }
        }

        if (found) row.remove();
    });

    informacaoPessoal?.appendChild(websiteList);
}

function moveResearchSection() {
    const researchSection = document.querySelector(
        ".informacao-pessoal-outras",
    );
    const informacaoPessoal = document.querySelector(
        ".informacao-pessoal-dados",
    );

    if (!researchSection) return;

    researchSection.remove();
    const rolesSection = document.querySelector(".informacao-pessoal-funcoes");
    informacaoPessoal?.insertBefore(researchSection, rolesSection);
}

function makeTitleBar() {
    const informacaoPessoal = document.querySelector(".informacao-pessoal");

    const titleElement = document.querySelectorAll("#conteudoinner > h1")[1];
    const title = titleElement.textContent;
    titleElement.remove();
    const siglaRow = document.querySelector(
        ".tabelasz > tbody:nth-child(1) > tr:nth-child(2)",
    );
    const sigla = document.querySelector<HTMLElement>(
        ".tabelasz > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > b:nth-child(1)",
    )?.textContent;
    siglaRow?.remove();

    const titleBar = document.createElement("div");
    titleBar.classList.add("se-teacher-title-bar");

    const newTitle = document.createElement("h1");
    newTitle.textContent = title;

    const newSigla = document.createElement("h3");
    newSigla.textContent = sigla ?? "";

    titleBar.appendChild(newTitle);
    titleBar.appendChild(newSigla);

    informacaoPessoal?.prepend(titleBar);
}

function groupSectionTitleAndContent(selector: string) {
    //this detects if an element is an h3 and groups
    //with the next element until the next h3 appears, if any
    const outerElement = document.querySelector(selector);
    let elementList: Element[] = [];
    for (const row of outerElement?.children ?? []) {
        if (row.nodeName === "H3" && elementList.length === 0) {
            elementList.push(row);
            continue;
        }
        if (row.nodeName === "H3" && elementList.length !== 0) {
            const div = document.createElement("div");
            elementList.forEach((element) => {
                element.remove();
                div.appendChild(element);
            });
            outerElement?.appendChild(div);
            elementList = [row];
            continue;
        }
        if (elementList.length === 0) {
            continue;
        }
        elementList.push(row);
    }
    if (elementList.length !== 0) {
        const div = document.createElement("div");
        elementList.forEach((element) => {
            element.remove();
            div.appendChild(element);
        });
        outerElement?.appendChild(div);
    }
}

function moveChildrenToAncestor(selector: string) {
    const element = document.querySelector(selector);
    const parent = element?.parentElement;
    [...(element?.children ?? [])].forEach((child) => {
        child.remove();
        parent?.insertBefore(child, element);
    });
    element?.remove();
}

function removeTwoColumnTable(tableSelector: string, inverted = false) {
    const table = document.querySelector(tableSelector);
    if (table === null || table.tagName !== "TABLE")
        throw Error("Couldn't find table with " + tableSelector + " selector");
    const tbody = table.children[0];
    const div = document.createElement("div");
    div.classList.add("se-key-pair-table");
    for (const tr of tbody.children) {
        if (tr.children.length !== 2) {
            throw Error(
                "Table with selector " +
                    tableSelector +
                    " isn't a two column table",
            );
        }
        if (tr.children[0].children.length === 0) {
            const p = document.createElement("p");
            p.textContent = tr.children[0].textContent;
            if (!inverted) p.classList.add("se-highlighted-part");
            p.classList.add("se-pair-start");
            div.appendChild(p);
        } else {
            const element = tr.children[0].children[0];
            if (!inverted) element.classList.add("se-highlighted-part");
            element.classList.add("se-pair-start");

            div.append(element);
        }

        if (tr.children[1].children.length === 0) {
            const p = document.createElement("p");
            p.textContent = tr.children[1].textContent;
            if (inverted) p.classList.add("se-highlighted-part");
            p.classList.add("se-content-part");
            div.appendChild(p);
        } //sometimes table elements will not also include ::text but also a child element
        //aka villate's cellphone when the user is logged on :)
        else {
            const innerDiv = document.createElement("div");
            if (tr.children[1].childNodes[0].nodeValue != "") {
                const p = document.createElement("p");
                p.style.display = "inline";
                p.textContent = tr.children[1].childNodes[0].nodeValue;
                innerDiv.append(p);
            }
            const element = tr.children[1].children[0];
            if (inverted) innerDiv.classList.add("se-highlighted-part");
            innerDiv.classList.add("se-content-part");
            innerDiv.append(element);
            div.append(innerDiv);
        }
    }
    table?.parentElement?.appendChild(div);
    table.remove();
}

function groupChildrenBySelector(
    childSelectors: string[],
    classList: string[],
) {
    if (childSelectors === null) return;
    if (childSelectors.length === 0) return;
    const parent = document.querySelector(childSelectors[0])?.parentElement;

    const groupElement = document.createElement("div");

    parent?.insertBefore(
        groupElement,
        document.querySelector(childSelectors[0]),
    );
    if (classList !== null) groupElement.classList.add(...classList);

    childSelectors.forEach((childSelector) => {
        const child = document.querySelector(childSelector);
        if (child === null) return;
        child.remove();
        groupElement.appendChild(child);
    });
}
