// funcs to be saved to             gamesFuncs.js
function saveStrike() {
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

    var obj = {
        "strikeType": 1,
        "game": gameId,
        "player": (activePlayer === 1) ? players[0].id : players[1].id,
        "round": round
    };
    var existingStrikes = JSON.parse(localStorage.getItem("currentGame"));

    if (existingStrikes === null)
        existingStrikes = [];

    existingStrikes.push(obj);
    localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
}


function poolFormSavedCounterValuesObjs() {
    var savedCounterValues = {
        "green1": $("#pl1good").text(),
        "green2": $("#pl2good").text(),
        "red1": $("#pl1bad").text(),
        "red2": $("#pl2bad").text()
    };
    return savedCounterValues;
}

//----------------end INCLUDE-------------------------


function changeActivePlayerOnScreen() {

}




var isSecondPlayerAuthorized = false;
var isSecondPlayerAuthMenuOpened = false;
var players, activePlayer, round = 1, gameId, timerVar;

/*
 localStorage mapping:
 activeGame: bool
 savedGame: bool
 savedGameInfo: obj("gameId","pl2Name","pl2Id","endOfGameTime", "winner")
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
        console.log("UNENDED GAME");
        //show panel for the game
        $("#newGameDiv").css("display", "none");
        if (localStorage.getItem("gameType") === "1") {
            $("#poolControlDiv").css("display", "block");
        }
        else if (localStorage.getItem("gameType") === "2") {
            $("#karambolControlDiv").css("display", "block");
        }
        else {
            $("#helpDiv").html("internal error");
            return;
        }
        //set the active player
        if (localStorage.getItem("activePlayer") === "1") {
            document.getElementById("player1").className = "active-player";
            document.getElementById("player2").className = "";
        }
        else {
            document.getElementById("player1").className = "";
            document.getElementById("player2").className = "active-player";
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
        var strikes = JSON.parse(localStorage.getItem("savedCounterValues"));
        $("#pl1good").html(strikes["green1"]);
        $("#pl2good").html(strikes["green2"]);
        $("#pl1bad").html(strikes["red1"]);
        $("#pl2bad").html(strikes["red2"]);

        //set other vars
        activePlayer = parseInt(localStorage.getItem("activePlayer"));
        players = JSON.parse(localStorage.getItem("players"));
    }

    else if (localStorage.getItem("savedGame") === "true") { //there is saved unsent game
        // id=savedGameModalDiv  for text
        $("#savedGameModalWindow").modal();
        var gameInfo = JSON.parse(localStorage.getItem("savedGameInfo"));
        $("#savedGameModalDiv").html("Máte uloženou hru s hráčem " + gameInfo.pl2Name + " od " + gameInfo.dateTimeString);

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
                        $("#endOfGameDiv").html("Hra je ukoncena a ulozena na serveru")
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
    isSecondPlayerAuthorized = false;
});





var totalSeconds = 0;





/*---------------New game panel---------------*/



/*---------------Pool panel---------------*/
document.getElementById("poolCorrectBtn").addEventListener("click", function (event) {

    saveStrike();
    round++;
    if (activePlayer === 1)
		$("#pl1good").html( parseInt($("#pl1good").text()) + 1 );
	else
		$("#pl2good").html( parseInt($("#pl2good").text()) + 1 );

    var savedCounterValues = {
        "green1": $("#pl1good").text(),
        "green2": $("#pl2good").text(),
        "red1": $("#pl1bad").text(),
        "red2": $("#pl2bad").text()
    };
    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

	console.log(JSON.parse(localStorage.getItem("currentGame"))); 
});

document.getElementById("poolWhInHoleBtn").addEventListener("click", function (event) {
    saveStrike();
    round++;
    if (activePlayer === 1)
		$("#pl1bad").html( parseInt($("#pl1bad").text()) + 1 );
	else
		$("#pl2bad").html( parseInt($("#pl2bad").text()) + 1 );

    activePlayer = (activePlayer === 1) ? 0 : 1;

    if (activePlayer === 1) {
		document.getElementById("player1").className = "active-player";
		document.getElementById("player2").className = "";
	}
	else {
		document.getElementById("player1").className = "";
		document.getElementById("player2").className = "active-player";
	}
    localStorage.setItem("activePlayer", activePlayer);

    var savedCounterValues = poolFormSavedCounterValuesObjs();
    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

	console.log(JSON.parse(localStorage.getItem("currentGame"))); 
});

