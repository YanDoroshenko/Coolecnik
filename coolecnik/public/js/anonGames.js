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
            $("#player1c").removeClass("nonactive-player").addClass("active-player");
            $("#player2c").removeClass("active-player").addClass("nonactive-player");
        }
    }
    else {
        if (localStorage.getItem("gameType") === "1") {
            $("#player2").removeClass("nonactive-player").addClass("active-player");
            $("#player1").removeClass("active-player").addClass("nonactive-player");
        }
        else {
            $("#player2c").removeClass("nonactive-player").addClass("active-player");
            $("#player1c").removeClass("active-player").addClass("nonactive-player");
        }
    }
}

function setCarCounters(goodOrBad) {
    if (activePlayer === 0) {
        var preparedStr = "#pl1" + goodOrBad + "c";
        $(preparedStr).html(parseInt($(preparedStr).text()) + 1);
    }
    else {
        var preparedStr = "#pl2" + goodOrBad + "c";
        $(preparedStr).html(parseInt($(preparedStr).text()) + 1);
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
        $("#newGameSpan").text("Zadejte správny počet karambolu nebo kol");
        return;
    }

    //start pool game
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

    //start carambol game
    else {
        localStorage.setItem("gameType", 2);

        if ($("#karambolGameType").prop("checked")) {
            localStorage.setItem("carType", "2"); //round game
        }
        else {
            localStorage.setItem("carType", "1"); //carambol game
        }

        $("#loginPanel").hide();


        $("#player1c").html($("#pl0").val());
        $("#player2c").html($("#pl1").val());
        $("#newGameDiv").hide();

        $("#karambolControlDiv").show();

        changeRound = 0;
        lastRound = 0;
        round = 1;
        activePlayer = 0;

        if (localStorage.getItem("carType") === "1") { //carambol game
            $("#carGameType1Div").show();

            localStorage.setItem("roundsTotal", $("#carambCount").val());
            localStorage.setItem("roundsRemain", round);

            $("#carGameType1CarsTotal").html(localStorage.getItem("roundsTotal"));
            $("#carGameType1CurrentRound").html(localStorage.getItem("roundsRemain"));
        }
        else if (localStorage.getItem("carType") === "2") {  //round game
            $("#carGameType2Div").show();

            localStorage.setItem("carsTotal", $("#carambCount").val());
            localStorage.setItem("currentRound", $("#carambCount").val());

            $("#carGameType2RoundsTotal").html(localStorage.getItem("carsTotal"));
            $("#carGameType2RoundsRemain").html(localStorage.getItem("currentRound"));
        }
        setActivePlayerOnScreen();

        localStorage.setItem("activePlayer", activePlayer);

        $("#helpDiv").html("");
        $("#endOfGameDiv").html("");

        $("#pl1goodc").html("0");
        $("#pl2goodc").html("0");

        $("#timerMc").html("0");
        $("#timerSc").html("0");

        clearTimeout(timeVar);
        clearTimeout(timeVar);
        timeVar = setInterval(countTimer, 1000);
    }
});


//      POOL BUTTONS

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
    $("#endOfGameDivButton").show();
    $("#endOfGameDiv").html("Hra byla ukončena, výherce je " + String((activePlayer === 0) ? $("#player1").html() : $("#player2").html()));

});

$("#poolFaul8Btn").on("click", function () {
    $("#poolControlDiv").hide();
    $("#looseModalWindow").modal("hide");
    $("#endOfGameDiv").show();
    $("#endOfGameDivButton").show();
    $("#endOfGameDiv").html("Hra byla ukončena, výherce je " + String((activePlayer === 1) ? $("#player1").html() : $("#player2").html()));
});

$("#pool8tooSoonBtn").on("click", function () {
    $("#poolControlDiv").hide();
    $("#looseModalWindow").modal("hide");
    $("#endOfGameDiv").show();
    $("#endOfGameDivButton").show();
    $("#endOfGameDiv").html("Hra byla ukončena, výherce je " + String((activePlayer === 1) ? $("#player1").html() : $("#player2").html()));
});

$("#pool8WrHoleBtn").on("click", function () {
    $("#poolControlDiv").hide();
    $("#looseModalWindow").modal("hide");
    $("#endOfGameDiv").show();
    $("#endOfGameDivButton").show();
    $("#endOfGameDiv").html("Hra byla ukončena, výherce je " + String((activePlayer === 1) ? $("#player1").html() : $("#player2").html()));
});

