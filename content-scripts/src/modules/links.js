import { isAuth, getUP } from "./utilities/sigarra";

/**
 * Changes the link on the top bar Profile Picture and Name
 */
export const changeProfileLink = async () => {
    if (isAuth()) {
      const nome = document.querySelector('.autenticado > .nome');
      const pfp = document.querySelector('.autenticado > .fotografia');
      const up = await getUP();
      const newLink = `https://sigarra.up.pt/feup/pt/fest_geral.cursos_list?pv_num_unico=${up}`;
      nome.href = newLink;
      pfp.href = newLink;
    }
  }
  