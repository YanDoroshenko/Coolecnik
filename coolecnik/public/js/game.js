
var isSecondPlayerAuthorized = false;
var isSecondPlayerAuthMenuOpened = false;
var players, activePlayer, gameId, timerVar;

/*
 localStorage mapping:
 activeGame: bool
 savedGame: bool
 savedGameInfo: obj("gameId","pl2Name","pl2Id","endOfGameTime", "winner", "round")
 activePlayer: 1 or 2
 gameType: 1 or 2
 savedTime: obj("m", "s")
 savedCounterValues: obj("green1", "green2", "red1", "red2")
 players: arr of (id, name)
 currentGame: arr(obj)
 <only carambol> carType:int    1 for carambols game, 2 for rounds game
 <only carambol && carType==1>  roundsTotal, roundsRemain
 <only carambol && carType==2>  carsTotal, currentRound
 */

// check if there are unended or saved but unsent games
// Handler for document.ready() called.
$(function () {
    if (localStorage.getItem("activeGame") === "true") { //there is unended game
        if (localStorage.getItem("gameType") === "1")
            poolRestoreGame();

        if (localStorage.getItem("gameType") === "2")
            carRestoreGame();

        clearTimeout(timerVar);
        var timerVar = setInterval(countTimer, 1000);

    }

    else if (localStorage.getItem("savedGame") === "true") { //there is saved unsent game
        poolSendSavedGame();
    }
    isSecondPlayerAuthorized = false;
});



/*---------------Pool panel---------------*/
document.getElementById("poolCorrectBtn").addEventListener("click", function (event) {
    poolGameRoutine(1, "good");
});

document.getElementById("poolWhInHoleBtn").addEventListener("click", function (event) {
    poolGameRoutine(3, "true", "bad");
});

document.getElementById("poolIncorrectBtn").addEventListener("click", function (event) {
    poolGameRoutine(2, "true", "bad");
});

document.getElementById("poolWrBallBtn").addEventListener("click", function (event) {
    poolGameRoutine(4, "true", "bad");
});

document.getElementById("removeLastBtn").addEventListener("click", function (event) {
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) {
		existingStrikes = [];
		return;
	}
	round = round - 1;

	var lastStrike = existingStrikes.pop();

    if (lastStrike.player === parseInt(getCookie("myId"))) {
        if (lastStrike.strikeType === 1) {
			$("#pl1good").html( parseInt($("#pl1good").text()) - 1 );
		}
		else if (lastStrike.strikeType == 3){
            activePlayer = (activePlayer === 1) ? 0 : 1;

            setActivePlayerOnScreen();
		}
		else {
			$("#pl1bad").html( parseInt($("#pl1bad").text()) - 1 );
            activePlayer = (activePlayer === 1) ? 0 : 1;

            setActivePlayerOnScreen();
		}
	}
	else {
        if (lastStrike.strikeType === 1)
			$("#pl2good").html( parseInt($("#pl2good").text()) - 1 );
        else if (lastStrike.strikeType === 3) {
            activePlayer = (activePlayer === 1) ? 0 : 1;

            setActivePlayerOnScreen();
		}
		else {
			$("#pl2bad").html( parseInt($("#pl2bad").text()) - 1 );
            activePlayer = (activePlayer === 1) ? 0 : 1;

            setActivePlayerOnScreen();
		}
	}
	localStorage.setItem("currentGame", null);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
    localStorage.setItem("activePlayer", activePlayer);

    var savedCounterValues = poolGetSavedCounterValuesObjs();
    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

	console.log(JSON.parse(localStorage.getItem("currentGame"))); 
});

document.getElementById("poolOthFaulBtn").addEventListener("click", function (event) {
    poolGameRoutine(5, "true", "bad");
});


// ------------------ENDINGS OF POOL GAME---------------------------------------------


// End of game buttons
document.getElementById("correctEndBtn").addEventListener("click", function (event) {
    poolEndGameRoutine(6);
});

document.getElementById("poolFaul8Btn").addEventListener("click", function (event) {
    poolEndGameRoutine(7);
});

document.getElementById("pool8tooSoonBtn").addEventListener("click", function (event) {
    poolEndGameRoutine(8);
});

document.getElementById("pool8WrHoleBtn").addEventListener("click", function (event) {
    poolEndGameRoutine(9);
});

document.getElementById("pool8OfTableBtn").addEventListener("click", function (event) {
    poolEndGameRoutine(10);
});

document.getElementById("endGameBtn").addEventListener("click", function (event) {
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

    if (navigator.onLine === true) {
        sendStrikes();
        sendGameEnd();
    }
    else {
        saveGameEnd();
    }
    clearTimeout(timerVar);


    $("#looseModalWindow").modal("hide");
    $("#poolControlDiv").css("display", "none");
    $("#newGameDiv").css("display", "block");
    localStorage.setItem("activeGame", "false");
    localStorage.setItem("currentGame", "false");
    localStorage.setItem("savedGame", "false");
    clearTimeout(timerVar);
    isSecondPlayerAuthorized = false;
    $("#pl0").val("");

    $("#gameType").prop("checked", false);
});


/*---------------Pool panel---------------*/

document.getElementById("carCorrectBtn").addEventListener("click", function (event) {
    carGameRoutine(11, "good");
});

document.getElementById("carFaulBtn").addEventListener("click", function (event) {
    round++;
    carGameRoutine(12, "true", "bad");
});

document.getElementById("carRemoveLastBtn").addEventListener("click", function (event) {
    var existingStrikes = JSON.parse(localStorage.getItem("currentGame"));

    if (existingStrikes == null) {
        existingStrikes = [];
        return;
    }

    var lastStrike = existingStrikes.pop();


    if (lastStrike.player === parseInt(getCookie("myId"))) {
        if (lastStrike.strikeType === 11) {
            $("#pl1goodc").html(parseInt($("#pl1goodc").text()) - 1);
        }
        else if (lastStrike.strikeType === 12) {
            activePlayer = (activePlayer === 1) ? 0 : 1;
        }
    }
    else {
        if (lastStrike.strikeType === 11) {
            $("#pl1goodc").html(parseInt($("#pl2goodc").text()) - 1);
        }
        else if (lastStrike.strikeType === 12) {
            activePlayer = (activePlayer === 1) ? 0 : 1;
        }
    }
    setActivePlayerOnScreen();

    round = existingStrikes[existingStrikes.length - 1].round;
    if (localStorage.getItem("carType") === "1") {
        $("#carGameType1CurrentRound").html(round);
    }
    else if ((localStorage.getItem("carType") === "2")) {
        $("#carGameType2RoundsRemain").html(parseInt($("#carGameType2RoundsTotal").html()) - round + 1);
    }

    var savedCounterValues = poolGetSavedCounterValuesObjs();
    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

    localStorage.setItem("currentGame", null);
    localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
    console.log("STEP BACK");
    console.log("--currentGame        ", JSON.parse(localStorage.getItem("currentGame")));

});


document.getElementById("carEndGameBtn").addEventListener("click", function (event) {
    //if (navigator.onLine === true) // if there is connection to internet
    //{
    sendStrikes();
    sendGameEnd();

    //}
    clearTimeout(timerVar);
    isSecondPlayerAuthorized = false;
    $("#pl0").val("");

    $("#carGameType1Div").hide();
    $("#carGameType2Div").hide();

    $("#gameType").prop("checked", false);
});