$("#pool8OfTableBtn").on("click", function () {
    $("#poolControlDiv").hide();
    $("#looseModalWindow").modal("hide");
    $("#endOfGameDiv").show();
    $("#endOfGameDivButton").show();
    $("#endOfGameDiv").html("Hra byla ukončena, výherce je " + String((activePlayer === 1) ? $("#player1").html() : $("#player2").html()));
});

$("#endGameBtn").on("click", function () {
    $("#poolControlDiv").hide();
    $("#looseModalWindow").modal("hide");
    $("#endOfGameDiv").show();
    $("#endOfGameDivButton").show();
    $("#endOfGameDiv").html("Hra byla ukončena");
});


//    CARAMBOL BUTTONS

$("#carCorrectBtn").on("click", function () {
    if (localStorage.getItem("carType") === "1")
        round = parseInt($("#carGameType1CurrentRound").html());
    else if (localStorage.getItem("carType") === "2") {
        round = parseInt($("#carGameType2RoundsTotal").html()) - parseInt($("#carGameType2RoundsRemain").html()) + 1;
    }

    setCarCounters("good");

    if (localStorage.getItem("carType") === "1") {
        if (changeRound === 0 && lastRound === 0) {
            if (parseInt($("#pl1goodc").html()) === parseInt($("#carGameType1CarsTotal").html())) {
                activePlayer = (activePlayer === 1) ? 0 : 1;
                setActivePlayerOnScreen();
                lastRound = 1;
                changeRound++;
            }
            else if (parseInt($("#pl2goodc").html()) === parseInt($("#carGameType1CarsTotal").html())) {
                activePlayer = (activePlayer === 1) ? 0 : 1;
                setActivePlayerOnScreen();
                lastRound = 1;
                changeRound++;
            }

        }

        else if (changeRound === 1 && lastRound === 0) {
            if (parseInt($("#pl1goodc").html()) === parseInt($("#carGameType1CarsTotal").html())) {
                console.log("---------END GAME PL1W");

                clearTimeout(timeVar);
                isSecondPlayerAuthorized = false;
                $("#pl0").val("");

                $("#carGameType1Div").hide();
                $("#carGameType2Div").hide();

                $("#endOfGameDivButton").show();
                $("#endOfGameDiv").show();
                $("#karambolControlDiv").hide();
                $("#endOfGameDiv").html("Hra byla ukončena, výherce je " + String($("#player1c").html()));

                $("#gameType").prop("checked", false);
                $("#carambParams").hide();
                return;
            }
            else if (parseInt($("#pl2goodc").html()) === parseInt($("#carGameType1CarsTotal").html())) {
                console.log("---------END GAME PL2W");
                clearTimeout(timeVar);
                isSecondPlayerAuthorized = false;
                $("#pl0").val("");

                $("#carGameType1Div").hide();
                $("#carGameType2Div").hide();

                $("#endOfGameDivButton").show();
                $("#endOfGameDiv").show();
                $("#karambolControlDiv").hide();
                $("#endOfGameDiv").html("Hra byla ukončena, výherce je " + String($("#player2c").html()));

                $("#gameType").prop("checked", false);
                $("#carambParams").hide();
                return;
            }
        }

        else if (changeRound === 1 && lastRound === 1) {
            if ((parseInt($("#pl1goodc").html()) === parseInt($("#carGameType1CarsTotal").html()) ) &&
                (parseInt($("#pl2goodc").html()) === parseInt($("#carGameType1CarsTotal").html()) )) {
                console.log("---------END GAME DRAW");

                clearTimeout(timeVar);
                isSecondPlayerAuthorized = false;
                $("#pl0").val("");

                $("#carGameType1Div").hide();
                $("#carGameType2Div").hide();

                $("#endOfGameDivButton").show();
                $("#endOfGameDiv").show();
                $("#karambolControlDiv").hide();
                $("#endOfGameDiv").html("Hra byla ukončena <br> Remíza");

                $("#gameType").prop("checked", false);
                $("#carambParams").hide();
                return;
            }
        }
    }

    localStorage.setItem("activePlayer", activePlayer);

});

