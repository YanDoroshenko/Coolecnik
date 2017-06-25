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

function carGetSavedCounterValuesObjs() {
    var savedCounterValues = {
        "green1": $("#pl1goodc").text(),
        "green2": $("#pl2goodc").text()
    };
    return savedCounterValues;
}


function carGameRoutine(strikeType, changePlayer, badOrGood) {
    if (localStorage.getItem("carType") === "1")
        round = parseInt($("#carGameType1CurrentRound").html());
    else if (localStorage.getItem("carType") === "2") {
        round = parseInt($("#carGameType2RoundsTotal").html()) - parseInt($("#carGameType2RoundsRemain").html()) + 1;
    }
    savePoolStrike(strikeType);


    if (badOrGood !== undefined)
        setCarCounters(badOrGood);
    else {
        setCarCounters(changePlayer);
    }

    if (changePlayer === "true") {
        activePlayer = (activePlayer === 1) ? 0 : 1;
        setActivePlayerOnScreen();
        changeRound++;
    }

    if (localStorage.getItem("carType") === "1" && strikeType === 11) {
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
                if (navigator.onLine === true) {// if there is connection to internet
                    sendStrikes();
                    sendGameEnd(parseInt(players[0].id));
                }
                else {
                    saveGameEnd(parseInt(players[0].id));
                }
                clearTimeout(timerVar);
                isSecondPlayerAuthorized = false;
                $("#pl0").val("");

                $("#carGameType1Div").hide();
                $("#carGameType2Div").hide();

                $("#gameType").prop("checked", false);
                $("#carambParams").hide();
                return;
            }
            else if (parseInt($("#pl2goodc").html()) === parseInt($("#carGameType1CarsTotal").html())) {
                console.log("---------END GAME PL2W");
                if (navigator.onLine === true) {// if there is connection to internet
                    sendStrikes();
                    sendGameEnd(parseInt(players[1].id));
                }
                else {
                    saveGameEnd(parseInt(players[1].id))
                }
                clearTimeout(timerVar);
                isSecondPlayerAuthorized = false;
                $("#pl0").val("");

                $("#carGameType1Div").hide();
                $("#carGameType2Div").hide();

                $("#gameType").prop("checked", false);
                $("#carambParams").hide();
                return;
            }
        }

        else if (changeRound === 1 && lastRound === 1) {
            if ((parseInt($("#pl1goodc").html()) === parseInt($("#carGameType1CarsTotal").html()) ) &&
                (parseInt($("#pl2goodc").html()) === parseInt($("#carGameType1CarsTotal").html()) )) {
                console.log("---------END GAME DRAW");
                if (navigator.onLine === true) {// if there is connection to internet
                    sendStrikes();
                    sendGameEnd(-42);
                }
                else {
                    saveGameEnd(-42);
                }
                clearTimeout(timerVar);
                isSecondPlayerAuthorized = false;
                $("#pl0").val("");

                $("#carGameType1Div").hide();
                $("#carGameType2Div").hide();

                $("#gameType").prop("checked", false);
                $("#carambParams").hide();
                return;
            }
        }
    }

    if (localStorage.getItem("carType") === "1" && strikeType === 12) {
        if (changeRound === 2) {
            changeRound = 0;
            $("#carGameType1CurrentRound").html(parseInt($("#carGameType1CurrentRound").html()) + 1);
        }

        if (parseInt($("#pl1goodc").html()) === parseInt($("#carGameType1CarsTotal").html())) {
            console.log("---------END GAME PL1W");
            if (navigator.onLine === true) { // if there is connection to internet
                sendStrikes();
                sendGameEnd(parseInt(players[0].id));
            }
            else {
                saveGameEnd(parseInt(players[0].id));
            }
            clearTimeout(timerVar);
            isSecondPlayerAuthorized = false;
            $("#pl0").val("");

            $("#carGameType1Div").hide();
            $("#carGameType2Div").hide();

            $("#gameType").prop("checked", false);
            $("#carambParams").hide();
            return;
        }
        else if (parseInt($("#pl2goodc").html()) === parseInt($("#carGameType1CarsTotal").html())) {
            console.log("---------END GAME PL2W");
            if (navigator.onLine === true) {// if there is connection to internet
                sendStrikes();
                sendGameEnd(parseInt(players[1].id));
            }
            else {
                saveGameEnd(parseInt(players[1].id));
            }
            clearTimeout(timerVar);
            isSecondPlayerAuthorized = false;
            $("#pl0").val("");

            $("#carGameType1Div").hide();
            $("#carGameType2Div").hide();

            $("#gameType").prop("checked", false);
            $("#carambParams").hide();
            return;
        }
    }

    if (localStorage.getItem("carType") === "2" && strikeType === 12) {
        if (changeRound === 2) {
            changeRound = 0;
            $("#carGameType2RoundsRemain").html(parseInt($("#carGameType2RoundsRemain").html()) - 1);
        }

        if ($("#carGameType2RoundsRemain").html() === "0") {
            if (parseInt($("#pl1goodc").html()) === parseInt($("#pl2goodc").html())) {
                // draw
                console.log("-------DRAW");
                if (navigator.onLine === true) { // if there is connection to internet
                    sendStrikes();
                    sendGameEnd(parseInt(-42));
                }
                else {
                    saveGameEnd(-42);
                }

                clearTimeout(timerVar);
                isSecondPlayerAuthorized = false;
                $("#pl0").val("");

                $("#carGameType1Div").hide();
                $("#carGameType2Div").hide();

                $("#gameType").prop("checked", false);
                $("#carambParams").hide();
                return;
            }
            else if (parseInt($("#pl1goodc").html()) > parseInt($("#pl2goodc").html())) {
                // pl1 win
                console.log("-------PL1 W");
                if (navigator.onLine === true) {// if there is connection to internet
                    sendStrikes();
                    sendGameEnd(parseInt(players[0].id));
                }
                else {
                    saveGameEnd(parseInt(players[0].id));
                }
                clearTimeout(timerVar);
                isSecondPlayerAuthorized = false;
                $("#pl0").val("");

                $("#carGameType1Div").hide();
                $("#carGameType2Div").hide();

                $("#gameType").prop("checked", false);
                $("#carambParams").hide();
                return;
            }
            else {
                // pl2 win
                console.log("-------PL2 W");
                if (navigator.onLine === true) { // if there is connection to internet
                    sendStrikes();
                    sendGameEnd(parseInt(players[1].id));
                }
                else {
                    saveGameEnd(parseInt(players[1].id));
                }
                clearTimeout(timerVar);
                isSecondPlayerAuthorized = false;
                $("#pl0").val("");

                $("#carGameType1Div").hide();
                $("#carGameType2Div").hide();

                $("#gameType").prop("checked", false);
                $("#carambParams").hide();
                return;
            }
        }
    }

    localStorage.setItem("activePlayer", activePlayer);

    var savedCounterValues = carGetSavedCounterValuesObjs();
    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

    /*    console.log("--currentGame        ", JSON.parse(localStorage.getItem("currentGame")));
     console.log("--savedCounterValues ", savedCounterValues);*/

}

