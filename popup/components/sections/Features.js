import Section from "../layout/Section";
import SwitchControl from "../controls/SwitchControl";

const Layout = () => (
    <Section title="Funcionalidades">
        <SwitchControl label="Relembrar utilizador" storageKey="autoLogin" />
    </Section>
);

export default Layout;
