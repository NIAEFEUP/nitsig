import { AuthSession } from "../types";
import Header from "../components/Header";
import { fetchSigarraPage } from "./utilities/pageUtils";
import Button from "../components/Button";

export const changeLayout = async () => {
    // Move all scripts and styles to head
    const scripts = document.querySelectorAll("script, link, style");
    document.head.append(...Array.from(scripts));

    // Simplify layout
    const involucro = document.querySelector("#involucro");
    if (involucro) {
        document.body.append(...Array.from(involucro.children));
        involucro.remove();
    }

    const envolvente = document.querySelector("#envolvente");
    if (envolvente) {
        document.body.append(...Array.from(envolvente.children));
        envolvente.remove();
    }

    replaceHeader();
    removeLeftColumn();
};

const replaceHeader = () => {
    const oldHeader = document.querySelector("#cabecalho");
    if (!oldHeader) return;
    const autenticacao = oldHeader.querySelector(".autenticacao");
    if (!autenticacao) return;

    if (autenticacao.classList.contains("autenticado")) {
        const auth: AuthSession = {
            name: autenticacao.querySelector(".nome")!.textContent!,
            number: autenticacao.querySelector("img")!.src.slice(-9)!,
            hasNotifications: oldHeader.querySelector(".notificacao") !== null,
        };

        const newHeader = Header({ auth });
        oldHeader.replaceWith(newHeader);

        const notificationsButton = newHeader.querySelector(
            "#se-auth-notifications-button",
        );

        if (notificationsButton) {
            notificationsButton.addEventListener("click", () => {
                loadNotifications();
            });
        }

        return;
    }

    oldHeader.replaceWith(Header({}));
};

const removeLeftColumn = () => {
    const leftColumn = document.querySelector("#colunaprincipal");
    const rightColumn = document.querySelector("#colunaextra");
    if (!leftColumn || !rightColumn) return;

    // Move map to right column
    const map = leftColumn.querySelector("#caixa-campus");
    if (!map) return;
    const mapImage = map.querySelector("img");
    if (!mapImage) return;

    mapImage.src = chrome.runtime.getURL("images/feup-map.svg");
    mapImage.width = 113;
    mapImage.height = 142;

    const newMap = map.cloneNode(true);
    rightColumn.append(newMap);
};

const loadNotifications = async (): Promise<void> => {
    const notificationsList = document.querySelector<HTMLUListElement>(
        "#se-auth-notifications-list",
    );

    if (!notificationsList) return;
    if (notificationsList.hasAttribute("data-se-loaded")) return;
    if (notificationsList.classList.contains("se-loading")) return;

    notificationsList.classList.add("se-loading");

    const newNotifications = document.querySelector<HTMLUListElement>(
        "#se-auth-new-notifications",
    );
    const readNotifications = document.querySelector<HTMLUListElement>(
        "#se-auth-read-notifications",
    );

    const dateFormatter = new Intl.DateTimeFormat("pt-PT", {
        dateStyle: "short",
    });

    await Promise.allSettled(
        [
            [newNotifications, "P"],
            [readNotifications, "F"],
        ].map(async (value) => {
            const [list, type] = value as [HTMLUListElement | null, string];
            if (!list) return;

            const response = await fetchSigarraPage(
                `gnots_ajax.show_lista_notifs?pv_estado=${type}`,
            );

            response.querySelectorAll("tr.d").forEach((notification) => {
                const date =
                    notification.querySelector("td:nth-child(3)")?.textContent;
                const title =
                    notification.querySelector("td:nth-child(4)")?.textContent;
                const answer = notification.querySelector<HTMLInputElement>(
                    "td:nth-child(7) input",
                );

                //TODO(thePeras): Could be a jsx component
                const li = document.createElement("li");
                li.classList.add("se-notification");

                const time = document.createElement("time");
                time.classList.add("se-notification-time");
                if (date) {
                    time.dateTime = date;
                    time.textContent = dateFormatter.format(new Date(date));
                }

                const span = document.createElement("span");
                span.classList.add("se-notification-title");
                if (title) {
                    span.textContent = title;
                }

                li.append(span, time);

                if (answer) {
                    const markAsRead = async (e: Event) => {
                        e.preventDefault();
                        e.stopPropagation();

                        await fetchSigarraPage(
                            `gnots_geral.nots_list_sub?${answer.name}=${answer.value}`,
                        );

                        const targetElement = e.target as HTMLElement;
                        targetElement.remove();

                        readNotifications?.insertBefore(
                            li,
                            readNotifications.firstChild,
                        );
                    };

                    li.append(
                        Button({
                            icon: "ri-check-line",
                            className: "se-notification-button",
                            onclick: markAsRead,
                        }),
                    );
                }

                list.append(li);
            });
        }),
    );

    notificationsList.classList.remove("se-loading");
    notificationsList.setAttribute("data-se-loaded", "");
};
