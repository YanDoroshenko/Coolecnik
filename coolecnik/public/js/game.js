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

document.getElementById("authPlayer2").addEventListener("click", function (event) {
    event.preventDefault();
    var passField = "<input id='pass' type='password' placeholder='Heslo protihráče' class='form-control' style='width: 70.7%; display: inline;'>";
    var authKey = "<button class='icon-key' id='authBtn' style='width: 42px; height: 32px; padding-top: 3%; margin-left: 2%'></button>";
    var thrashKey = "<button class='icon-thrash' id='thrashBtn' style='width: 42px; height: 32px; padding-top: 3%; margin-left: 2%'></button>";
    $("#authPlayer2").after(passField + authKey + thrashKey);


    document.getElementById("authBtn").addEventListener("click", function (event) {
    	event.preventDefault();
    	document.getElementById("authBtn").className = "icon-load";

    	var obj = {
	        "login": $('#pl0').val(),
	        "passwordHash": hash($('#pass').val(), true, $('#pass').val().length).toString()
    	};

    	//TODO bad pictures of OK and NOOK
    	$.ajax("api/login", {
	        type: "POST",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(obj),
	        statusCode: {
	            202: function (response) {
	                console.log("202 ACCEPTED");
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
    	$("#pass").remove();
    	$("#authBtn").remove();
    	$("#thrashBtn").remove();
    	isSecondPlayerAuthorized = false;
    	document.getElementById("authBtn").className = "icon-key";
    });

});


document.getElementById("newGameBtn").addEventListener("click", function (event) {
	event.preventDefault();
	$("#newGameSpan").val = "";
	if ($("#pl0").val == 0){
		$("#newGameSpan").val = "Jméno musí být neprazdné";
		return;
	}

	if (document.getElementById('gameType').checked)
		var gameType = 2; //karambol
	else
		var gameType = 1; //pool

	var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset()/60 + "00";
	if (new Date().getTimezoneOffset()/60 < 10 && new Date().getTimezoneOffset()/60 > -10)
		dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";

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
	                $("#newGameDiv").css("display", "none");
	                if (gameType == 1){
	                	$("#poolControlDiv").css("display", "block");
	                }
	                else {
	                	$("#karambolControlDiv").css("display", "block");
	                }
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