$("#carFaulBtn").on("click", function () {
    if (localStorage.getItem("carType") === "1")
        round = parseInt($("#carGameType1CurrentRound").html());
    else if (localStorage.getItem("carType") === "2") {
        round = parseInt($("#carGameType2RoundsTotal").html()) - parseInt($("#carGameType2RoundsRemain").html()) + 1;
    }

    setCarCounters("bad");

    activePlayer = (activePlayer === 1) ? 0 : 1;
    setActivePlayerOnScreen();
    changeRound++;

    if (localStorage.getItem("carType") === "1") {
        if (changeRound === 2) {
            changeRound = 0;
            $("#carGameType1CurrentRound").html(parseInt($("#carGameType1CurrentRound").html()) + 1);
        }

        if (parseInt($("#pl1goodc").html()) === parseInt($("#carGameType1CarsTotal").html())) {
            console.log("---------END GAME PL1W");

            clearTimeout(timeVar);
            isSecondPlayerAuthorized = false;
            $("#pl0").val("");

            $("#carGameType1Div").hide();
            $("#carGameType2Div").hide();

            $("#endOfGameDivButton").show();
            $("#endOfGameDiv").show();
            $("#karambolControlDiv").hide();
            $("#endOfGameDiv").html("Hra byla ukončena, výherce je " + String($("#player1c").html()));

            $("#gameType").prop("checked", false);
            $("#carambParams").hide();
            return;
        }
        else if (parseInt($("#pl2goodc").html()) === parseInt($("#carGameType1CarsTotal").html())) {
            console.log("---------END GAME PL2W");

            clearTimeout(timeVar);
            isSecondPlayerAuthorized = false;
            $("#pl0").val("");

            $("#carGameType1Div").hide();
            $("#carGameType2Div").hide();

            $("#endOfGameDivButton").show();
            $("#endOfGameDiv").show();
            $("#karambolControlDiv").hide();
            $("#endOfGameDiv").html("Hra byla ukončena, výherce je " + String($("#player2c").html()));

            $("#gameType").prop("checked", false);
            $("#carambParams").hide();
            return;
        }
    }

    if (localStorage.getItem("carType") === "2") {
        if (changeRound === 2) {
            changeRound = 0;
            $("#carGameType2RoundsRemain").html(parseInt($("#carGameType2RoundsRemain").html()) - 1);
        }

        if ($("#carGameType2RoundsRemain").html() === "0") {
            if (parseInt($("#pl1goodc").html()) === parseInt($("#pl2goodc").html())) {
                // draw
                console.log("-------DRAW");

                clearTimeout(timeVar);
                isSecondPlayerAuthorized = false;
                $("#pl0").val("");

                $("#carGameType1Div").hide();
                $("#carGameType2Div").hide();

                $("#endOfGameDivButton").show();
                $("#endOfGameDiv").show();
                $("#karambolControlDiv").hide();
                $("#endOfGameDiv").html("Hra byla ukončena <br> Remíza");

                $("#gameType").prop("checked", false);
                $("#carambParams").hide();
                return;
            }
            else if (parseInt($("#pl1goodc").html()) > parseInt($("#pl2goodc").html())) {
                // pl1 win
                console.log("-------PL1 W");

                clearTimeout(timeVar);
                isSecondPlayerAuthorized = false;
                $("#pl0").val("");

                $("#carGameType1Div").hide();
                $("#carGameType2Div").hide();

                $("#endOfGameDivButton").show();
                $("#endOfGameDiv").show();
                $("#karambolControlDiv").hide();
                $("#endOfGameDiv").html("Hra byla ukončena, výherce je " + String($("#player1c").html()));

                $("#gameType").prop("checked", false);
                $("#carambParams").hide();
                return;
            }
            else {
                // pl2 win
                console.log("-------PL2 W");

                clearTimeout(timeVar);
                isSecondPlayerAuthorized = false;
                $("#pl0").val("");

                $("#carGameType1Div").hide();
                $("#carGameType2Div").hide();

                $("#endOfGameDivButton").show();
                $("#endOfGameDiv").show();
                $("#karambolControlDiv").hide();
                $("#endOfGameDiv").html("Hra byla ukončena, výherce je " + String($("#player2c").html()));

                $("#gameType").prop("checked", false);
                $("#carambParams").hide();
                return;
            }
        }
    }

    localStorage.setItem("activePlayer", activePlayer);
});

$("#carEndGameBtn").on("click", function () {

});