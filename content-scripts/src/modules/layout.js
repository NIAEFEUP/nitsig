import { elementFromHtml } from "./utilities/elementFromHtml";
import { createPopover } from "./utilities/popover";

const HEADER_LINKS = {
    Estudantes: {
        Bolsas: "web_base.gera_pagina?p_pagina=242366",
        "Escolher turmas": "it_geral.ver_insc",
        "Estatutos especiais": "web_base.gera_pagina?p_pagina=242322",
        Exames: "web_base.gera_pagina?p_pagina=242382",
        Matrículas: "web_base.gera_pagina?p_pagina=31583",
        Propinas: "web_base.gera_pagina?p_pagina=propinas ano corrente",
        "Mais opções": "web_base.gera_pagina?p_pagina=ESTUDANTES",
    },
    Faculdade: {
        Alumni: "web_base.gera_pagina?p_pagina=243186",
        Cursos: "cur_geral.cur_inicio",
        Departamentos: "uni_geral.nivel_list?pv_nivel_id=1",
        Empresas: "web_base.gera_pagina?p_pagina=242380",
        Governo: "web_base.gera_pagina?p_pagina=31715",
        Notícias: "noticias_geral.lista_noticias",
        "Serviços/Gabinetes": "uni_geral.nivel_list?pv_nivel_id=4",
    },
    Pesquisa: {
        Edifícios: "instal_geral.edificio_query",
        Estudantes: "fest_geral.fest_query",
        Horários: "hor_geral.pesquisa_form",
        Notícias: "noticias_geral.pesquisa",
        Pessoal: "func_geral.formquery",
        "Projetos de investigação": "projectos_geral.pesquisa_projectos",
        Publicações: "pub_geral.pub_pesquisa",
        Salas: "instal_geral.espaco_query",
        Turmas: "it_turmas_geral.formquery",
        "Unidades Curriculares": "ucurr_geral.pesquisa_ucs",
        "Mais opções": "web_base.gera_pagina?p_pagina=1831",
    },
};

const authentication = (auth) =>
    auth
        ? /*html*/ `
            <a 
                href="gnots_geral.all_nots_list?pv_user=${auth.number}" 
                class="se-button se-icon-button ${
                    auth.notifications ? "se-badge" : ""
                }">
                <span class="se-icon ri-notification-line"></span>
            </a>
            <button id="se-auth-profile-button">
                <img
                    src="fotografias_service.foto?pct_cod=${auth.number}"
                    alt="Foto de perfil">
            </button>
            <div id="se-auth-profile-menu">
                <div id="se-auth-header">
                    <a
                        href="fest_geral.cursos_list?pv_num_unico=${
                            auth.number
                        }"
                    >${auth.name}</a>
                    <span>${auth.number}</span>
                </div>
                <nav id="se-auth-profile-links">
                    <a href="gpag_ccorrente_geral.conta_corrente_view?pct_cod=${
                        auth.number
                    }">
                        <span class="se-icon ri-money-euro-circle-line"></span> Conta corrente
                    </a>
                    <a href="vld_validacao.sair?p_address=WEB_PAGE.INICIAL">
                        <span class="se-icon ri-logout-box-line"></span> Terminar Sessão
                    </a>
                </nav>
            </div>
        `
        : /*html*/ `
            <button class="se-button" id="se-auth-button">
                Iniciar Sessão
            </button>
            <button class="se-button se-icon-button" id="se-auth-close-button">
                <span class="se-icon ri-close-line"></span>
            </button>
            <form
                id="se-auth-form"
                action="vld_validacao.validacao"
                method="post">
                <input type="hidden" name="p_address" value="web_page.inicial">
                <input type="hidden" name="p_app" value="162">
                <input type="hidden" name="p_amo" value="55">
                <label for="se-auth-user" class="acs">Utilizador</label>
                <input
                    id="se-auth-user"
                    type="text"
                    name="p_user"
                    placeholder="Utilizador"
                    autocomplete="username">
                <label for="se-auth-pass" class="acs">Palavra-passe</label>
                <input
                    id="se-auth-pass"
                    type="password"
                    name="p_pass"
                    placeholder="Palavra-passe"
                    autocomplete="current-password">
                <button class="se-button se-primary-button" type="submit">Iniciar Sessão</button>
                <span class="se-separator">ou</span>
                <a
                    href="vld_validacao.federate_login?p_redirect=web_page.Inicial"
                    id="se-auth-federate"
                    class="se-button">
                    <span class="se-icon ri-shield-user-line"></span>
                    Autenticação Federada
                </a>
                <a
                    href="gent_geral.list_services"
                    id="se-auth-reset">
                    Recuperar palavra-passe
                </a>
            </form>
        `;

