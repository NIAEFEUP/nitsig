function expandir_colapsar(id, event){
    const element = document.getElementById(id);
    if(element.style.display === "block"){
        element.style.display = "none";
        element.style.transition = "all 1.5s ease";
        element.style.visibility = "hidden";
        element.style.opacity = "0";
        element.style.height = "0";
        return;
    }else{
        element.style.display = "block";
        element.style.transition = "all 1.5s ease";
        element.style.visibility = "visible";
        element.style.opacity = "1";
        element.style.height = "auto";
    }
}