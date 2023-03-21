import { getStorage, setStorage } from "./utilities/storage";

/**
 * This function is to wait syncronously, because onclick should not be async in the login context
 * @param {millisseconds to wait syncronously} ms 
 */
function wait(ms) {
    var start = Date.now(),
        now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}

const emptyLogin = {autoLogin: {active: true,verifed: false, user_info:""}};


export const rememberLogin = async () => {
    document.addEventListener("DOMContentLoaded", async () =>{
        var auto_login = await getStorage("autoLogin");
        if(auto_login === undefined){
            await setStorage(emptyLogin);
        }
        console.log(auto_login);
        if(auto_login.active == true){
            if(auto_login.user_info == ""){
                if(document.getElementsByClassName("autenticado").length === 0){
                    //inject button onClick
                    document
                    .querySelector(".autenticacao > form:nth-child(2) > button:nth-child(9)")
                    .onclick = function(){
                        auto_login.user_info = btoa(JSON.stringify({
                            user:document.getElementById("user").value, 
                            pass:document.getElementById("pass").value
                        }));
                        setStorage({autoLogin: auto_login});
                        wait(200);
                        
                    };
                }
    
            } else if(auto_login.verifed == false && !document.URL.includes("vld_validacao.validacao")){
                if(document.getElementsByClassName("autenticado").length === 0){
                    auto_login.user_info = "";
                    await setStorage({autoLogin: auto_login});
                } else{
                    auto_login.verifed = true;
                    await setStorage({autoLogin: auto_login});
                }
            }
            if(document.getElementsByClassName("autenticado").length !== 0){
                document.getElementsByClassName("terminar-sessao").item(0).onclick = function(){
                    setStorage(emptyLogin);
                    wait(200);
                }
            };
        }
    
    });
};