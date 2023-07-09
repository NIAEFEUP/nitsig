/**
 * Checks if user is authenticated
 *
 * @returns true if user is authenticated, false otherwise
 */
export const isAuth = () => {
    const authDiv = document.querySelector(".autenticado");
    return !!authDiv;
};

/**
 * Fetches the user's "up" number
 *
 * @returns the "up" number unique to each user
 */
export const getUP = () => {
    const pfp = document.querySelector<HTMLImageElement>(
        ".autenticado > .fotografia > img",
    );

    if (pfp == null) return null;

    return pfp.src.substring(-9, pfp.src.length);
};

/**
 * @returns the current location path
 */
export const getPath = () => {
    const url = window.location.pathname;
    return url.split("/").pop()?.toLowerCase();
};
