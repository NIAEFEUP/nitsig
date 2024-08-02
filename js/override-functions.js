function expandir_colapsar(id, event){
    const element = document.getElementById(id);
    if(isVisible(element)){
        hideElement(element)
    }else{
        bringElement(element)
    }
}

// TODOs MOVE THIS TO BETTER LOCATION
function hideElement(element){
    element.style.visibility = "hidden";
    element.style.opacity = "0";
    element.style.height = "0";
    element.style.margin = "0";
}

function bringElement(element){
    element.style.visibility = "visible";
    element.style.opacity = "1";
    element.style.height = "auto";
    element.style.margin = "1rem 0";
}

function isVisible(element){
    return element.style.opacity > 0;
}