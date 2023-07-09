import pages from "./pages";

const loadPage = () =>
    pages.forEach(
        (page) => page.path.test(window.location.pathname) && page.fun(),
    );

loadPage();
