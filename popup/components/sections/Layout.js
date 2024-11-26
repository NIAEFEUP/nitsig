import Section from "../layout/Section";
import SwitchControl from "../controls/SwitchControl";
import { RiQuestionLine } from "@remixicon/react";
import { Tooltip } from "react-tooltip";

const Layout = () => (
    <Section title="Aspetos Visuais">
        <SwitchControl
            label={
                <>
                    Ativar barra de navegação
                    <span className="question-icon">
                        <RiQuestionLine data-tooltip-id="navbar-tooltip" />
                    </span>
                    <Tooltip 
                        className="tooltip"
                        id="navbar-tooltip" 
                        content={ <> Muda as opções da barra <br /> lateral para a parte superior. </>} 
                        place="top"
                    />
                </>
            }
            storageKey="navbar"
        />
        <SwitchControl
            label={
                <>
                    Esconder atalhos
                    <span className="question-icon">
                        <RiQuestionLine data-tooltip-id="shortcuts-tooltip"/>
                    </span>
                    <Tooltip 
                        className="tooltip"
                        id="shortcuts-tooltip" 
                        content={ <> Esconde a opção dos atalhos. </>} 
                        place="top"
                    />
                </>
            }
            storageKey="shortcuts"
        />
        <SwitchControl
            label={
                <>
                    Mudar fonte de letra
                    <span className="question-icon">
                        <RiQuestionLine data-tooltip-id="font-tooltip"/>
                    </span>
                    <Tooltip 
                        className="tooltip"
                        id="font-tooltip" 
                        content={ <> Muda a fonte do texto para Roboto. </>} 
                        place="top"
                    />
                </>
            }
            storageKey="font"
        />
    </Section>
);

export default Layout;
