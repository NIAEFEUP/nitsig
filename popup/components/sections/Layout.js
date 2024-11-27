import Section from "../layout/Section";
import SwitchControl from "../controls/SwitchControl";

const Layout = () => (
    <Section title="Aspetos Visuais">
        <SwitchControl
            label="Ativar barra de navegação"
            storageKey="navbar"
            tooltipContent={
                <>
                    Muda as opções da barra <br />
                    lateral para a parte superior.
                </>
            }
            tooltipId="navbar-tooltip"
        />
        <SwitchControl
            label="Esconder atalhos"
            storageKey="shortcuts"
            tooltipContent={<>Esconde a opção dos atalhos.</>}
            tooltipId="shortcuts-tooltip"
        />
        <SwitchControl
            label="Mudar fonte de letra"
            storageKey="font"
            tooltipContent={<>Muda a fonte do texto para Roboto.</>}
            tooltipId="font-tooltip"
        />
    </Section>
);

export default Layout;
