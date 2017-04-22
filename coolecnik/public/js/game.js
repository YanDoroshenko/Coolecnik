// Session checking
/*function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
 }*/


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

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

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

// timer for HTML timer - starts from 0
function countTimer() {
    /*++totalSeconds;
     var hour = Math.floor(totalSeconds /3600);
     var minute = Math.floor((totalSeconds - hour*3600)/60);
     var seconds = totalSeconds - (hour*3600 + minute*60);

     document.getElementById("timerM").innerHTML = minute + "m : " + seconds + "s";*/
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
    localStorage.setItem("savedTime", JSON.stringify(timeObj));
}
// timer for HTML timer - starts from secStart
function countTimer1() {
    ++totalSeconds;
    var hour = Math.floor(totalSeconds / 3600);
    var minute = Math.floor((totalSeconds - hour * 3600) / 60);
    var seconds = totalSeconds - (hour * 3600 + minute * 60);

    document.getElementById("timer").innerHTML = minute + "m : " + seconds + "s";
}


var totalSeconds = 0;


function hash(str, asString, seed) {
    var i, l,
        hval = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if (asString) {
        // Convert to 8 digit hex string
        return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
}


/*---------------New game panel---------------*/
$("#gameType").change(function () {
    if (this.checked) {
        //Do stuff
        var carambCount = "<input id='carCount' type='text' placeholder='Počet karambolů' class='form-control'>";
        $("#hr").before(carambCount);
        //$("#carCount").collapse("show");
    }
    else {
        // this has to be here really twice - dont know why but it works properly only this way
        $("#carCount").remove();
        $("#carCount").remove();
        //$("#carCount").collapse("hide");
    }
});

document.getElementById("authPlayer2btn").addEventListener("click", function (event) {
    event.preventDefault();
    if (isSecondPlayerAuthMenuOpened === true)
    	return;
    var passField = "<input id='pass' type='password' placeholder='Heslo protihráče' class='form-control' style='width: 70.7%; display: inline;'>";
    var authKey = "<button class='icon-key' id='authBtn' style='width: 42px; height: 32px; padding-top: 3%; margin-left: 2%'></button>";
    var thrashKey = "<button class='icon-thrash' id='thrashBtn' style='width: 42px; height: 32px; padding-top: 3%; margin-left: 2%'></button>";
    isSecondPlayerAuthMenuOpened = true;
    $("#authPlayer2btn").after(passField + authKey + thrashKey);


    document.getElementById("authBtn").addEventListener("click", function (event) {
    	event.preventDefault();
    	$("#newGameSpan").val = "";
    	document.getElementById("authBtn").className = "icon-load";

    	var obj = {
	        "login": $('#pl0').val(),
	        "passwordHash": hash($('#pass').val(), true, $('#pass').val().length).toString()
    	};


    	$.ajax("api/login", {
	        type: "POST",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(obj),
	        statusCode: {
	            202: function (response) {
	                console.log("202 ACCEPTED");
                    if (getCookie("myId") == response.id) {
	                	$("#newGameSpan").text("Nelze hrát s sebou. Fakt nemáte kamarádi na to? Je to smůla");
	                	document.getElementById("authBtn").className = "icon-key";
	                	return;
	                }
	                isSecondPlayerAuthorized = true;
	                localStorage.setItem("secondPlayerId", response.id);
	                document.getElementById("authBtn").className = "icon-ok";
	            },
	            400: function (response) {
	                document.getElementById("authBtn").className = "icon-nook";
	            },
	            401: function (response) {
	                document.getElementById("authBtn").className = "icon-nook";
	            }
	        }
    	});

    });



    document.getElementById("thrashBtn").addEventListener("click", function (event) {
    	event.preventDefault();
    	document.getElementById("authBtn").className = "icon-key";
    	$("#pass").remove();
    	$("#authBtn").remove();
    	$("#thrashBtn").remove();
    	isSecondPlayerAuthorized = false;
    	isSecondPlayerAuthMenuOpened = false;
    });

});

// callbacked function for addEventListeners of friends
function tempFunc(event, btnArrHtml, btnArr, i) {
    // if clicked on any friend, not "JIny hrac"
    if (btnArr[i].value !== "-41") {
        console.log(btnArrHtml, i);
        var plname = String(btnArrHtml[i]).slice(65);
        plname = plname.slice(0, -9);
        plname = btnArr[i].innerHTML;
        console.log(btnArr[i]);
        var plid = btnArr[i].value;
        localStorage.setItem("secondPlayerId", btnArr[i].value);
        isSecondPlayerAuthorized = true;
        $("#pl0").val(plname);
        $("#authPlayer2btn").css("display", "none");
    }
    else {
        $("#authPlayer2btn").css("display", "inline");
        $("#pl0").val("");
    }
}

document.getElementById("inviteFriend").addEventListener("click", function (event) {
    $("#friendList").html("");
    var endpoint = "/api/players/" + getCookie("myId") + "/friends";
    $.ajax(endpoint, {
        type: "GET",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            200: function (response) {
                var str1 = "<button class='dropdown-item friendBtns' type='button' value='";
                var str2 = "'>";
                var str3 = "</button>";
                var btnArrHtml = [];

                response.forEach(function (item, i, response) {
                    btnArrHtml.push(str1 + item.id + str2 + item.login + str3);
                    $("#friendList").html($("#friendList").html() + str1 + item.id + str2 + item.login + str3);
                });
                btnArrHtml.push(str1 + "-41" + str2 + "Jiny hrac" + str3);
                $("#friendList").html($("#friendList").html() + "<hr>" + str1 + "-41" + str2 + "<i>Jiny hrac</i>" + str3);
                var btnArr = document.querySelectorAll(".friendBtns");
                console.log(btnArr);
                for (var i = 0; i < btnArr.length; i++) {
                    // fucking closure. What the hell is this?
                    (function (i) {
                        btnArr[i].addEventListener('click', function () {
                            tempFunc(event, btnArrHtml, btnArr, i);
                        }, false);
                    })(i);
                }

            },
            404: function (response) {
                console.log("404");
            }
        }
    })
});

