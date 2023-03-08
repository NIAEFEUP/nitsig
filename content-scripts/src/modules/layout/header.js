export const changeLayout = () => {
    const header = document.querySelector("#cabecalho");

    document.head.append(...header.querySelectorAll(":is(script, link)"));

    const leftButton = header.querySelector("#toggle-coluna-principal");
    leftButton.append(...leftButton.firstElementChild.children);
    leftButton.firstElementChild.remove();

    const logo = header.querySelector(".logotipo-alternativo");

    const auth = header.querySelector(".autenticacao");
    auth.querySelector(".terminar-sessao")?.classList.add("se-icon", "ri-logout-box-line");

    const rightButton = header.querySelector("#toggle-coluna-secundaria");
    rightButton.append(...rightButton.firstElementChild.children);
    rightButton.firstElementChild.remove();

    header.replaceChildren(leftButton, logo, auth, rightButton);
}
