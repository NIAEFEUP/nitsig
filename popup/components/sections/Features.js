import Section from "../layout/Section";
import SwitchControl from "../controls/SwitchControl";
import { RiQuestionLine } from "@remixicon/react";
import { Tooltip } from "react-tooltip";

const Layout = () => (
    <Section title="Funcionalidades">
        <SwitchControl
            label={
                <>
                    Relembrar utilizador
                    <span className="question-icon">
                        <RiQuestionLine data-tooltip-id="autoLogin-tooltip" />
                    </span>
                    <Tooltip 
                        className="tooltip"
                        id="autoLogin-tooltip" 
                        content={ <> Depois de ativada a opção, <br />o login deve ser feito pelas credenciais, <br /> não pela autenticação federada. </>} 
                        place="top"
                    />
                </>
            }
            storageKey="autoLogin"
        />
    </Section>
);

export default Layout;