document.getElementById("newGameBtn").addEventListener("click", function (event) {
	event.preventDefault();
	$("#newGameSpan").val = "";
	if ($("#pl0").val().length == 0){
		$("#newGameSpan").text("Jméno musí být neprazdné");
		return;
	}

	if (document.getElementById('gameType').checked)
		var gameType = 2; //karambol
	else
		var gameType = 1; //pool
    localStorage.setItem("gameType", gameType);

	var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset()/60 + "00";
	if (new Date().getTimezoneOffset()/60 < 10 && new Date().getTimezoneOffset()/60 > -10)
		dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";

    if (dateTime[20] === "0") {
        dateTime = dateTime.replaceAt(20, "+");
        console.log("new dateTime ", dateTime);
    }

	localStorage.setItem("secondPlayerName", $('#pl0').val());

	var obj = {
	        "gameType": gameType,
        "player1": parseInt(getCookie("myId")),
        "player2": (isSecondPlayerAuthorized === true) ? parseInt(localStorage.getItem("secondPlayerId")) : -1,
	        "beginning": dateTime
    	};

    $.ajax("/api/games/new", {
	        type: "POST",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(obj),
	        statusCode: {
	            201: function (response) {
                    console.log("201 CREATED");

                    localStorage.setItem("currentGame", null);
                    $("#player1").text(getCookie("myName"));
	                $("#player2").text($('#pl0').val());
	                $("#newGameDiv").css("display", "none");

                    if (gameType === 1) {
	                	$("#poolControlDiv").css("display", "block");
	                }
	                else {
	                	$("#karambolControlDiv").css("display", "block");
	                }

	                gameId = response.id;
                    players = [{
                        "id": parseInt(getCookie("myId")),
                        "name": getCookie("myName")
                    }, {
                        "id": (isSecondPlayerAuthorized == true) ? parseInt(localStorage.getItem("secondPlayerId")) : -1,
                        "name": $('#pl0').val()
                    }];
                    localStorage.setItem("players", JSON.stringify(players));

					activePlayer = Math.floor(Math.random() * (3 - 1)) + 1; // 1 for 1st player, 2 for second
                    if (activePlayer === 1) {
						document.getElementById("player1").className = "active-player";
						document.getElementById("player2").className = "";
					}
					else {
						document.getElementById("player1").className = "";
						document.getElementById("player2").className = "active-player";
					}
                    localStorage.setItem("activePlayer", activePlayer);

                    $("#helpDiv").html("");
                    $("#endOfGameDiv").html("");

                    $("#pl1good").html("0");
                    $("#pl2good").html("0");
                    $("#pl1bad").html("0");
                    $("#pl2bad").html("0");

                    $("#timerM").html("0");
                    $("#timerS").html("0");
                    var savedCounterValues = {
                        "green1": 0,
                        "green2": 0,
                        "red1": 0,
                        "red2": 0
                    };
                    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

                    localStorage.setItem("activeGame", true);

                    localStorage.setItem("savedGame", null);
                    localStorage.setItem("savedGameInfo", null);
                    clearTimeout(timerVar);
                    timerVar = setInterval(countTimer, 1000);
                    round = 1;
	            },
	            400: function (response) {
                    console.log("400 BAD REQUEST");
	                $("#newGameSpan").val = "OH NO";
                    localStorage.setItem("activeGame", "false");
	            },
                409: function (response) {
                    console.log("409 CONFLICT");
	                $("#newGameSpan").val = "OH NO";
                    localStorage.setItem("activeGame", "false");
	            }
	        }
    	});


});



