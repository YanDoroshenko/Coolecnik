function setCarCounters(goodOrBad) {
    if (activePlayer === 1) {
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
    savePoolStrike(strikeType);


    if (badOrGood !== undefined)
        setCarCounters(badOrGood);
    else {
        setCarCounters(changePlayer);
    }

    if (changePlayer === "true") {
        activePlayer = (activePlayer === 1) ? 0 : 1;
        setActivePlayerOnScreen();
    }

    if (localStorage.getItem("carType") === "1" && strikeType === 12) {
        $("#carGameType1CurrentRound").html(parseInt($("#carGameType1CurrentRound").html()) + 1);
    }

    if (localStorage.getItem("carType") === "2" && strikeType === 12) {
        $("#carGameType2RoundsRemain").html(parseInt($("#carGameType2RoundsRemain").html()) - 1);
    }

    localStorage.setItem("activePlayer", activePlayer);

    var savedCounterValues = carGetSavedCounterValuesObjs();
    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

    console.log("--currentGame        ", JSON.parse(localStorage.getItem("currentGame")));
    console.log("--savedCounterValues ", savedCounterValues);

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

    round = JSON.parse(localStorage.getItem("currentGame"))[JSON.parse(localStorage.getItem("currentGame")).length - 1].round + 1;
    gameId = JSON.parse(localStorage.getItem("currentGame"))[JSON.parse(localStorage.getItem("currentGame")).length - 1].game;
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
