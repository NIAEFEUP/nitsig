import Section from "../layout/Section";
import SwitchControl from "../controls/SwitchControl";

const Layout = () => (
    <Section title="Funcionalidades">
        <SwitchControl
            label="Relembrar utilizador"
            storageKey="autoLogin"
            tooltipContent={
                <>
                    Relogin automático quando a sessão for perdida.
                    <br />
                    Depois de ativada a opção, é necessário repetir o login.
                    <br />
                    Atenção, esta opção apenas funciona com login por
                    <br />
                    credenciais e não como autenticação federada.
                </>
            }
            tooltipId="autoLogin-tooltip"
        />
    </Section>
);

export default Layout;
