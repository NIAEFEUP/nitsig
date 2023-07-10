import React from "react";
import SwitchControl from "../controls/SwitchControl";

const LayoutContent = () => (
    <form className="flex flex-col items-center justify-between px-4 dark:bg-bgTwoDark bg-bgTwo rounded-2xl">
        <div className="w-full py-4">
            <div className="flex flex-col gap-y-4">
                <SwitchControl
                    label="Ativar barra de navegação"
                    storageKey="key1"
                />
                <SwitchControl
                    label="Esconder atalhos"
                    storageKey="shortcuts"
                />
                <SwitchControl
                    label="Relembrar utilizador"
                    storageKey="autoLogin"
                />
            </div>
        </div>
    </form>
);

export default LayoutContent;
