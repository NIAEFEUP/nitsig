import {
    groupSectionTitleAndContent,
    groupChildrenBySelector,
    moveChildrenToAncestor,
    removeTwoColumnTable,
} from "../modules/utilities/pageUtils";

const publicationWebsites: Record<string, { icon: string; text: string }> = {
    "authenticus.pt": { icon: "authenticusID.png", text: "Authenticus ID" },
    "orcid.org": { icon: "orcid.png", text: "ORCID" },
    "cienciavitae.pt": { icon: "cienciaID.png", text: "Ciência ID" },
    "publons.com": { icon: "researchID.png", text: "Research-ID" },
    "scopus.com": { icon: "scopus.png", text: "Scopus" },
};

export const teacherPage = (): void => {
    // TODO: remove this check
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

    const sectionClasses = [
        ".se-contact-info",
        ".se-roles",
        ".se-positions",
        ".informacao-pessoal-outras",
    ];

    //i hate sigarra, for some reason it nests one table inside each other
    sectionClasses.forEach(reformatTables);
};

function reformatTables(parentSelector: string): void {
    let parentElement = document.querySelector<HTMLElement>(parentSelector);
    if (!parentElement || parentElement.children.length === 0) return;

    const tableList = parentElement.querySelectorAll(
        "table > tbody > tr > td > table",
    );

    if (tableList.length !== 0) {
        parentElement.querySelector("table")?.remove();
        if (tableList.length > 1) {
            const container = document.createElement("div");
            container.classList.add("se-container");
            parentElement.appendChild(container);
            parentElement = container;
        }
        for (const table of Array.from(tableList)) {
            document.querySelector(parentSelector)?.appendChild(table);
            removeTwoColumnTable(
                `${parentSelector} > table`,
                true,
                parentElement!, // Non-null assertion here
            );
        }
    } else {
        const tableSelector = `${parentSelector} > table`;
        const table = document.querySelector(tableSelector);
        if (table) {
            parentElement.appendChild(table);
            removeTwoColumnTable(
                tableSelector,
                true,
                parentElement!, // Non-null assertion here
            );
        }
    }
}

function tagGroupedElements(): void {
    let contacts = document.querySelector<HTMLElement>(
        ".informacao-pessoal-dados-dados > div:not(.se-website-button)",
    );
    if (contacts !== null) {
        contacts.classList.add("se-contact-info");
    } else {
        contacts = document.querySelector<HTMLElement>(
            ".informacao-pessoal-dados-dados > table:not(.tabelasz)",
        );
        if (contacts) {
            const div = document.createElement("div");
            const informacao_pessoal = document.querySelector<HTMLElement>(
                ".informacao-pessoal-dados-dados",
            );
            const h3 = document.createElement("h3");
            h3.textContent = "Contactos";
            div.append(h3, contacts);
            div.classList.add("se-contact-info");
            informacao_pessoal?.appendChild(div);
        }
    }
    const roles = document.querySelector<HTMLElement>(
        ".informacao-pessoal-funcoes",
    );
    if (roles !== null) {
        if (roles.childElementCount === 1) {
            roles.children[0].classList.add("se-roles");
        } else if (roles.childElementCount > 1) {
            roles.children[0].classList.add("se-roles");
            roles.children[1].classList.add("se-positions");
        }
    }
}

function makeWebsiteButtonIfExists(): void {
    const websiteIcon = document.querySelector<HTMLAnchorElement>(
        ".informacao-pessoal-dados-dados > table > tbody > tr:nth-child(1) > td:nth-child(2) > a",
    );
    const informationElement = document.querySelector<HTMLElement>(
        ".informacao-pessoal-dados-dados",
    );
    if (websiteIcon === null || !informationElement) return;

    const websiteLink = websiteIcon.href;
    const websiteButton = document.createElement("a");
    websiteButton.classList.add("se-website-button");
    websiteButton.href = websiteLink;
    websiteButton.textContent = "Website";

    informationElement.append(websiteButton);
    websiteIcon.remove();
}

function makePublicationWebsiteButtons(): void {
    const tabelasz =
        document.querySelector<HTMLTableSectionElement>(".tabelasz > tbody");
    const informacaoPessoal = document.querySelector<HTMLElement>(
        ".informacao-pessoal-dados",
    );
    if (!tabelasz || !informacaoPessoal) return;
    const websiteList = document.createElement("div");
    websiteList.classList.add("se-publication-website-list");
    const listOfRows = Array.from(tabelasz.children) as HTMLElement[];

    listOfRows.forEach((row) => {
        const linkElement = row.querySelector<HTMLAnchorElement>(
            "td:nth-child(2) > a",
        );
        if (linkElement === null) {
            return;
        }
        const link = linkElement.href;
        let found = false;
        for (const website of Object.keys(publicationWebsites)) {
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

    informacaoPessoal.appendChild(websiteList);
}

function moveResearchSection(): void {
    const researchSection = document.querySelector<HTMLElement>(
        ".informacao-pessoal-outras",
    );
    const informacaoPessoal = document.querySelector<HTMLElement>(
        ".informacao-pessoal-dados",
    );
    if (!researchSection || !informacaoPessoal) return;
    researchSection.remove();
    const rolesSection = document.querySelector<HTMLElement>(
        ".informacao-pessoal-funcoes",
    );
    if (rolesSection) {
        informacaoPessoal.insertBefore(researchSection, rolesSection);
    }
}

function makeTitleBar(): void {
    const informacaoPessoal = document.querySelector<HTMLElement>(
        ".informacao-pessoal",
    );

    const titleElement = document.querySelectorAll<HTMLHeadingElement>(
        "#conteudoinner > h1",
    )[1];
    const title = titleElement.textContent;
    titleElement.remove();
    const siglaRow = document.querySelector<HTMLTableRowElement>(
        ".tabelasz > tbody:nth-child(1) > tr:nth-child(2)",
    );
    const sigla = document.querySelector<HTMLBRElement>(
        ".tabelasz > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > b:nth-child(1)",
    )?.textContent;
    siglaRow?.remove();

    const titleBar = document.createElement("div");
    titleBar.classList.add("se-teacher-title-bar");

    const newTitle = document.createElement("h1");
    newTitle.textContent = title || "";

    const newSigla = document.createElement("h3");
    newSigla.textContent = sigla || "";

    titleBar.appendChild(newTitle);
    titleBar.appendChild(newSigla);

    informacaoPessoal?.prepend(titleBar);
}
