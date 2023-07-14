import "~/content-styles/index.css";

import pages from "./pages";
import modules from "./modules";
import { OptionValues, getOptions } from "~/common/options";
import options from "./options";
import { entries } from "~/common/objects";

const loadPage = () =>
    pages.forEach(
        (page) => page.path.test(window.location.pathname) && page.fun(),
    );

const loadOptions = (changed: OptionValues) =>
    entries(changed).forEach(([key, value]) => options[key](value));

const main = async () => {
    window.addEventListener("DOMContentLoaded", loadPage);

    new MutationObserver((mutations) =>
        modules.forEach((module) => mutations.forEach(module)),
    ).observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
    });

    loadOptions(await getOptions());

    console.log(await getOptions());
};

main();
