const myResultsReadyCallback = function (name, q, promos, results, resultsDiv) {
    console.log("Executing callback");
    const makePromoElt = (promo) => {
        const anchor = document.createElement('a');
        anchor.href = promo['url'];
        anchor.target = '_blank';
        anchor.classList.add('gs-title');
        const span = document.createElement('span');
        span.innerHTML = 'Promo: ' + promo['title'];
        anchor.appendChild(span);
        return anchor;
    };
    const makeResultParts = (result) => {
        const anchor = document.createElement('a');
        anchor.href = result['url'];
        anchor.target = '_blank';
        anchor.classList.add('gs_title');
        anchor.appendChild(document.createTextNode(result['visibleUrl']));
        const span = document.createElement('span');
        span.innerHTML = ' ' + result['title'];
        return [anchor, span];
    };

    const table = document.createElement('table');
    if (promos) {
        for (const promo of promos) {
            const row = table.insertRow(-1);
            const cell = row.insertCell(-1);
            cell.appendChild(makePromoElt(promo));
        }
        resultsDiv.appendChild(table);
        resultsDiv.appendChild(document.createElement('br'));
    }
    if (results) {
        const table = document.createElement('table');
        for (const result of results) {
            const row = table.insertRow(-1);
            const cell = row.insertCell(-1);
            const [anchor, span] = makeResultParts(result);
            cell.appendChild(anchor);
            const cell2 = row.insertCell(-1);
            cell2.appendChild(span);
        }
        resultsDiv.appendChild(table);
    }
    return true;
};

const registerGoogleSearchCallbacks = () => {
    window.__gcse = {
        //parsetags: "explicit",
        searchCallbacks: {
            web: {
                ready: myResultsReadyCallback,
            },
        },
    };
    console.log("Registered callbacks");
    console.log(window.__gcse);
};

export default registerGoogleSearchCallbacks;
