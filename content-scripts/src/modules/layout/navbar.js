export const injectNavBar = () => {
    console.log("Injecting navbar");
    const breadcrumb_bar = document.querySelector("#barralocalizacao");
    const nav_bar = document.createElement("nav");

    fetch(chrome.runtime.getURL("html/navbar.html"))
        .then((response) => response.text())
        .then((html) => {
            nav_bar.innerHTML = html;
            breadcrumb_bar.after(nav_bar);

            // Dropdowns must be defined by the same order as the navbar items
            const navbar_items = document.querySelectorAll('.navbar-item');
            const dropdowns = document.querySelectorAll('.dropdown');

            for (let i = 0; i < navbar_items.length; i++) {
                const doDropdown = (force_open = false, force_close = false) => {
                    // Close current dropdown
                    const currentDropdown = document.querySelector('.dropdown:not(.mhide)');
                    if (currentDropdown && currentDropdown !== dropdowns[i]) {
                        currentDropdown.classList.add('mhide');
                    }

                    // Toggle new dropdown
                    if (!force_close && (force_open || dropdowns[i].classList.contains('mhide'))) {
                        dropdowns[i].classList.remove('mhide');
                    } else if (force_close || !dropdowns[i].classList.contains('mhide')) {
                        dropdowns[i].classList.add('mhide');
                    }
                }

                navbar_items[i].addEventListener('click', () => doDropdown());
                navbar_items[i].addEventListener('mouseenter', () => doDropdown(true));
                nav_bar.addEventListener('mouseleave', () => doDropdown(false, true));
            }
        }
        );
}