document.getElementById("poolIncorrectBtn").addEventListener("click", function (event) {
    saveStrike();
    round++;
    activePlayer = (activePlayer === 1) ? 0 : 1;
    if (activePlayer === 1) {
		document.getElementById("player1").className = "active-player";
		document.getElementById("player2").className = "";
	}
	else {
		document.getElementById("player1").className = "";
		document.getElementById("player2").className = "active-player";
	}
    localStorage.setItem("activePlayer", activePlayer);

    var savedCounterValues = poolFormSavedCounterValuesObjs();
    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

	console.log(JSON.parse(localStorage.getItem("currentGame"))); 
});

document.getElementById("poolWrBallBtn").addEventListener("click", function (event) {
    saveStrike();
    round++;

    if (activePlayer === 1)
		$("#pl1bad").html( parseInt($("#pl1bad").text()) + 1 );
	else
		$("#pl2bad").html( parseInt($("#pl2bad").text()) + 1 );
    activePlayer = (activePlayer === 1) ? 0 : 1;
    if (activePlayer === 1) {
		document.getElementById("player1").className = "active-player";
		document.getElementById("player2").className = "";
	}
	else {
		document.getElementById("player1").className = "";
		document.getElementById("player2").className = "active-player";
	}
    localStorage.setItem("activePlayer", activePlayer);

    var savedCounterValues = poolFormSavedCounterValuesObjs();
    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

	console.log(JSON.parse(localStorage.getItem("currentGame"))); 
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
            if (activePlayer === 1) {
				document.getElementById("player1").className = "active-player";
				document.getElementById("player2").className = "";
			}
			else {
				document.getElementById("player1").className = "";
				document.getElementById("player2").className = "active-player";
			}
		}
		else {
			$("#pl1bad").html( parseInt($("#pl1bad").text()) - 1 );
            activePlayer = (activePlayer === 1) ? 0 : 1;
            if (activePlayer === 1) {
				document.getElementById("player1").className = "active-player";
				document.getElementById("player2").className = "";
			}
			else {
				document.getElementById("player1").className = "";
				document.getElementById("player2").className = "active-player";
			}
		}
	}
	else {
        if (lastStrike.strikeType === 1)
			$("#pl2good").html( parseInt($("#pl2good").text()) - 1 );
        else if (lastStrike.strikeType === 3) {
            activePlayer = (activePlayer === 1) ? 0 : 1;
            if (activePlayer === 1) {
				document.getElementById("player1").className = "active-player";
				document.getElementById("player2").className = "";
			}
			else {
				document.getElementById("player1").className = "";
				document.getElementById("player2").className = "active-player";
			}
		}
		else {
			$("#pl2bad").html( parseInt($("#pl2bad").text()) - 1 );
            activePlayer = (activePlayer === 1) ? 0 : 1;
            if (activePlayer === 1) {
				document.getElementById("player1").className = "active-player";
				document.getElementById("player2").className = "";
			}
			else {
				document.getElementById("player1").className = "";
				document.getElementById("player2").className = "active-player";
			}
		}
	}
	localStorage.setItem("currentGame", null);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
    localStorage.setItem("activePlayer", activePlayer);

    var savedCounterValues = poolFormSavedCounterValuesObjs();
    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

	console.log(JSON.parse(localStorage.getItem("currentGame"))); 
});

document.getElementById("poolOthFaulBtn").addEventListener("click", function (event) {
    saveStrike();
    round++;
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));

    if (activePlayer === 1)
		$("#pl1bad").html( parseInt($("#pl1bad").text()) + 1 );
	else
		$("#pl2bad").html( parseInt($("#pl2bad").text()) + 1 );
    activePlayer = (activePlayer === 1) ? 0 : 1;
    if (activePlayer === 1) {
		document.getElementById("player1").className = "active-player";
		document.getElementById("player2").className = "";
	}
	else {
		document.getElementById("player1").className = "";
		document.getElementById("player2").className = "active-player";
	}
    localStorage.setItem("activePlayer", activePlayer);

    var savedCounterValues = poolFormSavedCounterValuesObjs();
    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

	console.log(JSON.parse(localStorage.getItem("currentGame"))); 
});


