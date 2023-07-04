import throttle from "./utilities/throttle";
import { getPath } from "./utilities/sigarra";
import { isDate, reverseDate } from "./utilities/date";

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
    if(isDate(date.innerHTML)){
      date.innerHTML = reverseDate(date.innerHTML)
    }
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
      rows = [...(tab.querySelectorAll("thead > tr, tbody > tr"))];
      if(rows.length == 0) return;

      headerTitles = document.querySelectorAll("ul.ui-tabs-nav > li > a")
      headerTitles = [...headerTitles].map(title => title.textContent)
      headerCells = rows[0].querySelectorAll("th");
      headerCells.forEach((th, index) => {
        if(th.innerHTML == "Débito"){
          th.innerHTML = "Valor";
        }else if(th.innerHTML == "Crédito"){
          creditColumnIndex = index 
          // Colspan
          colSpan = headerCells[0].colSpan;
          if(colSpan > 1) creditColumnIndex += colSpan;
          th.remove()
        }

        // Remove "Valor Pago" Column
        if(th.innerHTML == "Valor Pago"){
          columnsToRemove.push(index + headerCells[0].colSpan - 1);
          th.remove()
        }

        // Remove "Valor em Falta" Column
        if(th.innerHTML == "Valor em Falta"){
          th.innerHTML = "";
          th.colSpan = 1;
          columnsToRemove.push(index + headerCells[0].colSpan - 1);
        }

        // Rename "Juros em Mora" Column
        if(th.innerHTML == "Juros de Mora"){
          th.innerHTML = "Juros";
          // Remove "Juros de Mora" Column in "Juros de mora Proprinas" tab
          if(headerTitles[tab_index] == "Juros de mora Propinas"){
            columnsToRemove.push(index + headerCells[0].colSpan - 1);
            th.remove()
          }
        }

        // Remove "Débito em Falta" Column
        if(th.innerHTML == "Débito em Falta"){
          columnsToRemove.push(index + headerCells[0].colSpan - 1);
          th.remove()
        }

        // Remove "Valor em Falta" Column
        if(th.innerHTML == "Documento"){
          th.colSpan = 1;
          columnsToRemove.push(index + headerCells[0].colSpan - 1);
        }

        // Remove "Estado" Column
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
          isGeralExtract = headerTitles[tab_index] == "Extrato Geral";

          cells = [...row.querySelectorAll("td")]
          debitCell = cells[creditColumnIndex-1];

          if(debitCell.innerHTML == "&nbsp;"){
            debitCell.innerHTML = ""
            debitCell.classList.add("n");
            if(isGeralExtract){
              debitCell.classList.add("positive")
              debitCell.innerHTML = "+"
            }
            debitCell.innerHTML += cells[creditColumnIndex].innerHTML;
          }else{
            if(isGeralExtract){
              debitCell.classList.add("negative")
              debitCell.innerHTML = "-" + debitCell.innerHTML;
            }
          }
          cells[creditColumnIndex].remove();
          if(cells[0].classList.contains("credito")){ //remove "Multibanco - SIBS" row
            //TODO: adicionar data a "pago em"
            
            //change the last cell of the last row to the value of the last cell of the current row
            lastRowCells = rows[index-1].querySelectorAll("td")

            document_file = cells[cells.length - 1].querySelector("a")
            if(document_file){
              lastRowCells[lastRowCells.length - 1].innerHTML = "";
              lastRowCells[lastRowCells.length - 1].appendChild(document_file)
              lastRowCells[lastRowCells.length - 1].style.paddingRight = "0.6rem";
            }
            row.remove();
          }
        });
      }
    })

    // Change "Data" collumn position in "Extrato Geral" tab
    const geralExtractTable = document.querySelector("#tab_extracto_geral");
    if(geralExtractTable){
      geralExtractTable.querySelectorAll("tr").forEach(row => {
        cells = [...row.querySelectorAll("td"), ...row.querySelectorAll("th")]
        len = cells.length;
        row.insertBefore(cells[1], cells[0]);
      })
    }

    // Switch "Refência" action button to the right
    if(tabs.length > 0){
      tabs[0].querySelectorAll("tbody > tr").forEach(row => {
        cells = [...row.querySelectorAll("td"), ...row.querySelectorAll("th")]
        len = cells.length;
        row.insertBefore(cells[len - 1], cells[len - 2]);
      })
    }

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

    // Improve the status badge
    tabs.forEach((tab) => {
      tab.querySelectorAll("tbody > tr").forEach(row => {
        cells = [...row.querySelectorAll("td")]
        if(cells.length == 0) return;

        // Get title atriuibute from the first cell
        const cellStatus = cells[0].querySelector("img")?.getAttribute("title") ?? null;
        if(cellStatus == null) return;

        // Creating a new status badge
        statusDiv = document.createElement("div");
        statusDiv.innerHTML = statusProperties[cellStatus].text
        statusDiv.classList.add("badge");
        statusDiv.classList.add("badge-" + statusProperties[cellStatus].class);
        statusDiv.title = cellStatus;

        cells[0].innerHTML = statusDiv.outerHTML;
      })
    })

    // Remove "Movimentos" h2
    contaCorrente.previousElementSibling.remove()

    // Create Balance and NIF cards
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

    return;
  }
}

export const addSortTableActions = () => {
  document.querySelectorAll("th").forEach(th => {
    th.addEventListener("click", () => {
      const table = th.closest("table");
      let index = [...th.parentElement.children].indexOf(th);
      const aditionalColspan = parseInt(th.parentElement.children[0].getAttribute("colspan")) || 1;
      const rows = [...table.querySelectorAll("tr")];
      
      // Removing header rows
      while(rows[0].classList.length === 0 || (!rows[0].classList[0].startsWith("i") && !rows[0].classList[0].startsWith("p")))
        rows.shift();

      index += aditionalColspan-1;

      if(rows.length <= 1) return;
      if(rows[0].querySelectorAll("td").length <= index) return;

      const classes = ["asc", "desc"];
      const currentClasses = th.classList;

      // Remove asc and desc classes from neighbors th
      th.parentElement.querySelectorAll("th").forEach(neighbor => {
        if(neighbor == th) return
        neighbor.classList.remove(...classes);
      })

      // Check if the current th has some class from classes
      if(currentClasses.length == 0 || !classes.some(c => currentClasses.contains(c))){
        th.classList.add(classes[0]);
      }else{
        classes.forEach(c => th.classList.toggle(c));
      }

      rows.sort((a, b) => {
        let aValue = a.querySelectorAll("td")[index].innerHTML;
        let bValue = b.querySelectorAll("td")[index].innerHTML;
        if(th.classList.contains("desc")) [aValue, bValue] = [bValue, aValue];
        
        // Date order
        if(isDate(reverseDate(aValue)) && isDate(reverseDate(bValue))){
          const aDate = new Date(reverseDate(aValue));
          const bDate = new Date(reverseDate(bValue));
          if(aDate < bDate) return -1;
          if(aDate > bDate) return 1;
          return 0;
        }

        // Alphabetical order
        return aValue.localeCompare(bValue, undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      })

      rows.forEach(row => {
        table.appendChild(row);
      })
    })

    th.style.cursor = "pointer";
  })
}