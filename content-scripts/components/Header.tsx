import jsx from "texsaur";

import HeaderLinks from "./HeaderLinks";
import Authentication from "./HeaderAuthentication";
import { AuthSession } from "../types";

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
    "Calendário escolar":
      "web_base.gera_pagina?p_pagina=página estática genérica 106",
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

interface Props {
  auth?: AuthSession | null;
}

const Header = ({ auth = null }: Props) => {
  return (
    <header id="se-header">
      <a id="se-logo" href="/feup">
        <img src={chrome.runtime.getURL("images/FEUP.svg")} alt="FEUP Logo" />
      </a>
      <HeaderLinks links={HEADER_LINKS} />
      <Authentication auth={auth} />
    </header>
  );
};

export default Header;
