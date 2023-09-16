import { fetchSigarraPage } from "./utilities/pageUtils";
import { getStorage, setStorage } from "./utilities/storage";

const emptyLogin = { auto_login: { verifed: false, user_info: "" } };

var auto_login = {};

export const rememberLogin = async (data) => {
    if (!(data?.autoLogin === "on")) return;

    const isAuthenticated = document.querySelector('#se-auth-form') == null;

    auto_login = await getStorage("auto_login");
    if (auto_login === null) {
        await setStorage(emptyLogin);
        auto_login = emptyLogin;
    }
    if (!auto_login.verifed) {
        if (!isAuthenticated) {
            //inject button onClick
            document
                .querySelector('#se-auth-form')
                .addEventListener("submit", loginButtonHandler);
        }

    } else if (!isAuthenticated) {
        const res = await tryLogin(auto_login);
        // NOTE(luisd): if this happens probably the login is now invalid
        // eg.: user changes password / expires
        // we should then prompt the user to login again
        if(res.querySelector("p.aviso-invalidado") != null){
            await setStorage(emptyLogin);
            return; 
        }
        await chrome.runtime.sendMessage({ type: "login", auto_login: auto_login });
        window.location.reload();
        

    }
    if (isAuthenticated) {
        document.querySelector("#se-logout-button").onclick = function () {
            setStorage(emptyLogin);
        }
    };
};



export const loginButtonHandler = (event) => {
    event.preventDefault();

    document.getElementById("se-auth-user").classList.remove("se-auth-invalid");
    document.getElementById("se-auth-pass").classList.remove("se-auth-invalid");
    document.getElementById("se-auth-wrong-details")?.remove();




    auto_login.user_info = btoa(JSON.stringify({
        user: document.getElementById("se-auth-user").value,
        pass: document.getElementById("se-auth-pass").value
    }));

    tryLogin(auto_login).then(
        async (res) => {
            if(res.querySelector("p.aviso-invalidado") != null){
                document.getElementById("se-auth-user").classList.add("se-auth-invalid");
                document.getElementById("se-auth-pass").classList.add("se-auth-invalid");
                const p = document.createElement('p');
                p.id = "se-auth-wrong-details";
                p.textContent = "Utilizador ou password incorreta."
                document.querySelector('#se-auth-form').prepend(p);
                console.log("Wrong details... try again");
                return;
            }

            const loggedIn = await chrome.runtime.sendMessage({ type: "login", auto_login: auto_login });
            if (loggedIn === false) {
                return;
            } else {
                window.location.reload();
            }
        }
    );
    return false;
}


async function tryLogin(auto_login) {
    const user_info = JSON.parse(atob(auto_login.user_info));
    const formBody = new URLSearchParams();
    formBody.append("p_app", 162);
    formBody.append("p_amo", 55);
    formBody.append("p_address", "WEB_PAGE.INICIAL");
    formBody.append("p_user", user_info.user);
    formBody.append("p_pass", user_info.pass);
    const url = new URL('https://sigarra.up.pt/feup/pt/vld_validacao.validacao');
    url.search = formBody.toString();
    return await fetchSigarraPage(url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );
}
