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

  const contaCorrente = document.getElementById("GPAG_CCORRENTE_GERAL_CONTA_CORRENTE_VIEW");
  if(contaCorrente){

    tabs = contaCorrente.querySelectorAll(".tab")

    // merge "Crédito" and "Débito" collumns and remove collumns
    tabs.forEach((tab, tab_index) => {
      let creditColumnIndex;
      let columnsToRemove = [];
      if(tab.id == "tab7") return // Don't execute in Extrato Geral

      rows =  [...(tab.querySelectorAll("tbody > tr"))];

      headerCells = rows[0].querySelectorAll("th");
      headerCells.forEach((th, index) => {
        if(th.innerHTML == "Débito"){
          th.innerHTML = "Valor";
        }else if(th.innerHTML == "Crédito"){
          creditColumnIndex = index + headerCells[0].colSpan; // Because there are colspan
          th.remove()
        }

        if(th.innerHTML == "Valor Pago"){
          columnsToRemove.push(index + headerCells[0].colSpan - 1);
          th.remove()
        }

        if(th.innerHTML == "Valor em Falta"){
          th.innerHTML = "";
          th.colSpan = 1;
          columnsToRemove.push(index + headerCells[0].colSpan - 1);
        }

        if(th.innerHTML == "Juros de Mora"){
          th.innerHTML = "Juros";
          if(tab_index == 2){ // Juros de mora Proprinas
            columnsToRemove.push(index + headerCells[0].colSpan - 1);
            th.remove()
          }
        }

        if(th.innerHTML == "Débito em Falta"){
          columnsToRemove.push(index + headerCells[0].colSpan - 1);
          th.remove()
        }

        if(th.innerHTML == "Documento"){
          th.colSpan = 1;
          columnsToRemove.push(index + headerCells[0].colSpan - 1);
        }

        if(th.innerHTML == "Estado"){
          columnsToRemove.push(index + headerCells[0].colSpan - 1);
          th.remove();
        }
      });

      rows.shift();

      rows.forEach(row => {
        cells = [...row.querySelectorAll("td")]
        columnsToRemove.forEach(columnIndex => {
          if(!cells[0].classList.contains("credito")){
            cells[columnIndex].remove();
          }
        })
      })

      if(creditColumnIndex){
        rows.forEach((row, index) => {
          cells = [...row.querySelectorAll("td")]
          if(cells[creditColumnIndex-1].innerHTML == "&nbsp;"){
            cells[creditColumnIndex-1].innerHTML = cells[creditColumnIndex].innerHTML;
            cells[creditColumnIndex-1].classList.add("n");
          }
          cells[creditColumnIndex].remove();

          if(cells[0].classList.contains("credito")){ //remove "Multibanco - SIBS" row
            //TODO: adicionar data a "pago em"
            
            //change the last cell of the last row to the value of the last cell of the current row
            lastRowCells = rows[index-1].querySelectorAll("td")

            document_file = cells[cells.length - 1].querySelector("a")
            lastRowCells[lastRowCells.length - 1].innerHTML = "";
            lastRowCells[lastRowCells.length - 1].appendChild(document_file)
            lastRowCells[lastRowCells.length - 1].style.paddingRight = "0.6rem";

            row.remove();
          }
        });
      }
    })

    // Switch "Refência" action button to the right
    tabs[0].querySelectorAll("tbody > tr").forEach(row => {
      cells = [...row.querySelectorAll("td"), ...row.querySelectorAll("th")]
      len = cells.length;
      row.insertBefore(cells[len - 1], cells[len - 2]);
    })

    statusProperties = {
      "Pago":{
        class: "success",
        text: "Pago"
      },
      "Não pago mas prazo ainda não foi excedido":{
        class: "pending",
        text: "Pendente"
      },
      "Anulado":{
        class:"cancelled",
        text: "Anulado"
      },
      "Prazo excedido": {
        class: "danger",
        text: "Excedido"
      }
    }

    // For each tabs, except the last one (Extrato Geral), switch the first cell content
    tabs.forEach((tab, index) => {
      if(index == tabs.length - 1) return;

      // loop rows
      tab.querySelectorAll("tbody > tr").forEach(row => {
        cells = [...row.querySelectorAll("td")]
        if(cells.length == 0) return;

        // get title atriuibute from the first cell
        const cellStatus = cells[0].querySelector("img").getAttribute("title");

        //create a div with the status
        statusDiv = document.createElement("div");
        statusDiv.innerHTML = statusProperties[cellStatus].text
        statusDiv.classList.add("badge");
        statusDiv.classList.add("badge-" + statusProperties[cellStatus].class);
        statusDiv.title = cellStatus;

        cells[0].innerHTML = statusDiv.outerHTML;
      })
    })

    // remove "Movimentos" h2
    contaCorrente.previousElementSibling.remove()

    // Balance and NIF cards
    const saldo = document.querySelector(".formulario #span_saldo_total").textContent;
    const saldoCard = document.createElement("div");
    saldoCard.classList.add("card");
    const title = document.createElement("p");
    title.innerHTML = "Saldo";
    const saldoValue = document.createElement("h3");
    saldoValue.innerHTML = saldo + "€";
    saldoCard.appendChild(title);
    saldoCard.appendChild(saldoValue);
    
    const nif =  Array.from(document.querySelectorAll(".formulario .formulario-legenda")).filter(el => el.innerHTML.includes("N.I.F."))[0].nextElementSibling.innerHTML;
    const nifCard = document.createElement("div");
    nifCard.classList.add("card");
    const nifTitle = document.createElement("p");
    nifTitle.innerHTML = "NIF";
    const nifValue = document.createElement("h3");
    nifValue.innerHTML = nif;
    nifCard.appendChild(nifTitle);
    nifCard.appendChild(nifValue);
    
    accountDetails = document.createElement("div");
    accountDetails.style.display = "flex";
    accountDetails.style.gap = "1rem";
    accountDetails.style.marginBottom = "0.5rem";

    accountDetails.appendChild(saldoCard);
    accountDetails.appendChild(nifCard);
    contaCorrente.insertBefore(accountDetails, contaCorrente.firstChild);

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