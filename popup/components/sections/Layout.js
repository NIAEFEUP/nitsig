import Section from "../layout/Section";
import SwitchControl from "../controls/SwitchControl";

const Layout = () => (
    <Section title="Aspetos Visuais">
        <SwitchControl label="Ativar barra de navegação" storageKey="navbar" />
        <SwitchControl label="Esconder atalhos" storageKey="shortcuts" />
        <SwitchControl label="Mudar fonte de letra" storageKey="font" />
    </Section>
);

export default Layout;
