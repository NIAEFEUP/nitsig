import Browser from "webextension-polyfill";

export default (value: boolean) => {
    if (value) rememberLogin();
};

interface AutoLogin {
    verified: boolean;
    userInfo: string;
}

const emptyLogin = { verified: false, userInfo: "" } as const;

let autoLogin: AutoLogin;

const rememberLogin = async () => {
    autoLogin = (await Browser.storage.local.get("autoLoginCache"))[
        "autoLoginCache"
    ];

    if (autoLogin === undefined) {
        await Browser.storage.local.set({ autoLogin: emptyLogin });
        autoLogin = emptyLogin;
    }

    if (!autoLogin.verified) {
        if (document.querySelector(".autenticado") == null) {
            //inject button onClick
            document
                .querySelector<HTMLFormElement>(".autenticacao > form")
                ?.addEventListener("submit", loginButtonHandler);
        }
    } else if (document.querySelector(".autenticado") == null) {
        const res = await tryLogin();
        if (res.status != 200) {
            console.log("Something went wrong while logging in...");
            return;
        }
        //check if there is a error while loading page
        const htmlRes = document.createElement("html");
        htmlRes.innerHTML = await res.text();
        if (htmlRes.querySelector("p.aviso-invalidado") != null) {
            await Browser.storage.local.set({ autoLoginCache: emptyLogin });
        }
        await Browser.runtime.sendMessage({
            type: "login",
            autoLogin,
        });
    }
    if (document.querySelector(".autenticado") != null) {
        document.querySelector(".terminar-sessao")?.addEventListener(
            "click",
            () =>
                void Browser.storage.local.set({
                    autoLoginCache: emptyLogin,
                }),
        );
    }
};

function loginButtonHandler(event: SubmitEvent) {
    event.preventDefault();
    autoLogin.userInfo = btoa(
        JSON.stringify({
            user: document.querySelector<HTMLInputElement>("#user")?.value,
            pass: document.querySelector<HTMLInputElement>("#pass")?.value,
        }),
    );

    tryLogin().then(async (res) => {
        if (!res.ok) {
            console.log("Something went wrong while logging in...");
            return;
        }
        const loggedIn = await Browser.runtime.sendMessage({
            type: "login",
            autoLogin,
        });
        if (loggedIn === false) {
            //TODO: (issue #59) show error to user
            console.log("Wrong details... try again");
            return;
        }
    });
}

async function tryLogin() {
    const userInfo = JSON.parse(atob(autoLogin.userInfo));
    const formBody = new URLSearchParams();
    formBody.append("p_app", "162");
    formBody.append("p_amo", "55");
    formBody.append("p_address", "WEB_PAGE.INICIAL");
    formBody.append("p_user", userInfo.user);
    formBody.append("p_pass", userInfo.pass);
    const url = new URL(
        "https://sigarra.up.pt/feup/pt/vld_validacao.validacao",
    );
    url.search = formBody.toString();
    return await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
}
