/**
 * Created by hodek on 15.06.2017.
 */
var GET = {};
var query = window.location.search.substring(1).split("&");
for (var i = 0, max = query.length; i < max; i++)
{
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

var endpointTournament = "/api/tournaments/"+GET.id+"/details";
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
    var endpointFriends = "/api/players/"+getCookie("myId")+"/friends";
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
var gameType= "";

function renderTournament(tournament) {

    if(tournament.gameType == 1) {gameType = "<small>8-pool</small>"}
    else {gameType = "<small>karambol</small>"}
    $("#tournamentHeading")[0].innerHTML = "<h2 class='h2'>"+tournament.title+"</h2>" +  gameType +
    "<p>"+dateCorrectFormat(tournament.beginning)+"</p>";
    console.log(friends);
    renderAll(tournament.games);
    renderUnplayed(tournament.games);
    renderPlayed(tournament.games)

}

function renderUnplayed(games) {
    games.forEach(function (game) {
        if(typeof game.end == 'undefined'){
            unplayed.append(getGameItem(game.player1, game.player2, game.id));
        }
    })
    if(unplayed.html() == ""){
        unplayed.innerHTML("Žádné neodehrané hry!");
    }
}

function renderPlayed(games) {
    games.forEach(function (game) {
        if(typeof game.end != 'undefined'){
            played.append(getGameItem(game.player1, game.player2, game.id));
        }
    })
    if(played.html() == ""){
        played.html("Žádné odehrané hry!");
    }
}

function renderAll(games) {
    games.forEach(function (game) {
        all.append(getGameItem(game.player1, game.player2, game.id))
    })
}

function getGameItem(p1, p2, id) {
    var name1 = getPlayerName(p1);
    var name2 = getPlayerName(p2);
    var name;
    var p;
    if(name1 == null) {
        name = name2;
        p = p2;
    }
    else {
        name = name1
        p = p1;
    }

    return "<li class='bg-inverse text-white list-group-item justify-content-between'>"
    +"<div class='col-md-4 d-flex justify-content-around'><a href='#' class='text-white'>"+ getCookie("myName") +"</a> : " +
        "<a href='friendProfile.html?id="+p+"&nick="+ name +"' class='text-white'>"+
       name + "</a></div><button class='btn btn-outline-secondary green-btn col-md-2 col-lg-1' id="+ id +">" +
        "Hrát</button></li>"

}

function getPlayerName(id){
    for(var i= 0; i < friends.length; i++){
        if(friends[i].id == id) return friends[i].login
    }
    return null;
}