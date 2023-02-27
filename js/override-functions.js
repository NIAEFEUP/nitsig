function expandir_colapsar(id, event){
    const element = document.getElementById(id);
    if(element.style.opacity > 0){
        element.style.visibility = "hidden";
        element.style.opacity = "0";
        element.style.height = "0";
        element.style.margin = "0";
    }else{
        element.style.visibility = "visible";
        element.style.opacity = "1";
        element.style.height = "auto";
        element.style.margin = "1rem 0";
    }
}