function carRestoreGame() {
    console.log("UNENDED GAME");
    //show panel for the game
    $("#newGameDiv").css("display", "none");
    if (localStorage.getItem("gameType") === "2") {
        $("#karambolControlDiv").css("display", "block");
    }
    else {
        $("#helpDiv").html("internal error");
        return;
    }

    if(JSON.parse(localStorage.getItem("currentGame")) == null){
        round = 1;
    } else {
        round = JSON.parse(localStorage.getItem("currentGame"))[JSON.parse(localStorage.getItem("currentGame")).length - 1].round + 1;
    }
    gameId = JSON.parse(localStorage.getItem("gameId"));
    localStorage.setItem("gameId", gameId);
    players = JSON.parse(localStorage.getItem("players"));

    $("#player1c").html(players[0].name);
    $("#player2c").html(players[1].name);
    //set timer
    var time = JSON.parse(localStorage.getItem("savedTime"));
    $("#timerMc").html(time["m"]);
    $("#timerSc").html(time["s"]);
    clearTimeout(timerVar);
    //var timerVar = setInterval(countTimer, 1000);

    //set strike counters
    console.log("--THIS ", localStorage.getItem("savedCounterValues"));
    var strikes = JSON.parse(localStorage.getItem("savedCounterValues"));
    $("#pl1goodc").html(strikes["green1"]);
    $("#pl2goodc").html(strikes["green2"]);

    if (localStorage.getItem("carType") === "1") {
        $("#carGameType1Div").show();
        $("#carGameType1CarsTotal").html(localStorage.getItem("roundsTotal"));
        $("#carGameType1CurrentRound").html(round);
    }
    else if (localStorage.getItem("carType") === "2") {
        $("#carGameType2Div").show();
        $("#carGameType2RoundsTotal").html(localStorage.getItem("carsTotal"));
        $("#carGameType2RoundsRemain").html(localStorage.getItem("currentRound"));
    }

    //set other vars
    activePlayer = parseInt(localStorage.getItem("activePlayer"));
    setActivePlayerOnScreen();
}
