import { getStorage, setStorage } from "./utilities/storage";

const emptyLogin = { auto_login: { verifed: false, user_info: "" } };

var auto_login;

export const rememberLogin = async (data) => {
    if (!(data?.autoLogin === "on")) return;

    auto_login = await getStorage("auto_login");
    console.log(auto_login);
    if (auto_login === undefined) {
        await setStorage(emptyLogin);
        auto_login = emptyLogin;
    }
    if (!auto_login.verifed) {
        if (document.querySelector(".autenticado") == null) {
            //inject button onClick
            document
                .querySelector(".autenticacao > form")
                .addEventListener("submit", loginButtonHandler);
        }

    } else if (document.querySelector(".autenticado") == null) {
        const res = await tryLogin(auto_login);
        if (res.status != 200) {
            console.log("Something went wrong while logging in...");
            return;
        }
        //check if there is a error while loading page
        const htmlRes = document.createElement('html');
        htmlRes.innerHTML = await res.text();
        if(htmlRes.querySelector("p.aviso-invalidado") != null){
            await setStorage(emptyLogin);
        }
        await chrome.runtime.sendMessage({ type: "login", auto_login: auto_login });

    }
    if (document.querySelector(".autenticado") != null) {
        document.querySelector(".terminar-sessao").onclick = function () {
            setStorage(emptyLogin);
        }
    };
};



function loginButtonHandler(event) {
    event.preventDefault();
    auto_login.user_info = btoa(JSON.stringify({
        user: document.getElementById("user").value,
        pass: document.getElementById("pass").value
    }));

    tryLogin(auto_login).then(
        async (res) => {
            if (res.status != 200) {
                console.log("Something went wrong while logging in...");
                return;
            }
            const loggedIn = await chrome.runtime.sendMessage({ type: "login", auto_login: auto_login });
            if (loggedIn === false) {
                //TODO: (issue #59) show error to user
                console.log("Wrong details... try again");
                return;
            }
        }
    );
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
    return await fetch(url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );
}
