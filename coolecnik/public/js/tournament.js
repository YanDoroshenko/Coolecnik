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
            console.log(e.target);
            playGame(e.target.id, games);
        })
    })
}

function playGame(id, games) {
    var game;
    for (var i = 0; i < games.length; i++) {
        if (games[i].id == id) {
            game = games[i];
            break;
        }
    }

    localStorage.setItem("currentGame", null);
    localStorage.setItem("activeGame", true);
    localStorage.setItem("savedGame", null);
    localStorage.setItem("savedGameInfo", null);
    localStorage.setItem("activePlayer", 1);
    localStorage.setItem("gameType", game.gameType);
    localStorage.setItem("savedTime", null);
    localStorage.setItem("savedCounterValues", JSON.stringify({
        "green1": 0,
        "green2": 0,
        "red1": 0,
        "red2": 0
    }));
    var p1 = getPlayerName(game.player1);
    var p2 = getPlayerName(game.player2);
    if (p1 == null) p1 = getCookie("myName");
    else p2 = getCookie("myName");

    localStorage.setItem("players", JSON.stringify([{"id": game.player1, "name": p1}
        , {"id": gane.player2, "name": p2}]));

    if (game.gameType == 2) {
        if (typeof game.rounds == 'undefined') {
            //karambols
            localStorage.setItem("carsTotal", game.carambolesToWin);
            localStorage.setItem("currentRound", game.carambolesToWin);
        } else {
            //rounds
            localStorage.setItem("roundsTotal", game.rounds);
            localStorage.setItem("roundsRemain", 0);
        }
        localStorage.setItem("savedCounterValues", JSON.stringify({
            "green1": 0,
            "green2": 0
        }));

    }


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

                table.sort(function (a, b) {
                    return a.points > b.points;
                });

                var counter = 1
                table.forEach(function (row) {
                    var login = "<a href='friendProfile.html?id=" + row.id + "&nick=" + row.login + "' >" +
                        row.login + "</a>"
                    var toAppend = "<tr><th scope='row'>"+counter+"</th><td>"+login+"</td>" +
                        "<td>"+row.won+"</td><td>"+row.lost+"</td><td>"+row.draws+"</td><td>"+row.points+"</td></tr>";
                    console.log($.parseHTML(toAppend)[0]);
                    tableBody.append($.parseHTML(toAppend)[0]);
                    counter++;
                })
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
            played.append(getGameItem(game.player1, game.player2, game.id));
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
    var name1 = getPlayerName(p1);
    var name2 = getPlayerName(p2);
    var name;
    var p;
    if (name1 == null) {
        name = name2;
        p = p2;
    }
    else {
        name = name1
        p = p1;
    }

    if(typeof won == 'undefined') {

        return "<li class='bg-inverse text-white list-group-item justify-content-between'>"
            + "<div class='col-md-4 d-flex justify-content-around'><a href='#' class='text-white'>" + getCookie("myName") + "</a> : " +
            "<a href='friendProfile.html?id=" + p + "&nick=" + name + "' class='text-white'>" +
            name + "</a></div><button class='btn btn-outline-secondary green-btn col-md-2 col-lg-1' id=" + id + ">" +
            "Hrát</button></li>"

    } else {
        return "<li class='bg-inverse text-white list-group-item justify-content-between'>"
            + "<div class='col-md-4 d-flex justify-content-around'><a href='#' class='text-white'>" + getCookie("myName") + "</a> : " +
            "<a href='friendProfile.html?id=" + p + "&nick=" + name + "' class='text-white'>" +
            name + "</a></div><button class='btn btn-outline-secondary green-btn col-md-2 col-lg-1' id=" + id + ">" +
            "Info</button></li>"
    }

}

function getPlayerName(id) {
    for (var i = 0; i < friends.length; i++) {
        if (friends[i].id == id) return friends[i].login
    }
    return null;
}