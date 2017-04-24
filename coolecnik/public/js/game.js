
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
 players: arr(id, name)
 currentGame: arr(obj)
 */

// check if there are unended or saved but unsent games
// Handler for document.ready() called.
$(function () {
    if (localStorage.getItem("activeGame") === "true") { //there is unended game
        poolRestoreGame();
    }

    else if (localStorage.getItem("savedGame") === "true") { //there is saved unsent game
        poolSendSavedGame();
    }
    isSecondPlayerAuthorized = false;
});





var totalSeconds = 0;


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


// -------------------------------------------------------------------------------------------------------------------
// ------------------ENDINGS OF POOL GAME---------------------------------------------
// -------------------------------------------------------------------------------------------------------------------


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
});