// -------------------------------------------------------------------------------------------------------------------
// ------------------ENDINGS OF POOL GAME---------------------------------------------
// -------------------------------------------------------------------------------------------------------------------


// End of game buttons
document.getElementById("correctEndBtn").addEventListener("click", function (event) {
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

    var obj = {
        "strikeType": 6,
        "game": gameId,
        "player": (activePlayer === 1) ? players[0].id : players[1].id,
        "round": round
    };
    var existingStrikes = JSON.parse(localStorage.getItem("currentGame"));

    if (existingStrikes == null)
        existingStrikes = [];

    existingStrikes.push(obj);
    localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
	// send game to server
    if (navigator.onLine === true) // if there is connection to internet
    {
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
                    $("#newGameDiv").css("display", "block");
                    $("#helpDiv").html("Hra byla ukončená a uložená na serveru");
                    clearTimeout(timerVar);
                },
                400: function (response) {
                    console.log("400 BAD REQUEST");
                },
                409: function (response) {
                    console.log("409 CONFLICT");
                }
            }
        });

        // send end of game
        var endpoint = "/api/games/" + gameId + "/end";
        var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
        if (new Date().getTimezoneOffset() / 60 < 10 && new Date().getTimezoneOffset() / 60 > -10)
            dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
        if (dateTime[20] === "0") {
            dateTime = dateTime.replaceAt(20, "+");
            console.log("new dateTime ", dateTime);
        }
        var obj = {
            "end": dateTime,
            "winner": (activePlayer === 1) ? parseInt(players[0].id) : parseInt(players[1].id)
        };
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
                },
                500: function (response) {
                    console.log("500 INTERNAL SERVER ERROR");
                    $("#looseModalWindow").modal("hide");
                    $("#poolControlDiv").css("display", "none");
                    $("#karambolControlDiv").css("display", "none");
                    $("#newGameDiv").css("display", "block");
                    $("#helpDiv").html("Hra byla ukončená a uložená na serveru");
                    clearTimeout(timerVar);
                }
            }

        });
        localStorage.setItem("currentGame", "null");
        localStorage.setItem("activeGame", "false");
    }

    else {
        $("#looseModalWindow").modal("hide");
        $("#poolControlDiv").css("display", "none");
        $("#karambolControlDiv").css("display", "none");
        $("#endOfGameDiv").css("display", "block");
        $("#endOfGameDiv").html("Hra je ukoncena, ale neni odeslana z duvovu toho ze <u>neni pripojeni k intrnetu</u>." +
            "Hra bude odeslana na server az otevrete tuto stranku pri aktivnem internet pripojeni.");
        localStorage.setItem("savedGame", "true");
        var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
        var currentdate = new Date();
        if (dateTime[20] === "0") {
            dateTime = dateTime.replaceAt(20, "+");
            console.log("new dateTime ", dateTime);
        }
        var h = (currentdate.getHours() < 10) ? "0" + currentdate.getHours() : currentdate.getHours();
        var m = (currentdate.getMinutes() < 10) ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + "  "
            + h + ":"
            + m;
        obj = {
            "gameId": gameId,
            "gameType": localStorage.getItem("gameType"),
            "pl2Name": players[1].name,
            "pl2Id": players[1].id,
            "endOfGameTime": dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00",
            "dateTimeString": datetime,
            "winner": (activePlayer === 1) ? players[0].id : players[1].id
        };
        localStorage.setItem("savedGameInfo", JSON.stringify(obj));
        localStorage.setItem("activeGame", "false");
    }
    clearTimeout(timerVar);
    isSecondPlayerAuthorized = false;
    $("#pl0").val("");

});

