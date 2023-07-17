import React from "react";
import LayoutContent from "./LayoutContent";

const Layout = () => (
    <section className="flex flex-col gap-y-2">
        <label
            htmlFor="user-control-interface"
            className="dark:text-accentOneDark text-accentOne text-sm font-bold">
            Layout
        </label>
        <div id="user-control-interface">
            <LayoutContent />
        </div>
    </section>
);

export default Layout;
