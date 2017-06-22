/**
 * Created by hodek on 15.06.2017.
 */
var GET = {};
var query = window.location.search.substring(1).split("&");
for (var i = 0, max = query.length; i < max; i++) {
    if (query[i] === "") // check for trailing & with no param
        continue;

    var param = query[i].split("=");
    GET[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
}

//date of game beginning formatting
function dateCorrectFormat(gameBeg) {
    sliceBeg = gameBeg.slice(0, 10);
    replaceBeg = sliceBeg.replace("-", ".");
    index = 7;
    replaceBeg2 = replaceBeg.substr(0, index) + '.' + replaceBeg.substr(index + 1);
    beginTime = replaceBeg2.split(/([^\d])/).reverse().join('');

    return beginTime;
}

var endpointTournament = "/api/tournaments/" + GET.id + "/details";
var endpointTournamentTable = "/api/tournaments/" + GET.id + "/table";
var friends = [];
console.log(GET.id);


$.ajax(endpointTournament, {
    type: "GET",
    contentType: "application/json; charset=utf-8",
    statusCode: {
        200: function (response) {
            console.log(response);
            getFriends(response);

        },
        404: function (response) {
            console.log("404");
        }
    }
});

function getFriends(games) {
    var endpointFriends = "/api/players/" + getCookie("myId") + "/friends";
    $.ajax(endpointFriends, {
        type: "GET",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            200: function (response) {
                friends = response;
                renderTournament(games);
                console.log(friends)
            },
            404: function (response) {
                console.log("404");
            }
        }
    });
}

var unplayed = $("#unplayed");
var played = $("#played");
var all = $("#all");
var table = $("#table");
var gameType = "";
var carambolType;
var carambolTypeText;

function renderTournament(tournament) {

    if (tournament.gameType == 1) {
        gameType = "<small>8-pool</small>"
    }
    else {
        gameType = "<small>karambol</small>";
        if (typeof tournament.rounds == 'undefined') {
            carambolTypeText = "<small> - na karamboly</small>";
            carambolType = 2;
        } else {
            carambolTypeText = "<small> - na kola</small>";
            carambolType = 1;
        }
    }
    $("#tournamentHeading")[0].innerHTML = "<h2 class='h2'>" + tournament.title + "</h2>" + gameType
        + carambolTypeText + "<p>" + dateCorrectFormat(tournament.beginning) + "</p>";
    console.log(friends);
    renderTable();
    renderAll(tournament.games);
    renderUnplayed(tournament.games);
    renderPlayed(tournament.games)

    addButtonListeners(tournament.games);

}

function addButtonListeners(games) {
    $("#tournamentStats")[0].querySelectorAll("button").forEach(function (butt) {
        butt.addEventListener("click", function (e) {
            console.log(e.target.innerText);
            if (e.target.innerText == "Info") {
                showInfo(e.target.id)
            } else {
                playGame(e.target.id, games);
            }
        })
    })
}

function showInfo(id) {

}