document.getElementById("poolFaul8Btn").addEventListener("click", function (event) {
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

    var obj = {
        "strikeType": 7,
		"game" : gameId,
        "player": (activePlayer === 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
	// send game to server
    if (navigator.onLine === true) {
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
                    $("#newGameDiv").css("display", "block");
                    $("#helpDiv").html("Hra byla ukončená a uložená na serveru");
                    clearTimeout(timerVar);
                },
                400: function (response) {
                    console.log("400 BAD REQUEST");
                },
                409: function (response) {
                    console.log("409 CONFLICT");
                }
            }
        });
        // send end of game
        var endpoint = "/api/games/" + gameId + "/end";
        var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
        if (new Date().getTimezoneOffset() / 60 < 10 && new Date().getTimezoneOffset() / 60 > -10)
            dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
        if (dateTime[20] === "0") {
            dateTime = dateTime.replaceAt(20, "+");
            console.log("new dateTime ", dateTime);
        }
        var obj = {
            "end": dateTime,
            "winner": (activePlayer === 1) ? parseInt(players[1].id) : parseInt(players[0].id)
        };
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
        localStorage.setItem("activeGame", "false");
    }
    else {
        $("#looseModalWindow").modal("hide");
        $("#poolControlDiv").css("display", "none");
        $("#karambolControlDiv").css("display", "none");
        $("#endOfGameDiv").css("display", "block");
        $("#endOfGameDiv").html("Hra je ukoncena, ale neni odeslana z duvovu toho ze <u>neni pripojeni k intrnetu</u>." +
            "Hra bude odeslana na server az otevrete tuto stranku pri aktivnem internet pripojeni.");
        localStorage.setItem("savedGame", "true");
        var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
        dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
        if (dateTime[20] === "0") {
            dateTime = dateTime.replaceAt(20, "+");
            console.log("new dateTime ", dateTime);
        }
        var currentdate = new Date();
        var h = (currentdate.getHours() < 10) ? "0" + currentdate.getHours() : currentdate.getHours();
        var m = (currentdate.getMinutes() < 10) ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + "  "
            + h + ":"
            + m;
        obj = {
            "gameId": gameId,
            "gameType": localStorage.getItem("gameType"),
            "pl2Name": players[1].name,
            "pl2Id": players[1].id,
            "endOfGameTime": dateTime,
            "dateTimeString": datetime,
            "winner": (activePlayer === 1) ? players[1].id : players[0].id
        };
        localStorage.setItem("savedGameInfo", JSON.stringify(obj));
        localStorage.setItem("activeGame", "false");
    }
    clearTimeout(timerVar);
    isSecondPlayerAuthorized = false;
    $("#pl0").val("");
});

document.getElementById("pool8tooSoonBtn").addEventListener("click", function (event) {
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

    var obj = {
        "strikeType": 8,
		"game" : gameId,
        "player": (activePlayer === 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
	// send game to server
    if (navigator.onLine === true) {
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
                    $("#newGameDiv").css("display", "block");
                    $("#helpDiv").html("Hra byla ukončená a uložená na serveru");
                    clearTimeout(timerVar);
                },
                400: function (response) {
                    console.log("400 BAD REQUEST");
                },
                409: function (response) {
                    console.log("409 CONFLICT");
                }
            }
        });
        // send end of game
        var endpoint = "/api/games/" + gameId + "/end";
        var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
        if (new Date().getTimezoneOffset() / 60 < 10 && new Date().getTimezoneOffset() / 60 > -10)
            dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
        if (dateTime[20] === "0") {
            dateTime = dateTime.replaceAt(20, "+");
            console.log("new dateTime ", dateTime);
        }
        var obj = {
            "end": dateTime,
            "winner": (activePlayer === 1) ? players[1].id : players[0].id
        };
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
        localStorage.setItem("activeGame", "false");
    }
    else {
        $("#looseModalWindow").modal("hide");
        $("#poolControlDiv").css("display", "none");
        $("#karambolControlDiv").css("display", "none");
        $("#endOfGameDiv").css("display", "block");
        $("#endOfGameDiv").html("Hra je ukoncena, ale neni odeslana z duvovu toho ze <u>neni pripojeni k intrnetu</u>." +
            "Hra bude odeslana na server az otevrete tuto stranku pri aktivnem internet pripojeni.");
        localStorage.setItem("savedGame", "true");
        var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
        dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
        if (dateTime[20] === "0") {
            dateTime = dateTime.replaceAt(20, "+");
            console.log("new dateTime ", dateTime);
        }
        var currentdate = new Date();
        var h = (currentdate.getHours() < 10) ? "0" + currentdate.getHours() : currentdate.getHours();
        var m = (currentdate.getMinutes() < 10) ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + "  "
            + h + ":"
            + m;
        obj = {
            "gameId": gameId,
            "gameType": localStorage.getItem("gameType"),
            "pl2Name": players[1].name,
            "pl2Id": players[1].id,
            "endOfGameTime": dateTime,
            "dateTimeString": datetime,
            "winner": (activePlayer === 1) ? parseInt(players[1].id) : parseInt(players[0].id)
        };
        localStorage.setItem("savedGameInfo", JSON.stringify(obj));
        localStorage.setItem("activeGame", "false");
    }
    clearTimeout(timerVar);
    isSecondPlayerAuthorized = false;
    $("#pl0").val("");
});

