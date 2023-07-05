/**
 * Checks if user is authenticated
 * 
 * @returns true if user is authenticated, false otherwise
 */
export const isAuth = async () => {
  const authDiv = document.getElementsByClassName("autenticado");
  return authDiv.length > 0;
};

/**
 * Fetches the user's "up" number
 * 
 * @returns the "up" number unique to each user
 */
export const getUP = async () => {
  if (isAuth()) {
    const pfp = document.querySelector(".autenticado > .fotografia > img");

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


