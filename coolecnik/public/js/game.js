// timer for HTML timer
function countTimer() {
   ++totalSeconds;
   var hour = Math.floor(totalSeconds /3600);
   var minute = Math.floor((totalSeconds - hour*3600)/60);
   var seconds = totalSeconds - (hour*3600 + minute*60);

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



var isSecondPlayerAuthorized = false;
var isSecondPlayerAuthMenuOpened = false;
var players, activePlayer, round = 1, gameId;

/*---------------New game panel---------------*/
document.getElementById("authPlayer2").addEventListener("click", function (event) {
    event.preventDefault();
    if (isSecondPlayerAuthMenuOpened == true)
    	return;
    var passField = "<input id='pass' type='password' placeholder='Heslo protihráče' class='form-control' style='width: 70.7%; display: inline;'>";
    var authKey = "<button class='icon-key' id='authBtn' style='width: 42px; height: 32px; padding-top: 3%; margin-left: 2%'></button>";
    var thrashKey = "<button class='icon-thrash' id='thrashBtn' style='width: 42px; height: 32px; padding-top: 3%; margin-left: 2%'></button>";
    isSecondPlayerAuthMenuOpened = true;
    $("#authPlayer2").after(passField + authKey + thrashKey);


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
	                if (localStorage.getItem("myId") == response.id) {
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

	var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset()/60 + "00";
	if (new Date().getTimezoneOffset()/60 < 10 && new Date().getTimezoneOffset()/60 > -10)
		dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";

	localStorage.setItem("secondPlayerName", $('#pl0').val());

	var obj = {
	        "gameType": gameType,
	        "player1": parseInt(localStorage.getItem("myId")),
	        "player2": (isSecondPlayerAuthorized == true) ? parseInt(localStorage.getItem("secondPlayerId")) : -1,
	        "beginning": dateTime
    	};

    $.ajax("/api/games/new", {
	        type: "POST",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(obj),
	        statusCode: {
	            201: function (response) {
	                console.log("201");
	                localStorage.setItem("currentGame", null);
	                $("#player1").text(localStorage.getItem("myName"));
	                $("#player2").text($('#pl0').val());
	                $("#newGameDiv").css("display", "none");

	                if (gameType == 1){
	                	$("#poolControlDiv").css("display", "block");
	                }
	                else {
	                	$("#karambolControlDiv").css("display", "block");
	                }

	                gameId = response.id;
	                players = new Array({"id" : parseInt(localStorage.getItem("myId")), "name" : localStorage.getItem("myName")}, {"id" : (isSecondPlayerAuthorized == true) ? parseInt(localStorage.getItem("secondPlayerId")) : -1, "name" : $('#pl0').val()});
					activePlayer = Math.floor(Math.random() * (3 - 1)) + 1; // 1 for 1st player, 2 for second
					if (activePlayer == 1){
						document.getElementById("player1").className = "active-player";
						document.getElementById("player2").className = "";
					}
					else {
						document.getElementById("player1").className = "";
						document.getElementById("player2").className = "active-player";
					}
					var timerVar = setInterval(countTimer, 1000);
	            },
	            400: function (response) {
	                console.log("400");
	                $("#newGameSpan").val = "OH NO";
	            },
	            406: function (response) {
	                console.log("406");
	                $("#newGameSpan").val = "OH NO";
	            }
	        }
    	});

});



/*---------------Pool panel---------------*/
document.getElementById("poolCorrectBtn").addEventListener("click", function (event) {
	var obj = {
		"strikeType" : 1,
		"game" : gameId,
		"player" : (activePlayer == 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));

	if (activePlayer == 1)
		$("#pl1good").html( parseInt($("#pl1good").text()) + 1 );
	else
		$("#pl2good").html( parseInt($("#pl2good").text()) + 1 );
	round = round + 1;
});

document.getElementById("poolWhInHoleBtn").addEventListener("click", function (event) {
	var obj = {
		"strikeType" : 2,
		"game" : gameId,
		"player" : (activePlayer == 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));

	if (activePlayer == 1)
		$("#pl1bad").html( parseInt($("#pl1bad").text()) + 1 );
	else
		$("#pl2bad").html( parseInt($("#pl2bad").text()) + 1 );
	round = round + 1;
	activePlayer = (activePlayer == 1) ? 0 : 1;
	if (activePlayer == 1){
		document.getElementById("player1").className = "active-player";
		document.getElementById("player2").className = "";
	}
	else {
		document.getElementById("player1").className = "";
		document.getElementById("player2").className = "active-player";
	}
});

document.getElementById("poolIncorrectBtn").addEventListener("click", function (event) {
	var obj = {
		"strikeType" : 3,
		"game" : gameId,
		"player" : (activePlayer == 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
	round = round + 1;
	activePlayer = (activePlayer == 1) ? 0 : 1;
	if (activePlayer == 1){
		document.getElementById("player1").className = "active-player";
		document.getElementById("player2").className = "";
	}
	else {
		document.getElementById("player1").className = "";
		document.getElementById("player2").className = "active-player";
	}
});

document.getElementById("poolWrBallBtn").addEventListener("click", function (event) {
	var obj = {
		"strikeType" : 4,
		"game" : gameId,
		"player" : (activePlayer == 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));

	if (activePlayer == 1)
		$("#pl1bad").html( parseInt($("#pl1bad").text()) + 1 );
	else
		$("#pl2bad").html( parseInt($("#pl2bad").text()) + 1 );
	round = round + 1;
	activePlayer = (activePlayer == 1) ? 0 : 1;
	if (activePlayer == 1){
		document.getElementById("player1").className = "active-player";
		document.getElementById("player2").className = "";
	}
	else {
		document.getElementById("player1").className = "";
		document.getElementById("player2").className = "active-player";
	}
});

document.getElementById("removeLastBtn").addEventListener("click", function (event) {
	
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) {
		existingStrikes = [];
		return;
	}

	existingStrikes.pop();
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
});

document.getElementById("poolOthFaulBtn").addEventListener("click", function (event) {
	var obj = {
		"strikeType" : 5,
		"game" : gameId,
		"player" : (activePlayer == 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));

	if (activePlayer == 1)
		$("#pl1bad").html( parseInt($("#pl1bad").text()) + 1 );
	else
		$("#pl2bad").html( parseInt($("#pl2bad").text()) + 1 );
	round = round + 1;
	activePlayer = (activePlayer == 1) ? 0 : 1;
	if (activePlayer == 1){
		document.getElementById("player1").className = "active-player";
		document.getElementById("player2").className = "";
	}
	else {
		document.getElementById("player1").className = "";
		document.getElementById("player2").className = "active-player";
	}
});

// TODO Check if there is internet connection!

// End of game buttons
document.getElementById("correctEndBtn").addEventListener("click", function (event) {
	// send game to server
	var allStrikes = JSON.parse(localStorage.getItem("currentGame")); 
	$.ajax("/api/strikes/new", {
	        type: "POST",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(allStrikes),
	        statusCode: {
	            201: function (response) {
	                console.log("201");
	                $("#looseModalWindow").modal("hide");
	                $("#poolControlDiv").css("display", "none");
	                $("#karambolControlDiv").css("display", "none");
	                $("#endOfGameDiv").css("display", "block");
	            },
	            400: function (response) {
	                console.log("400");
	            },
	            406: function (response) {
	                console.log("406");
	            }
	        }
    	});
	// send end of game
	var endpoint = "/api/games/" + gameId + "/end";
	var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset()/60 + "00";
	if (new Date().getTimezoneOffset()/60 < 10 && new Date().getTimezoneOffset()/60 > -10)
		dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
	var obj = {
	        "end": dateTime
    	};
	$.ajax(endpoint, {
	        type: "PUT",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(obj),
	        statusCode: {
	            200: function (response) {
	                console.log("200");
	            },
	            400: function (response) {
	                console.log("400");
	            },
	            406: function (response) {
	                console.log("406");
	            }
	        }
    	});

});

document.getElementById("poolFaul8Btn").addEventListener("click", function (event) {
	var obj = {
		"strikeType" : 6,
		"game" : gameId,
		"player" : (activePlayer == 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
	// send game to server
	var allStrikes = JSON.parse(localStorage.getItem("currentGame")); 
	$.ajax("/api/strikes/new", {
	        type: "POST",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(allStrikes),
	        statusCode: {
	            201: function (response) {
	                console.log("201");
	                $("#looseModalWindow").modal("hide");
	                $("#poolControlDiv").css("display", "none");
	                $("#karambolControlDiv").css("display", "none");
	                $("#endOfGameDiv").css("display", "block");
	            },
	            400: function (response) {
	                console.log("400");
	            },
	            406: function (response) {
	                console.log("406");
	            }
	        }
    	});
	// send end of game
	var endpoint = "/api/games/" + gameId + "/end";
	var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset()/60 + "00";
	if (new Date().getTimezoneOffset()/60 < 10 && new Date().getTimezoneOffset()/60 > -10)
		dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
	var obj = {
	        "end": dateTime
    	};
	$.ajax(endpoint, {
	        type: "PUT",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(obj),
	        statusCode: {
	            200: function (response) {
	                console.log("200");
	            },
	            400: function (response) {
	                console.log("400");
	            },
	            406: function (response) {
	                console.log("406");
	            }
	        }
    	});

});

document.getElementById("pool8tooSoonBtn").addEventListener("click", function (event) {
	var obj = {
		"strikeType" : 7,
		"game" : gameId,
		"player" : (activePlayer == 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
	// send game to server
	var allStrikes = JSON.parse(localStorage.getItem("currentGame")); 
	$.ajax("/api/strikes/new", {
	        type: "POST",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(allStrikes),
	        statusCode: {
	            201: function (response) {
	                console.log("201");
	                $("#looseModalWindow").modal("hide");
	                $("#poolControlDiv").css("display", "none");
	                $("#karambolControlDiv").css("display", "none");
	                $("#endOfGameDiv").css("display", "block");
	            },
	            400: function (response) {
	                console.log("400");
	            },
	            406: function (response) {
	                console.log("406");
	            }
	        }
    	});
	// send end of game
	var endpoint = "/api/games/" + gameId + "/end";
	var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset()/60 + "00";
	if (new Date().getTimezoneOffset()/60 < 10 && new Date().getTimezoneOffset()/60 > -10)
		dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
	var obj = {
	        "end": dateTime
    	};
	$.ajax(endpoint, {
	        type: "PUT",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(obj),
	        statusCode: {
	            200: function (response) {
	                console.log("200");
	            },
	            400: function (response) {
	                console.log("400");
	            },
	            406: function (response) {
	                console.log("406");
	            }
	        }
    	});

});

document.getElementById("pool8WrHoleBtn").addEventListener("click", function (event) {
	var obj = {
		"strikeType" : 8,
		"game" : gameId,
		"player" : (activePlayer == 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
	// send game to server
	var allStrikes = JSON.parse(localStorage.getItem("currentGame")); 
	$.ajax("/api/strikes/new", {
	        type: "POST",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(allStrikes),
	        statusCode: {
	            201: function (response) {
	                console.log("201");
	                $("#looseModalWindow").modal("hide");
	                $("#poolControlDiv").css("display", "none");
	                $("#karambolControlDiv").css("display", "none");
	                $("#endOfGameDiv").css("display", "block");
	            },
	            400: function (response) {
	                console.log("400");
	            },
	            406: function (response) {
	                console.log("406");
	            }
	        }
    	});
	// send end of game
	var endpoint = "/api/games/" + gameId + "/end";
	var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset()/60 + "00";
	if (new Date().getTimezoneOffset()/60 < 10 && new Date().getTimezoneOffset()/60 > -10)
		dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
	var obj = {
	        "end": dateTime
    	};
	$.ajax(endpoint, {
	        type: "PUT",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(obj),
	        statusCode: {
	            200: function (response) {
	                console.log("200");
	            },
	            400: function (response) {
	                console.log("400");
	            },
	            406: function (response) {
	                console.log("406");
	            }
	        }
    	});

});

document.getElementById("pool8OfTableBtn").addEventListener("click", function (event) {
	var obj = {
		"strikeType" : 9,
		"game" : gameId,
		"player" : (activePlayer == 1) ? players[0].id : players[1].id,
		"round" : round
	};
	var existingStrikes = JSON.parse(localStorage.getItem("currentGame")); 

	if (existingStrikes == null) 
		existingStrikes = [];

	existingStrikes.push(obj);
	localStorage.setItem("currentGame", JSON.stringify(existingStrikes));
	// send game to server
	var allStrikes = JSON.parse(localStorage.getItem("currentGame")); 
	$.ajax("/api/strikes/new", {
	        type: "POST",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(allStrikes),
	        statusCode: {
	            201: function (response) {
	                console.log("201");
	                $("#looseModalWindow").modal("hide");
	                $("#poolControlDiv").css("display", "none");
	                $("#karambolControlDiv").css("display", "none");
	                $("#endOfGameDiv").css("display", "block");
	            },
	            400: function (response) {
	                console.log("400");
	            },
	            406: function (response) {
	                console.log("406");
	            }
	        }
    	});
	// send end of game
	var endpoint = "/api/games/" + gameId + "/end";
	var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset()/60 + "00";
	if (new Date().getTimezoneOffset()/60 < 10 && new Date().getTimezoneOffset()/60 > -10)
		dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
	var obj = {
	        "end": dateTime
    	};
	$.ajax(endpoint, {
	        type: "PUT",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(obj),
	        statusCode: {
	            200: function (response) {
	                console.log("200");
	            },
	            400: function (response) {
	                console.log("400");
	            },
	            406: function (response) {
	                console.log("406");
	            }
	        }
    	});

});