document.getElementById("pool8WrHoleBtn").addEventListener("click", function (event) {
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

    var obj = {
        "strikeType": 9,
		"game" : gameId,
        "player": (activePlayer === 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
	// send game to server
    if (navigator.onLine === true) {
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
                    $("#newGameDiv").css("display", "block");
                    $("#helpDiv").html("Hra byla ukončená a uložená na serveru");
                    clearTimeout(timerVar);
                },
                400: function (response) {
                    console.log("400 BAD REQUEST");
                },
                409: function (response) {
                    console.log("409 CONFLICT");
                }
            }
        });
        // send end of game
        var endpoint = "/api/games/" + gameId + "/end";
        var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
        if (new Date().getTimezoneOffset() / 60 < 10 && new Date().getTimezoneOffset() / 60 > -10)
            dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
        if (dateTime[20] === "0") {
            dateTime = dateTime.replaceAt(20, "+");
            console.log("new dateTime ", dateTime);
        }

        var obj = {
            "end": dateTime,
            "winner": (activePlayer === 1) ? players[1].id : players[0].id
        };
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
        localStorage.setItem("activeGame", "false");
    }
    else {
        $("#looseModalWindow").modal("hide");
        $("#poolControlDiv").css("display", "none");
        $("#karambolControlDiv").css("display", "none");
        $("#endOfGameDiv").css("display", "block");
        $("#endOfGameDiv").html("Hra je ukoncena, ale neni odeslana z duvovu toho ze <u>neni pripojeni k intrnetu</u>." +
            "Hra bude odeslana na server az otevrete tuto stranku pri aktivnem internet pripojeni.");
        localStorage.setItem("savedGame", "true");
        var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
        dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
        if (dateTime[20] === "0") {
            dateTime = dateTime.replaceAt(20, "+");
            console.log("new dateTime ", dateTime);
        }
        var currentdate = new Date();
        var h = (currentdate.getHours() < 10) ? "0" + currentdate.getHours() : currentdate.getHours();
        var m = (currentdate.getMinutes() < 10) ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + "  "
            + h + ":"
            + m;
        obj = {
            "gameId": gameId,
            "gameType": localStorage.getItem("gameType"),
            "pl2Name": players[1].name,
            "pl2Id": players[1].id,
            "endOfGameTime": dateTime,
            "dateTimeString": datetime,
            "winner": (activePlayer === 1) ? parseInt(players[1].id) : parseInt(players[0].id)
        };
        localStorage.setItem("savedGameInfo", JSON.stringify(obj));
        localStorage.setItem("activeGame", "false");
    }
    clearTimeout(timerVar);
    isSecondPlayerAuthorized = false;
    $("#pl0").val("");
});

