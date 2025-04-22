// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";

type LinkTabProps = {
    href: string;
};

type ButtonTabProps = {
    id: string;
    active?: boolean;
};

type TabProps = LinkTabProps | ButtonTabProps;

const Tab: JSX.Component<TabProps> = (props, children) => {
    if ("href" in props) {
        const active = document.location.href.includes(props.href);

        return (
            <a href={props.href} class="se-tab" data-se-active={active}>
                {children}
            </a>
        );
    } else if ("id" in props) {
        const onclick = () => {
            const tabs = document.querySelectorAll<HTMLElement>(".se-tab");
            const pages =
                document.querySelectorAll<HTMLElement>(".se-tab-page");

            tabs.forEach((tab) => {
                tab.dataset.seActive = String(tab.dataset.seTabId === props.id);
            });
            pages.forEach((page) => {
                page.dataset.seActive = String(
                    page.dataset.seTabId === props.id,
                );
            });
        };

        return (
            <button
                class="se-tab"
                data-se-tab-id={props.id}
                data-se-active={props.active}
                onclick={onclick}
            >
                {children}
            </button>
        );
    }

    return <></>;
};

export default Tab;
