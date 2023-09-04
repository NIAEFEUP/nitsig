import { elementFromHtml } from "./utilities/elementFromHtml";

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

const createNewHeader = (auth) =>
    elementFromHtml(/*html*/ `
        <header id="se-header">
            <a id="se-logo" href="/feup"><img src="${chrome.runtime.getURL(
                "images/FEUP.svg"
            )}"></a>
            <nav id="se-header-links">
                <a href="web_base.gera_pagina?p_pagina=ESTUDANTES">Estudantes</a>
                <a href="uni_geral.nivel_list?pv_nivel_id=4">Serviços</a>
                <a href="web_base.gera_pagina?p_pagina=1182">Faculdade</a>
                <a href="web_base.gera_pagina?p_pagina=1831">Pesquisa</a>
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

    const authElement = newHeader.querySelector("#se-auth");
    const toggleAuth = () => authElement?.classList.toggle("se-auth-open");

    newHeader
        .querySelector("#se-auth-button")
        ?.addEventListener("click", toggleAuth);
    newHeader
        .querySelector("#se-auth-close-button")
        ?.addEventListener("click", toggleAuth);
    newHeader
        .querySelector("#se-auth-profile-button")
        ?.addEventListener("click", toggleAuth);

    oldHeader.replaceWith(newHeader);
};

const removeLeftColumn = () => {
    const leftColumn = document.querySelector("#colunaprincipal");
    const rightColumn = document.querySelector("#colunaextra");

    const map = leftColumn.querySelector("#caixa-campus");
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
