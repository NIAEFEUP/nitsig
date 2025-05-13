// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";

type TabPageProps = {
    id: string;
};

const TabPage: JSX.Component<TabPageProps> = ({ id }, children) => {
    return (
        <div class="se-tab-page" data-se-tab-id={id}>
            {children}
        </div>
    );
};

export default TabPage;
