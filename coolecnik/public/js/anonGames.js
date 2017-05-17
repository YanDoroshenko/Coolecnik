var timeVar = 0;
var activePlayer;

// timer for HTML timer - starts from 0
function countTimer() {
    if (localStorage.getItem("gameType") === "1") {

        var minute = parseInt($("#timerM").text());
        var seconds = parseInt($("#timerS").text());
        seconds++;
        if (seconds === 60) {
            minute++;
            seconds = 0;
        }
        $("#timerM").html(minute);
        $("#timerS").html(seconds);

        var timeObj = {
            "m": $("#timerM").text(),
            "s": $("#timerS").text()
        };
    }
    else if (localStorage.getItem("gameType") === "2") {
        var minute = parseInt($("#timerMc").text());
        var seconds = parseInt($("#timerSc").text());
        seconds++;
        if (seconds === 60) {
            minute++;
            seconds = 0;
        }
        $("#timerMc").html(minute);
        $("#timerSc").html(seconds);

        var timeObj = {
            "m": $("#timerMc").text(),
            "s": $("#timerSc").text()
        };
    }
    localStorage.setItem("savedTime", JSON.stringify(timeObj));
}

function setActivePlayerOnScreen() {
    if (activePlayer === 0) {
        if (localStorage.getItem("gameType") === "1") {
            $("#player1").removeClass("nonactive-player").addClass("active-player");
            $("#player2").removeClass("active-player").addClass("nonactive-player");
        }
        else {

        }
    }
    else {
        if (localStorage.getItem("gameType") === "1") {
            $("#player2").removeClass("nonactive-player").addClass("active-player");
            $("#player1").removeClass("active-player").addClass("nonactive-player");
        }
        else {

        }
    }
}

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

    if (!$("#gameType").prop("checked")) {
        localStorage.setItem("gameType", 1);

        $("#loginPanel").hide();
        $("#poolControlDiv").show();

        activePlayer = 0;
        $("#player1").addClass("active-player");
        $("#player1").html($("#pl0").val());
        $("#player2").addClass("nonactive-player");
        $("#player2").html($("#pl1").val());
        $("#helpDiv").html("");
        $("#endOfGameDiv").html("");

        $("#pl1good").html("0");
        $("#pl2good").html("0");
        $("#pl1bad").html("0");
        $("#pl2bad").html("0");

        $("#timerM").html("0");
        $("#timerS").html("0");
        timeVar = 0;
        clearTimeout(timeVar);
        timeVar = setInterval(countTimer, 1000);
        setActivePlayerOnScreen();
    }
});

$("#poolCorrectBtn").on("click", function () {
    if (activePlayer === 0)
        $("#pl1good").html(parseInt($("#pl1good").html()) + 1);
    else
        $("#pl2good").html(parseInt($("#pl2good").html()) + 1);
});

$("#poolWhInHoleBtn").on("click", function () {

    if (activePlayer === 0)
        $("#pl1bad").html(parseInt($("#pl1bad").html()) + 1);
    else
        $("#pl2bad").html(parseInt($("#pl2bad").html()) + 1);

    activePlayer = (activePlayer === 1) ? 0 : 1;
    setActivePlayerOnScreen();
});

$("#poolIncorrectBtn").on("click", function () {
    activePlayer = (activePlayer === 1) ? 0 : 1;
    setActivePlayerOnScreen();
});

$("#poolWrBallBtn").on("click", function () {
    if (activePlayer === 0)
        $("#pl1bad").html(parseInt($("#pl1bad").html()) + 1);
    else
        $("#pl2bad").html(parseInt($("#pl2bad").html()) + 1);

    activePlayer = (activePlayer === 1) ? 0 : 1;
    setActivePlayerOnScreen();
});

$("#poolOthFaulBtn").on("click", function () {
    if (activePlayer === 0)
        $("#pl1bad").html(parseInt($("#pl1bad").html()) + 1);
    else
        $("#pl2bad").html(parseInt($("#pl2bad").html()) + 1);

    activePlayer = (activePlayer === 1) ? 0 : 1;
    setActivePlayerOnScreen();
});


$("#correctEndBtn").on("click", function () {
    $("#poolControlDiv").hide();
    $("#looseModalWindow").modal("hide");
    $("#endOfGameDiv").show();
    $("#endOfGameDiv").html("Hra byla ukoncena, vyherce je " + String((activePlayer === 0) ? $("#player1").html() : $("#player2").html()));
});

$("#poolFaul8Btn").on("click", function () {
    $("#poolControlDiv").hide();
    $("#looseModalWindow").modal("hide");
    $("#endOfGameDiv").show();
    $("#endOfGameDiv").html("Hra byla ukoncena, vyherce je " + String((activePlayer === 1) ? $("#player1").html() : $("#player2").html()));
});

$("#pool8tooSoonBtn").on("click", function () {
    $("#poolControlDiv").hide();
    $("#looseModalWindow").modal("hide");
    $("#endOfGameDiv").show();
    $("#endOfGameDiv").html("Hra byla ukoncena, vyherce je " + String((activePlayer === 1) ? $("#player1").html() : $("#player2").html()));
});

$("#pool8WrHoleBtn").on("click", function () {
    $("#poolControlDiv").hide();
    $("#looseModalWindow").modal("hide");
    $("#endOfGameDiv").show();
    $("#endOfGameDiv").html("Hra byla ukoncena, vyherce je " + String((activePlayer === 1) ? $("#player1").html() : $("#player2").html()));
});

$("#pool8OfTableBtn").on("click", function () {
    $("#poolControlDiv").hide();
    $("#looseModalWindow").modal("hide");
    $("#endOfGameDiv").show();
    $("#endOfGameDiv").html("Hra byla ukoncena, vyherce je " + String((activePlayer === 1) ? $("#player1").html() : $("#player2").html()));
});

$("#endGameBtn").on("click", function () {
    $("#poolControlDiv").hide();
    $("#looseModalWindow").modal("hide");
    $("#endOfGameDiv").show();
    $("#endOfGameDiv").html("Hra byla ukoncena");
});
