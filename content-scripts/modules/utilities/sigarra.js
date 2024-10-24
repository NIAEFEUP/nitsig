/**
 * Checks if user is authenticated
 *
 * @returns true if user is authenticated, false otherwise
 */
export const isAuth = () => {
    return document.querySelector("#se-auth-form") == null;
};

/**
 * Fetches the user's "up" number
 *
 * @returns the "up" number unique to each user
 */
export const getUP = () => {
    if (isAuth()) {
        const pfp = document.querySelector("#se-auth-profile-button > img");

        return pfp.src.substr(-9, pfp.src.length);
    }
};

/**
 * @returns the current location path
 */
export const getPath = () => {
    const url = window.location.pathname;
    return url.split("/").pop().toLowerCase();
};
