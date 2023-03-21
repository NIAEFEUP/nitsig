import throttle from "./utilities/throttle";
import { getPath } from "./utilities/sigarra";

// Resize Listener
export const addResizeListener = () => {
  window.addEventListener(
    "resize",
    throttle(async () => {
      /*

        Code here

      */
    }, 1000)
  );
};

// Append override-functions.js to the page
export const injectOverrideFunctions = () => {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("js/override-functions.js");
  document.body.appendChild(script);
}

/**
 * Reverse the date direction
 * Ex: 2023-10-05 to 05-10-2023
 */
export const reverseDateDirection = () => {
  document.querySelectorAll(".data").forEach(date => {
      date.innerHTML = date.innerHTML.split('-').reverse().join('-');
  });
}

export const currentAccountPage = () => {
  if(getPath() != "gpag_ccorrente_geral.conta_corrente_view") return;

  const saldo = document.querySelector(".formulario #span_saldo_total");
  const nif =  Array.from(document.querySelectorAll(".formulario .formulario-legenda")).filter(el => el.innerHTML.includes("N.I.F."))[0].nextElementSibling.innerHTML.split(" ")[1];

  const contaCorrente = document.getElementById("GPAG_CCORRENTE_GERAL_CONTA_CORRENTE_VIEW");
  if(contaCorrente){

    // merge "Crédito" and "Débito" collumns
    contaCorrente.querySelectorAll(".tab").forEach(tab => {
      let savedColumnIndex;
      if(tab.id == "tab7") return // Don't execute in Extrato Geral
      console.log(tab.id)

      rows =  [...(tab.querySelectorAll("tbody > tr"))];

      headers = rows[0].querySelectorAll("th");
      headers.forEach((th, index) => {
        if(th.innerHTML == "Débito"){
          th.innerHTML = "Valor";
        }else if(th.innerHTML == "Crédito"){
          savedColumnIndex = index + headers[0].colSpan; // Because there are colspan
          th.remove()
        }
      });

      if(savedColumnIndex){
        rows.shift();

        rows.forEach((row, index) => {
          cells = [...row.querySelectorAll("td")]
          if(cells[savedColumnIndex-1].innerHTML == "&nbsp;"){
            cells[savedColumnIndex-1].innerHTML = cells[savedColumnIndex].innerHTML;
            cells[savedColumnIndex-1].classList.add("n");
          }
          cells[savedColumnIndex].remove();

          if(cells[0].classList.contains("credito")){ //remove "Multibanco - SIBS" row
            //adicionar data a pago em
            //TODO: 
            
            //change the last cell of the last row to the value of the last cell of the current row
            lastRowCells = rows[index-1].querySelectorAll("td")

            document_file = cells[cells.length - 1].querySelector("a")
            console.log(document_file)
            lastRowCells[lastRowCells.length - 2].innerHTML = "";
            lastRowCells[lastRowCells.length - 2].appendChild(document_file)

            row.remove();
          }
        });
      }
    })

    // remove "Movimentos" h2
    contaCorrente.previousElementSibling.remove()

    // Show amount and nif
    const saldoElement = document.createElement("div");
    saldoElement.innerHTML = `Saldo: ${saldo.textContent} | NIF: ${nif}`;
    saldoElement.style = "font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;";
    contaCorrente.insertBefore(saldoElement, contaCorrente.firstChild);
    
    // Extrato Geral
    const tab7 = contaCorrente.querySelector("#tab7");
    if(!tab7) return;

    const headerTitles = tab7.querySelectorAll("thead > tr > th");
    headerTitles[3].remove();
    headerTitles[0].innerHTML = "Data";
    headerTitles[1].innerHTML = "Descrição";
    headerTitles[2].innerHTML = "Valor";

    const bodyRows = tab7.querySelectorAll("tbody > tr");
    bodyRows.forEach(row => {
      const cells = row.querySelectorAll("td");

      row.insertBefore(cells[1], cells[0]);

      if(cells[3].classList.contains('n')){
        cells[2].innerHTML = "+" + cells[3].innerHTML.replace("&nbsp;", "");
        cells[2].classList.add("n");
        cells[2].classList.add("positive");
      }else{
        cells[2].innerHTML = "-" + cells[2].innerHTML.replace("&nbsp;", "");
        cells[2].classList.add('negative');
      }
      cells[3].remove();


    })
  }
}