document.getElementById("pool8OfTableBtn").addEventListener("click", function (event) {
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

    var obj = {
        "strikeType": 10,
		"game" : gameId,
        "player": (activePlayer === 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
	// send game to server
    if (navigator.onLine === true) {
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
                    $("#newGameDiv").css("display", "block");
                    $("#helpDiv").html("Hra byla ukončená a uložená na serveru");
                    clearTimeout(timerVar);
                },
                400: function (response) {
                    console.log("400 BAD REQUEST");
                },
                409: function (response) {
                    console.log("409 CONFLICT");
                }
            }
        });
        // send end of game
        var endpoint = "/api/games/" + gameId + "/end";
        var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
        if (new Date().getTimezoneOffset() / 60 < 10 && new Date().getTimezoneOffset() / 60 > -10)
            dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
        if (dateTime[20] === "0") {
            dateTime = dateTime.replaceAt(20, "+");
            console.log("new dateTime ", dateTime);
        }

        var obj = {
            "end": dateTime,
            "winner": (activePlayer === 1) ? players[1].id : players[0].id
        };
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
        localStorage.setItem("activeGame", "false");
    }
    else {
        $("#looseModalWindow").modal("hide");
        $("#poolControlDiv").css("display", "none");
        $("#karambolControlDiv").css("display", "none");
        $("#endOfGameDiv").css("display", "block");
        $("#endOfGameDiv").html("Hra je ukoncena, ale neni odeslana z duvovu toho ze <u>neni pripojeni k intrnetu</u>." +
            "Hra bude odeslana na server az otevrete tuto stranku pri aktivnem internet pripojeni.");
        localStorage.setItem("savedGame", "true");
        var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
        dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
        if (dateTime[20] === "0") {
            dateTime = dateTime.replaceAt(20, "+");
            console.log("new dateTime ", dateTime);
        }
        var currentdate = new Date();
        var h = (currentdate.getHours() < 10) ? "0" + currentdate.getHours() : currentdate.getHours();
        var m = (currentdate.getMinutes() < 10) ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + "  "
            + h + ":"
            + m;
        obj = {
            "gameId": gameId,
            "gameType": localStorage.getItem("gameType"),
            "pl2Name": players[1].name,
            "pl2Id": players[1].id,
            "endOfGameTime": dateTime,
            "dateTimeString": datetime,
            "winner": (activePlayer === 1) ? parseInt(players[1].id) : parseInt(players[0].id)
        };
        localStorage.setItem("savedGameInfo", JSON.stringify(obj));
        localStorage.setItem("activeGame", "false");
    }
    clearTimeout(timerVar);
    isSecondPlayerAuthorized = false;
    $("#pl0").val("");
});

document.getElementById("endGameBtn").addEventListener("click", function (event) {
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

    // send game to server
    if (navigator.onLine === true) {
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
                    $("#newGameDiv").css("display", "block");
                    $("#helpDiv").html("Hra byla ukončená a uložená na serveru");
                    clearTimeout(timerVar);
                },
                400: function (response) {
                    console.log("400 BAD REQUEST");
                },
                409: function (response) {
                    console.log("409 CONFLICT");
                }
            }
        });
        // send end of game
        var endpoint = "/api/games/" + gameId + "/end";
        var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
        if (new Date().getTimezoneOffset() / 60 < 10 && new Date().getTimezoneOffset() / 60 > -10)
            dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
        if (dateTime[20] === "0") {
            dateTime = dateTime.replaceAt(20, "+");
            console.log("new dateTime ", dateTime);
        }

        var obj = {
            "end": dateTime
        };
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
        localStorage.setItem("activeGame", "false");
    }
    else {
        $("#looseModalWindow").modal("hide");
        $("#poolControlDiv").css("display", "none");
        $("#karambolControlDiv").css("display", "none");
        $("#endOfGameDiv").css("display", "block");
        $("#endOfGameDiv").html("Hra je ukoncena, ale neni odeslana z duvovu toho ze <u>neni pripojeni k intrnetu</u>." +
            "Hra bude odeslana na server az otevrete tuto stranku pri aktivnem internet pripojeni.");
        localStorage.setItem("savedGame", "true");
        var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
        dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
        if (dateTime[20] === "0") {
            dateTime = dateTime.replaceAt(20, "+");
            console.log("new dateTime ", dateTime);
        }
        var currentdate = new Date();
        var h = (currentdate.getHours() < 10) ? "0" + currentdate.getHours() : currentdate.getHours();
        var m = (currentdate.getMinutes() < 10) ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + "  "
            + h + ":"
            + m;
        obj = {
            "gameId": gameId,
            "gameType": localStorage.getItem("gameType"),
            "pl2Name": players[1].name,
            "pl2Id": players[1].id,
            "endOfGameTime": dateTime,
            "dateTimeString": datetime,
            "winner": -42
        };
        localStorage.setItem("savedGameInfo", JSON.stringify(obj));
        localStorage.setItem("activeGame", "false");
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