/*---------------Pool panel---------------*/
document.getElementById("poolCorrectBtn").addEventListener("click", function (event) {
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

    var obj = {
		"strikeType" : 1,
		"game" : gameId,
        "player": (activePlayer === 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));

    if (activePlayer === 1)
		$("#pl1good").html( parseInt($("#pl1good").text()) + 1 );
	else
		$("#pl2good").html( parseInt($("#pl2good").text()) + 1 );
	round = round + 1;

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
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

    var obj = {
        "strikeType": 2,
		"game" : gameId,
        "player": (activePlayer === 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));

    if (activePlayer === 1)
		$("#pl1bad").html( parseInt($("#pl1bad").text()) + 1 );
	else
		$("#pl2bad").html( parseInt($("#pl2bad").text()) + 1 );
	round = round + 1;

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

    var savedCounterValues = {
        "green1": $("#pl1good").text(),
        "green2": $("#pl2good").text(),
        "red1": $("#pl1bad").text(),
        "red2": $("#pl2bad").text()
    };
    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

	console.log(JSON.parse(localStorage.getItem("currentGame"))); 
});

document.getElementById("poolIncorrectBtn").addEventListener("click", function (event) {
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

    var obj = {
        "strikeType": 3,
		"game" : gameId,
        "player": (activePlayer === 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
	round = round + 1;
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

    var savedCounterValues = {
        "green1": $("#pl1good").text(),
        "green2": $("#pl2good").text(),
        "red1": $("#pl1bad").text(),
        "red2": $("#pl2bad").text()
    };
    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

	console.log(JSON.parse(localStorage.getItem("currentGame"))); 
});

document.getElementById("poolWrBallBtn").addEventListener("click", function (event) {
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

    var obj = {
		"strikeType" : 4,
		"game" : gameId,
        "player": (activePlayer === 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));

    if (activePlayer === 1)
		$("#pl1bad").html( parseInt($("#pl1bad").text()) + 1 );
	else
		$("#pl2bad").html( parseInt($("#pl2bad").text()) + 1 );
	round = round + 1;
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

    var savedCounterValues = {
        "green1": $("#pl1good").text(),
        "green2": $("#pl2good").text(),
        "red1": $("#pl1bad").text(),
        "red2": $("#pl2bad").text()
    };
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

    var savedCounterValues = {
        "green1": $("#pl1good").text(),
        "green2": $("#pl2good").text(),
        "red1": $("#pl1bad").text(),
        "red2": $("#pl2bad").text()
    };
    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

	console.log(JSON.parse(localStorage.getItem("currentGame"))); 
});

document.getElementById("poolOthFaulBtn").addEventListener("click", function (event) {
    var activePlayer = parseInt(localStorage.getItem("activePlayer"));

    var obj = {
		"strikeType" : 5,
		"game" : gameId,
        "player": (activePlayer === 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));

    if (activePlayer === 1)
		$("#pl1bad").html( parseInt($("#pl1bad").text()) + 1 );
	else
		$("#pl2bad").html( parseInt($("#pl2bad").text()) + 1 );
	round = round + 1;
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

    var savedCounterValues = {
        "green1": $("#pl1good").text(),
        "green2": $("#pl2good").text(),
        "red1": $("#pl1bad").text(),
        "red2": $("#pl2bad").text()
    };
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

