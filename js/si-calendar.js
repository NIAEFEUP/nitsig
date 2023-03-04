//abre_calendario('divIdp_data_inicio','p_data_inicio','YYYY-MM-DD', '', '', '', '', '', null 
function abre_calendario(element, inputID, format, r, i, s, o, u, a) {
    format = "dd/mm/yyyy";
    function c(value) {
        if (value.indexOf("-") < 0 && value.indexOf("/") < 0)
            return "";
        return value.substring(0, 2) + "/" + value.substring(3, 5) + "/" + value.substring(7, 11)
    }

    function h(value) {
        if (value == "" || value.indexOf("-") < 0 && value.indexOf("/") < 0) {
            var currentdate = new Date;
            return currentdate.getMonth() + 1 + "/" + currentdate.getFullYear()
        } else return value.substring(3, 5) + "/" + value.substring(7, 11)
    }
    function p(element) {
        if (element != "") {
            var date = element.split("-");
            if (date.length == 0) {
                date = element.split("/")
            }
            if (date.length > 0)
                return date[0] + date[1] + date[2]
        }
        return 0
    }

    function d(element, r, s) {
        var o = r[0];
        var u = o[0];
        var year = u[0], month = u[1], day = u[2];

        var date = "dd/mm/yyyy";
        date = date.replace("yyyy", year);
        
        month = month < 10 ? "0" + month : month;
        date = date.replace("mm", month);

        day = day < 10 ? "0" + day : day;
        date = date.replace("dd", day);
        
        var h = document.getElementById(inputID);
        h.value = date;
        v.hide();
        if (i != "" && p(document.getElementById(inputID).value) > p(document.getElementById(i).value)) {
            document.getElementById(i).value = ""
        }
    }


    var format = format.toLowerCase();
    var f = "";
    if (r != "") {
        if (document.getElementById(r).value == "") {
            //TODO: replace this with a custom snackbar
            return alert("Tem de selecionar a data de início primeiro.");
        } else
            s = document.getElementById(r).value;
        if (p(document.getElementById(r).value) > p(document.getElementById(inputID).value))
            f = h(document.getElementById(r).value);
        else
            f = h(document.getElementById(inputID).value)
    } else
        f = h(document.getElementById(inputID).value);
    var l = {
        strings: {
            month: "Mês",
            year: "Ano",
            submit: "OK",
            cancel: "Cancelar",
            invalidYear: "Mês Inválido"
        },
        monthFormat: YAHOO.widget.Calendar.LONG,
        initialFocus: "month"
    };
    if (!a && document.getElementById(inputID).onchange) {
        a = document.getElementById(inputID).onchange
    }
    var v = new YAHOO.widget.Calendar("cal_" + element, element,{
        pagedate: f,
        mindate: c(s),
        maxdate: c(o),
        navigator: l,
        close: true
    });
    if (a)
        v.hideEvent.subscribe(a, v, true);
    else
        try {
            if (jQuery)
                v.hideEvent.subscribe(function() {
                    jQuery(document.getElementById(inputID)).trigger("change")
                }, v, true)
        } catch (m) {}

    v.cfg.setProperty("MONTHS_SHORT", ["Jan", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]);
    v.cfg.setProperty("MONTHS_LONG", ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]);
    v.cfg.setProperty("WEEKDAYS_1CHAR", ["D", "S", "T", "Q", "Q", "S", "S"]);
    v.cfg.setProperty("WEEKDAYS_SHORT", ["D", "S", "T", "Q", "Q", "S", "S"]);
    v.cfg.setProperty("WEEKDAYS_MEDIUM", ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]);
    v.cfg.setProperty("WEEKDAYS_LONG", ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]);

    if (u == "true") {
        if (r != "" && document.getElementById(r).value != "")
            v.select(c(document.getElementById(r).value) + "-" + c(document.getElementById(inputID).value));
        else {
            if (i != "" && document.getElementById(i).value != "")
                v.select(c(document.getElementById(inputID).value) + "-" + c(document.getElementById(i).value));
            else
                v.select(c(document.getElementById(inputID).value))
        }
    } else
        v.select(c(document.getElementById(inputID).value));
    v.selectEvent.subscribe(d, v, true);
    v.show();
    v.render()
}