function playGame(id, games) {
    var game;
    for (var i = 0; i < games.length; i++) {
        if (games[i].id == id) {
            game = games[i];
            break;
        }
    }
    localStorage.setItem("tournamentGame", true);
    localStorage.setItem("gameId", game.id);

    localStorage.setItem("gameType", game.gameType);
    localStorage.setItem("savedTime", JSON.stringify({"m": 0, "s": 1}));


    var p1 = getPlayerName(game.player1);
    var p2 = getPlayerName(game.player2);
    if (p1 == null) {
        p1 = getCookie("myName");
        localStorage.setItem("secondPlayerId", game.player2);
        localStorage.setItem("secondPlayerName", p2);
    }
    else if (p2 == null) {
        p2 = getCookie("myName");
        localStorage.setItem("secondPlayerId", game.player1);
        localStorage.setItem("secondPlayerName", p1);
    }

    localStorage.setItem("players", JSON.stringify([
        {"id": game.player1, "name": p1},
        {"id": game.player2, "name": p2}]));

    if (game.gameType == 2) {
        if (typeof game.rounds == 'undefined') {
            //karambols
            localStorage.setItem("carType", 1);
            localStorage.setItem("carsTotal", game.carambolesToWin);
            localStorage.setItem("currentRound", game.carambolesToWin);
        } else {
            //rounds
            localStorage.setItem("carType", 2);
            localStorage.setItem("roundsTotal", game.rounds);
            localStorage.setItem("roundsRemain", 0);
        }
    }

    var endpoint = "/api/games/" + parseInt(localStorage.getItem("gameId")) + "/start";
    var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
    if (new Date().getTimezoneOffset() / 60 < 10 && new Date().getTimezoneOffset() / 60 > -10)
        dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";
    if (dateTime[20] === "0") {
        dateTime = dateTime.replaceAt(20, "+");
        console.log("new dateTime ", dateTime);
    }
    var obj = {
        "startTime": dateTime,
    };
    $.ajax(endpoint, {
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        statusCode: {
            200: function (response) {
                console.log("200 OK");
                window.location.href = 'game.html';
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

function renderTable(id) {
    var tableBody = $("#tournamentTable")[0].querySelector("tbody");
    console.log(tableBody);
    $.ajax(endpointTournamentTable, {
        type: "GET",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            200: function (response) {
                console.log(response);
                var table = response.table;

                var counter = 1;
                for (var i = 0; i < table.length; i++) {
                    var login = "<a href='friendProfile.html?id=" + table[i].id + "&nick=" + table[i].login + "' >" +
                        table[i].login + "</a>";
                    var toAppend = "<tr><th scope='row'>" + counter + "</th><td>" + login + "</td>" +
                        "<td>" + table[i].won + "</td><td>" + table[i].lost + "</td><td>" + table[i].draws + "</td><td>" + table[i].points + "</td></tr>";
                    console.log($.parseHTML(toAppend)[0]);
                    tableBody.append($.parseHTML(toAppend)[0]);
                    counter++;
                }
            },
            404: function (response) {
                console.log("404");
            }
        }
    });
}

function renderUnplayed(games) {
    games.forEach(function (game) {
        if (typeof game.end == 'undefined') {
            unplayed.append(getGameItem(game.player1, game.player2, game.id));
        }
    });
    if (unplayed.html() == "") {
        unplayed.innerHTML("Žádné neodehrané hry!");
    }
}

function renderPlayed(games) {
    games.forEach(function (game) {
        if (typeof game.end != 'undefined') {
            played.append(getGameItem(game.player1, game.player2, game.id, game.end));
        }
    });
    if (played.html() == "") {
        played.html("Žádné odehrané hry!");
    }
}

function renderAll(games) {
    games.forEach(function (game) {
        all.append(getGameItem(game.player1, game.player2, game.id, game.end))
    })
}

function getGameItem(p1, p2, id, won) {
    var id1 = p1;
    var id2 = p2;
    var name1 = getPlayerName(id1);
    var name2 = getPlayerName(id2);

    if (name1 == null) {
        name1 = getCookie("myName");
        id1 = -1;
    }
    else if (name2 == null) {
        name2 = getCookie("myName");
        id2 = -1
    }

    var first;
    var second;
    var button;

    if (typeof won == 'undefined') {

        if (id1 == -1) {
            first = "<a href='#' class='text-white'>" + name1 + "</a>";
            second = "<a href='friendProfile.html?id=" + id2 + "&nick=" + name2 + "' class='text-white'>" + name2 + "</a>";
            button = "<button class='btn btn-outline-secondary green-btn col-md-2 col-lg-1' id=" + id + ">" + "Hrát</button>";
        } else if (id2 == -1) {
            first = "<a href='#' class='text-white'>" + name2 + "</a>";
            second = "<a href='friendProfile.html?id=" + id1 + "&nick=" + name1 + "' class='text-white'>" + name1 + "</a>";
            button = "<button class='btn btn-outline-secondary green-btn col-md-2 col-lg-1' id=" + id + ">" + "Hrát</button>";
        } else {
            first = "<a href='friendProfile.html?id=" + id1 + "&nick=" + name1 + "' class='text-white'>" + name1 + "</a>";
            second = "<a href='friendProfile.html?id=" + id2 + "&nick=" + name2 + "' class='text-white'>" + name2 + "</a>";
            button = "";
        }

        return "<li class='bg-inverse text-white list-group-item justify-content-between'>"
            + "<div class='col-md-4 d-flex justify-content-around'>" + first + " : " + second
            + "</div>" + button + "</li>"

    } else {
        var myId = getCookie("myId");

        if (id1 == -1) {
            if (won == id2) {
                first = "<a href='#' class='text-white'>" + name1 + "</a>";
                second = "<a href='friendProfile.html?id=" + id2 + "&nick=" + name2 + "' class='text-capitalize' style='color: gold'>" + name2 + "</a>";
            } else if (won == myId) {
                first = "<a href='#' class='text-capitalize' style='color: gold'>" + name1 + "</a>";
                second = "<a href='friendProfile.html?id=" + id2 + "&nick=" + name2 + "' class='text-white'>" + name2 + "</a>";
            } else {
                first = "<a href='#' class='text-capitalize' style='color: gold'>" + name1 + "</a>";
                second = "<a href='friendProfile.html?id=" + id2 + "&nick=" + name2 + "' class='text-capitalize' style='color: gold'>" + name2 + "</a>";
            }
            button = "<button class='btn btn-outline-secondary green-btn col-md-2 col-lg-1' id=" + id + ">" + "Info</button>";
        } else if (id2 == -1) {
            if (won == id2) {
                first = "<a href='#' class='text-white'>" + name2 + "</a>";
                second = "<a href='friendProfile.html?id=" + id1 + "&nick=" + name1 + "' class='text-capitalize' style='color: gold'>" + name1 + "</a>";
            } else if (won == myId) {
                first = "<a href='#' class='text-capitalize' style='color: gold'>" + name2 + "</a>";
                second = "<a href='friendProfile.html?id=" + id1 + "&nick=" + name1 + "' class='text-white'>" + name1 + "</a>";
            } else {
                first = "<a href='#' class='text-capitalize' style='color: gold'>" + name2 + "</a>";
                second = "<a href='friendProfile.html?id=" + id1 + "&nick=" + name1 + "' class='text-capitalize' style='color: gold'>" + name1 + "</a>";
            }
            button = "<button class='btn btn-outline-secondary green-btn col-md-2 col-lg-1' id=" + id + ">" + "Info</button>";

        } else {
            if (won == id2) {
                first = "<a href='friendProfile.html?id=" + id1 + "&nick=" + name1 + "' class='text-white'>" + name1 + "</a>";
                second = "<a href='friendProfile.html?id=" + id2 + "&nick=" + name2 + "' class='text-capitalize' style='color: gold'>" + name2 + "</a>";
            } else if (won == myId) {
                first = "<a href='friendProfile.html?id=" + id1 + "&nick=" + name1 + "' class='text-capitalize' style='color: gold'>" + name1 + "</a>";
                second = "<a href='friendProfile.html?id=" + id2 + "&nick=" + name2 + "' class='text-white'>" + name2 + "</a>";
            } else {
                first = "<a href='friendProfile.html?id=" + id1 + "&nick=" + name1 + "' class='text-capitalize' style='color: gold'>" + name1 + "</a>";
                second = "<a href='friendProfile.html?id=" + id2 + "&nick=" + name2 + "' class='text-capitalize' style='color: gold'>" + name2 + "</a>";
            }
            button = "<button class='btn btn-outline-secondary green-btn col-md-2 col-lg-1' id=" + id + ">" + "Info</button>";

        }

        return "<li class='bg-inverse text-white list-group-item justify-content-between'>"
            + "<div class='col-md-4 d-flex justify-content-around'>" + first + " : " + second
            + "</div>" + button + "</li>"
    }

}

function getPlayerName(id) {
    for (var i = 0; i < friends.length; i++) {
        if (friends[i].id == id) return friends[i].login
    }
    return null;
}