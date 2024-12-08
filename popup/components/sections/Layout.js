import Section from "../layout/Section";
import SwitchControl from "../controls/SwitchControl";

const Layout = () => (
    <Section title="Aspetos Visuais">
        <SwitchControl
            label="Ativar barra de navegação"
            storageKey="navbar"
            tooltipContent={
                <>
                    Ativar navegação superior e esconder
                    <br />
                    barra de navegação da esquerda.
                </>
            }
            tooltipId="navbar-tooltip"
        />
        <SwitchControl
            label="Esconder atalhos"
            storageKey="shortcuts"
            tooltipContent={
                <>
                    Esconder a opção dos atalhos <br />
                    da barra lateral direita.
                </>
            }
            tooltipId="shortcuts-tooltip"
        />
        <SwitchControl
            label="Mudar fonte de letra"
            storageKey="font"
            tooltipContent={
                <>
                    Alterar a fonte do <br />
                    texto para Roboto.
                </>
            }
            tooltipId="font-tooltip"
        />
        <SwitchControl
            label="Expandir Secções"
            storageKey="expand"
            tooltipContent={
                <>
                    Expandir as secções <br />
                    das fichas das uc.
                </>
            }
            tooltipId="expand-tooltip"
        />
    </Section>
);

export default Layout;
