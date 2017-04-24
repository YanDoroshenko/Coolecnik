String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

// timer for HTML timer - starts from 0
function countTimer() {
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

// generate hash for pass
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

function setActivePlayerOnScreen() {
    var aab = 0;
    if (activePlayer === 1) {
        document.getElementById("player1").className = "active-player";
        document.getElementById("player2").className = "";
    }
    else {
        document.getElementById("player1").className = "";
        document.getElementById("player2").className = "active-player";
    }
}

function sendStrikes() {
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
}

function sendGameEnd() {
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

function saveGameEnd() {
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
        "winner": (activePlayer === 1) ? players[0].id : players[1].id,
        "round": round
    };
    localStorage.setItem("savedGameInfo", JSON.stringify(obj));
    localStorage.setItem("activeGame", "false");

    isSecondPlayerAuthorized = false;
    $("#pl0").val("");
}