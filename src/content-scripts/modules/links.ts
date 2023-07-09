import { getUP } from "./utilities/sigarra";

/**
 * Changes the link on the top bar Profile Picture and Name
 */
export const changeProfileLink = () => {
    const nome = document.querySelector<HTMLAnchorElement>(
        ".autenticado > .nome",
    );
    const pfp = document.querySelector<HTMLAnchorElement>(
        ".autenticado > .fotografia",
    );
    const up = getUP();

    if (nome == null || pfp == null || up == null) return;

    const newLink = `https://sigarra.up.pt/feup/pt/fest_geral.cursos_list?pv_num_unico=${up}`;
    nome.href = newLink;
    pfp.href = newLink;
};
