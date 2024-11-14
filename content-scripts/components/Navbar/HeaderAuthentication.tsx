// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";
import { AuthSession } from "../../types";
import { togglePopover } from "../../modules/utilities/popover";
import Button from "../Button";
import Icon from "../Icon";

interface Props {
    auth: AuthSession | null;
}

const Authentication = ({ auth }: Props) => {
    const current_year: number = new Date().getFullYear();

    if (auth)
        return (
            <div id="se-auth">
                <Button
                    icon="ri-notification-line"
                    radius="full"
                    onclick={() => togglePopover("se-auth-notifications-menu")}
                    className={auth.hasNotifications ? "se-badge" : ""}
                />
                <div id="se-auth-notifications-menu">
                    <input
                        type="radio"
                        name="se-auth-notifications"
                        id="se-auth-new-notifications-radio"
                        checked
                    />
                    <input
                        type="radio"
                        name="se-auth-notifications"
                        id="se-auth-read-notifications-radio"
                    />
                    <div id="se-auth-notifications-header">
                        <label htmlFor="se-auth-new-notifications-radio">
                            Novas
                        </label>
                        <label htmlFor="se-auth-read-notifications-radio">
                            Lidas
                        </label>
                    </div>
                    <div id="se-auth-notifications-list">
                        <ol id="se-auth-new-notifications"></ol>
                        <ol id="se-auth-read-notifications"></ol>
                        <div id="se-auth-empty-notifications">
                            <Icon name="ri-notification-off-line" />
                            <span>Sem notificações</span>
                        </div>
                        <div className="se-loading-indicator">
                            <Icon name="ri-refresh-line" />
                        </div>
                    </div>
                </div>

                <button
                    id="se-auth-profile-button"
                    onclick={() => togglePopover("se-auth-profile-menu")}
                >
                    <img
                        src={`fotografias_service.foto?pct_cod=${auth.number}`}
                        alt="Foto de perfil"
                    />
                </button>
                <div id="se-auth-profile-menu">
                    <div id="se-auth-header">
                        <span>{auth.name}</span>
                        <span>{auth.number}</span>
                    </div>
                    <nav id="se-auth-profile-links">
                        <a
                            className="se-auth-profile"
                            href={`fest_geral.cursos_list?pv_num_unico=${auth.number}`}
                        >
                            <Icon name="ri-user-line" />
                            Perfil
                        </a>
                        <a
                            href={`hor_geral.estudantes_view?pv_num_unico=${auth.number}&pv_ano_lectivo=${current_year}&pv_periodos=1`}
                        >
                            <Icon name="ri-calendar-line" />
                            Horário
                        </a>
                        <a
                            href={`gpag_ccorrente_geral.conta_corrente_view?pct_cod=${auth.number}`}
                        >
                            <Icon name="ri-money-euro-circle-line" />
                            Conta corrente
                        </a>
                        <a
                            id="se-logout-button"
                            href="vld_validacao.sair?p_address=WEB_PAGE.INICIAL"
                        >
                            <Icon name="ri-logout-box-line" />
                            Terminar Sessão
                        </a>
                    </nav>
                </div>
            </div>
        );

    return (
        <div id="se-auth">
            <Button
                title="Iniciar Sessão"
                radius="sm"
                onclick={() => togglePopover("se-auth-form")}
            />
            <form
                id="se-auth-form"
                action="vld_validacao.validacao"
                method="post"
            >
                <input
                    type="hidden"
                    name="p_address"
                    value="web_page.inicial"
                />
                <input type="hidden" name="p_app" value="162" />
                <input type="hidden" name="p_amo" value="55" />
                <label htmlFor="se-auth-user" className="acs">
                    Utilizador
                </label>
                <input
                    id="se-auth-user"
                    type="text"
                    name="p_user"
                    placeholder="Utilizador"
                    autoComplete="username"
                />
                <label htmlFor="se-auth-pass" className="acs">
                    Palavra-passe
                </label>
                <input
                    id="se-auth-pass"
                    type="password"
                    name="p_pass"
                    placeholder="Palavra-passe"
                    autoComplete="current-password"
                />
                <Button title="Iniciar Sessão" color="primary" radius="sm" />
                <span className="se-separator">ou</span>
                {/* What to do here? It is an <a> not a button. Should the button has an href? */}
                <a
                    href="vld_validacao.federate_login?p_redirect=web_page.Inicial"
                    id="se-auth-federate"
                    className="se-button"
                >
                    <Icon name="ri-shield-user-line" />
                    Autenticação Federada
                </a>
                <a href="gent_geral.list_services" id="se-auth-reset">
                    Recuperar palavra-passe
                </a>
            </form>
        </div>
    );
};

export default Authentication;
