import { selectorModule } from "./base/selector";
import { getUP } from "~/common/sigarra";

export default selectorModule(".autenticado", (element) => {
    const nome = element.querySelector<HTMLAnchorElement>(".nome");
    const pfp = element.querySelector<HTMLAnchorElement>(".fotografia");
    const up = getUP();

    if (nome == null || pfp == null || up == null) return;

    const newLink = `https://sigarra.up.pt/feup/pt/fest_geral.cursos_list?pv_num_unico=${up}`;
    nome.href = newLink;
    pfp.href = newLink;
});
