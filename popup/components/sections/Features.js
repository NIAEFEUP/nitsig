import Section from "../layout/Section";
import SwitchControl from "../controls/SwitchControl";

const Layout = () => (
    <Section title="Funcionalidades">
        <SwitchControl
            label="Relembrar utilizador"
            storageKey="autoLogin"
            tooltipContent={
                <>
                    Depois de ativada a opção, <br />
                    o login deve ser feito pelas credenciais <br />
                    não pela autenticação federada.
                </>
            }
            tooltipId="autoLogin-tooltip"
        />
    </Section>
);

export default Layout;
