import { getStorage, setStorage } from "./utilities/storage";

const emptyLogin = { autoLogin: { active: true, verifed: false, user_info: "" } };


export const rememberLogin = async () => {
    var auto_login = await getStorage("autoLogin");
    if (auto_login === undefined) {
        await setStorage(emptyLogin);
        auto_login = emptyLogin;
    }
    if (auto_login.active == true) {
        console.log(auto_login);
        if (auto_login.user_info == "") {
            if (document.getElementsByClassName("autenticado").length === 0) {
                //inject button onClick
                document
                    .querySelector(".autenticacao > form:nth-child(2) > button")
                    .addEventListener("click", (event) => {
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
                                 if(loggedIn === false){
                                    //TODO: (issue #59) show error to user
                                    console.log("Wrong details... try again");
                                    return;
                                }
                            }
                        );
                    })
            }

        } else if (document.getElementsByClassName("autenticado").length === 0){
            tryLogin(auto_login).then(
                async (res) => {
                    if (res.status != 200) {
                        console.log("Something went wrong while logging in...");
                        return;
                    }
                    await chrome.runtime.sendMessage({ type: "login", auto_login: auto_login });

                }
            )
        }
        if (document.getElementsByClassName("autenticado").length !== 0) {
            document.getElementsByClassName("terminar-sessao").item(0).onclick = function () {
                setStorage(emptyLogin);
            }
        };
    }

};

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
