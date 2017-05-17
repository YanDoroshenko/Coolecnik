var round = 1;

function poolGetSavedCounterValuesObjs() {
    var savedCounterValues = {
        "green1": $("#pl1good").text(),
        "green2": $("#pl2good").text(),
        "red1": $("#pl1bad").text(),
        "red2": $("#pl2bad").text()
    };
    return savedCounterValues;
}

function savePoolStrike(strikeType) {
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

    var obj = {
        "strikeType": parseInt(strikeType),
        "game": gameId,
        "player": (activePlayer === 1) ? players[0].id : players[1].id,
        "round": round
    };
    var existingStrikes = JSON.parse(localStorage.getItem("currentGame"));


    if (existingStrikes === null)
        existingStrikes = [];

    existingStrikes.push(obj);
    localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
    console.log("DEBUG ", localStorage.getItem("currentGame"));
}

function setPoolCounters(goodOrBad) {
    if (activePlayer === 0) {
        var preparedStr = "#pl1" + goodOrBad;
        $(preparedStr).html(parseInt($(preparedStr).text()) + 1);
    }
    else {
        var preparedStr = "#pl2" + goodOrBad;
        $(preparedStr).html(parseInt($(preparedStr).text()) + 1);
    }
}

function poolGameRoutine(strikeTime, changePlayer, badOrGood) {
    savePoolStrike(strikeTime);
    round++;

    if (badOrGood !== undefined)
        setPoolCounters(badOrGood);
    else {
        setPoolCounters(changePlayer);
    }

    if (changePlayer === "true") {
        activePlayer = (activePlayer === 1) ? 0 : 1;
        setActivePlayerOnScreen();
    }

    localStorage.setItem("activePlayer", activePlayer);

    var savedCounterValues = poolGetSavedCounterValuesObjs();


    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

    /*    console.log("--currentGame        ", JSON.parse(localStorage.getItem("currentGame")));
     console.log("--savedCounterValues ", savedCounterValues);*/

}

function poolEndGameRoutine(lastStrikeType) {
    savePoolStrike(lastStrikeType);
    if (navigator.onLine === true) // if there is connection to internet
    {
        sendStrikes();
        // here activePlayer shows the non-active player. Or doesnt. dont know why
        if (lastStrikeType === 6) {
            if (players[1].id === -1)
                sendGameEnd(players[activePlayer].id);
            else {
                if (localStorage.getItem("currentGame") === null)
                    sendGameEnd(players[(activePlayer === 0) ? 1 : 0].id);
                else
                    sendGameEnd(players[(activePlayer === 1) ? 1 : 0].id);
            }
        }
        else {
            if (players[1].id === -1)
                sendGameEnd(players[(activePlayer === 0) ? 1 : 0].id);
            else
                sendGameEnd(players[(activePlayer === 0) ? 1 : 0].id);
        }
    }

    else {
        saveGameEnd();
    }
    clearTimeout(timerVar);
    isSecondPlayerAuthorized = false;
    $("#pl0").val("");

    $("#gameType").prop("checked", false);
}

function poolRestoreGame() {
    console.log("UNENDED GAME");
    //show panel for the game
    $("#newGameDiv").css("display", "none");
    if (localStorage.getItem("gameType") === "1") {
        $("#poolControlDiv").css("display", "block");
    }
    else {
        $("#helpDiv").html("internal error");
        return;
    }

    $("#player1").html(JSON.parse(localStorage.getItem("players"))[0].name);
    $("#player2").html(JSON.parse(localStorage.getItem("players"))[1].name);
    //set timer
    var time = JSON.parse(localStorage.getItem("savedTime"));
    $("#timerM").html(time["m"]);
    $("#timerS").html(time["s"]);
    clearTimeout(timerVar);
    var timerVar = setInterval(countTimer, 1000);

    //set strike counters
    console.log("--THIS ", localStorage.getItem("savedCounterValues"));
    var strikes = JSON.parse(localStorage.getItem("savedCounterValues"));
    $("#pl1good").html(strikes["green1"]);
    $("#pl2good").html(strikes["green2"]);
    $("#pl1bad").html(strikes["red1"]);
    $("#pl2bad").html(strikes["red2"]);

    //set other vars
    activePlayer = parseInt(localStorage.getItem("activePlayer"));
    setActivePlayerOnScreen();

    players = JSON.parse(localStorage.getItem("players"));

    round = JSON.parse(localStorage.getItem("currentGame"))[JSON.parse(localStorage.getItem("currentGame")).length - 1].round + 1;
    gameId = JSON.parse(localStorage.getItem("currentGame"))[JSON.parse(localStorage.getItem("currentGame")).length - 1].game;
}


function poolSendSavedGame() {
    // id=savedGameModalDiv  for text
    $("#savedGameModalWindow").modal();
    var gameInfo = JSON.parse(localStorage.getItem("savedGameInfo"));
    $("#savedGameModalDiv").html("Máte uloženou hru s hráčem  <u>" + gameInfo.pl2Name + "</u>  od " + gameInfo.dateTimeString);

    document.getElementById("sendSavedGameBtn").addEventListener("click", function (event) {
        var allStrikes = JSON.parse(localStorage.getItem("currentGame"));
        $.ajax("/api/strikes/new", {
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(allStrikes),
            statusCode: {
                201: function (response) {
                    console.log("201 CREATED");
                    $("#looseModalWindow").modal("hide");
                    $("#poolControlDiv").css("display", "none");
                    $("#karambolControlDiv").css("display", "none");
                    $("#endOfGameDiv").css("display", "block");
                    $("#endOfGameDiv").html("Hra byla ukončena a uložena na serveru!")
                },
                400: function (response) {
                    console.log("400 BAD REQUEST");
                },
                409: function (response) {
                    console.log("409 CONFLICT");
                }
            }
        });
        var savedGameInfoVar = JSON.parse(localStorage.getItem("savedGameInfo"));
        // send end of game
        var endpoint = "/api/games/" + savedGameInfoVar.gameId + "/end";

        if (parseInt(savedGameInfoVar.winner) === -42) {
            var obj = {
                "end": savedGameInfoVar.endOfGameTime,
            };
        }
        else {
            var obj = {
                "end": savedGameInfoVar.endOfGameTime,
                "winner": parseInt(savedGameInfoVar.winner)
            };
        }
        $.ajax(endpoint, {
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            statusCode: {
                200: function (response) {
                    console.log("200 OK");
                },
                400: function (response) {
                    console.log("400 BAD REQUEST");
                },
                409: function (response) {
                    console.log("409 CONFLICT");
                }
            }
        });

        localStorage.setItem("savedGame", null);
        localStorage.setItem("savedGameInfo", null);
        clearTimeout(timerVar);
    });
}


