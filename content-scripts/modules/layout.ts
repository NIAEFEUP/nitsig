import { AuthSession } from "../types";
import Header from "../components/Header";

export const changeLayout = async () => {

    // Move all scripts and styles to head
    const scripts = document.querySelectorAll("script, link, style");
    document.head.append(...Array.from(scripts));

    // TODO(thePeras): Why?TT
    // Simplify layout

    const involucro = document.querySelector("#involucro");
    if (involucro) {
        document.body.append(...Array.from(involucro.children));
        involucro.remove();
    }

    const envolvente = document.querySelector("#envolvente");
    if (envolvente) {
        document.body.append(...Array.from(envolvente.children));
        envolvente.remove();
    }

    // TODO(thePeras): This should be done in css
    document
        .querySelectorAll("#rodape, #ferramentas")
        .forEach((x) => x.remove());

    replaceHeader();
    removeLeftColumn();
};

const replaceHeader = () => {
    const oldHeader = document.querySelector("#cabecalho");
    if (!oldHeader) return;
    const autenticacao = oldHeader.querySelector(".autenticacao");
    if (!autenticacao) return;

    if (autenticacao.classList.contains("autenticado")) {

        let auth: AuthSession = {
            name: autenticacao.querySelector(".nome")?.textContent!,
            number: autenticacao.querySelector("img")?.src.slice(-9)!,
            hasNotifications: oldHeader.querySelector(".notificacao") !== null,
        };

        oldHeader.replaceWith(Header({ auth }));
        return;
    }

    oldHeader.replaceWith(Header({}));
}

const removeLeftColumn = () => {
    const leftColumn = document.querySelector("#colunaprincipal");
    const rightColumn = document.querySelector("#colunaextra");
    if (!leftColumn || !rightColumn) return;

    // Move map to right column
    const map = leftColumn.querySelector("#caixa-campus");
    if (!map) return;
    const mapImage = map.querySelector("img");
    if (!mapImage) return;

    mapImage.src = chrome.runtime.getURL("images/feup-map.svg");
    mapImage.width = 113;
    mapImage.height = 142;

    const newMap = map.cloneNode(true);
    rightColumn.append(newMap);
};