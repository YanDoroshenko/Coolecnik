$("#gameType").change(function () {
    if (this.checked) {
        $("#carambParams").show();
    }
    else {
        $("#carambParams").hide();
    }
});

$("#startAnonBtn").on("click", function (e) {
    e.preventDefault();
    $("#newGameSpan").text("");
    if ($("#pl0").val().length < 1 || $("#pl1").val().length < 1) {
        $("#newGameSpan").text("Zadejte oba dva jména");
        return;
    }
    if ($("#gameType").prop("checked") && (isNaN(parseInt($("#carambCount").val())) || parseInt($("#carambCount").val()) < 1)) {
        $("#newGameSpan").text("Žádejte správný počet karambolu nebo kol");
        return;
    }
});