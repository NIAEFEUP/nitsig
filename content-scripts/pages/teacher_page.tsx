// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";
import {
    groupSectionTitleAndContent,
    groupChildrenBySelector,
    moveChildrenToAncestor,
    removeTwoColumnTable,
} from "../modules/utilities/pageUtils";
import { extractTableData } from "../modules/table";
import { Table } from "../components/Table";

const publicationWebsites: Record<string, { icon: string; text: string }> = {
    "authenticus.pt": { icon: "authenticusID.png", text: "Authenticus ID" },
    "orcid.org": { icon: "orcid.png", text: "ORCID" },
    "cienciavitae.pt": { icon: "cienciaID.png", text: "Ciência ID" },
    "publons.com": { icon: "researchID.png", text: "Research-ID" },
    "scopus.com": { icon: "scopus.png", text: "Scopus" },
};

const PublicationWebsiteButton = ({
    link,
    website,
}: {
    link: string;
    website: string;
}) => (
    <a href={link} className="se-publication-website-button">
        <img
            src={chrome.runtime.getURL(
                `images/publicationWebsiteLogo/${publicationWebsites[website].icon}`,
            )}
        />
        <p>{publicationWebsites[website].text}</p>
    </a>
);

const WebsiteButton = ({ link }: { link: string }) => (
    <a href={link} className="se-website-button">
        Website
    </a>
);

const TitleBar = ({ title, sigla }: { title: string; sigla: string }) => (
    <div className="se-teacher-title-bar">
        <h1>{title}</h1>
        <h3>{sigla}</h3>
    </div>
);

const ContactInfo = ({ contacts }: { contacts: HTMLElement }) => (
    <div className="se-contact-info">
        <h3>Contactos</h3>
        {contacts}
    </div>
);

export const teacherPage = (): void => {
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

    const table = document.querySelector<HTMLElement>(".tabelasz");
    if (table) {
        const { headers, data } = extractTableData(table);

        if (headers.length > 0 && data.length > 0) {
            const newTable = (
                <Table name="main_teacher_info" headers={headers} data={data} />
            );
            table.parentNode?.insertBefore(newTable, table);
            table.remove();
        }
    }
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
            const container = <div className="se-container" />;
            parentElement.appendChild(container);
            parentElement = container as HTMLElement;
        }
        for (const table of Array.from(tableList)) {
            document.querySelector(parentSelector)?.appendChild(table);
            removeTwoColumnTable(
                `${parentSelector} > table`,
                true,
                parentElement,
            );
        }
    } else {
        const tableSelector = `${parentSelector} > table`;
        const table = document.querySelector(tableSelector);
        if (table) {
            parentElement.appendChild(table);
            removeTwoColumnTable(tableSelector, true, parentElement);
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
            const informacao_pessoal = document.querySelector<HTMLElement>(
                ".informacao-pessoal-dados-dados",
            );
            const contactInfo = <ContactInfo contacts={contacts} />;
            informacao_pessoal?.appendChild(contactInfo);
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
    const websiteButton = <WebsiteButton link={websiteLink} />;

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
    const websiteList = <div className="se-publication-website-list" />;
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
                const button = (
                    <PublicationWebsiteButton link={link} website={website} />
                );
                websiteList.appendChild(button);
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
    const title = titleElement.textContent || "";
    titleElement.remove();
    const siglaRow = document.querySelector<HTMLTableRowElement>(
        ".tabelasz > tbody:nth-child(1) > tr:nth-child(2)",
    );
    const sigla =
        document.querySelector<HTMLBRElement>(
            ".tabelasz > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > b:nth-child(1)",
        )?.textContent || "";
    siglaRow?.remove();

    const titleBar = <TitleBar title={title} sigla={sigla} />;
    informacaoPessoal?.prepend(titleBar);
}