/**
 * @param {Record<string, Record<string, string>>} links
 */
const createLinks = (links) =>
    Object.entries(links)
        .map(
            ([key, value]) => /*html*/ `
    <div class="se-header-link">
        <button>${key}</button>
        <div class="se-header-link-popover">
            ${Object.entries(value)
                .map(
                    ([label, url]) => /*html*/ `
                <a href="${url}">${label}</a>
            `
                )
                .join("")}
        </div>
    </div>
`
        )
        .join("");

const createNewHeader = (auth) =>
    elementFromHtml(/*html*/ `
        <header id="se-header">
            <a id="se-logo" href="/feup"><img src="${chrome.runtime.getURL(
                "images/FEUP.svg"
            )}"></a>
            <nav id="se-header-links">
                ${createLinks(HEADER_LINKS)}
            </nav>
            <div id="se-auth">${authentication(auth)}</div>
        </header>
    `);

const replaceHeader = () => {
    const oldHeader = document.querySelector("#cabecalho");

    const autenticacao = oldHeader.querySelector(".autenticacao");

    let auth = null;

    if (autenticacao && autenticacao.classList.contains("autenticado"))
        auth = {
            name: autenticacao.querySelector(".nome").textContent,
            number: autenticacao.querySelector("img").src.slice(-9),
            notifications: oldHeader.querySelector(".notificacoes") !== null,
        };

    const newHeader = createNewHeader(auth);

    const newAuth = newHeader.querySelector("#se-auth");
    const authPopover = newHeader.querySelector(
        ":is(#se-auth-profile-menu, #se-auth-form)"
    );
    const openAuth = createPopover(authPopover, newAuth);

    newHeader
        .querySelectorAll(":is(#se-auth-button, #se-auth-profile-button)")
        .forEach((x) => x.addEventListener("click", openAuth));

    newHeader.querySelectorAll(".se-header-link").forEach((x) => {
        const popover = x.querySelector(".se-header-link-popover");
        const togglePopover = createPopover(popover);
        const button = x.querySelector("button");
        button.addEventListener("click", togglePopover);
    });

    oldHeader.replaceWith(newHeader);
};

const removeLeftColumn = () => {
    const leftColumn = document.querySelector("#colunaprincipal");
    const rightColumn = document.querySelector("#colunaextra");

    const map = leftColumn.querySelector("#caixa-campus");
    const mapImage = map.querySelector("img");
    mapImage.src = chrome.runtime.getURL("images/feup-map.svg");
    mapImage.width = 113;
    mapImage.height = 142;
    rightColumn.append(map);

    leftColumn.remove();
};

export const changeLayout = () => {
    // Move all scripts and styles to head
    const scripts = document.querySelectorAll("script, link, style");
    document.head.append(...scripts);

    // Simplify layout
    const involucro = document.querySelector("#involucro");
    document.body.append(...involucro.children);
    involucro.remove();

    const envolvente = document.querySelector("#envolvente");
    document.body.append(...envolvente.children);
    envolvente.remove();

    document
        .querySelectorAll("#rodape, #ferramentas")
        .forEach((x) => x.remove());

    replaceHeader();
    removeLeftColumn();
};
