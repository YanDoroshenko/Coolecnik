/**
 * Created by hodek on 13.06.2017.
 */

var actualPage = 1;
var pageSize = 12;
var status = "";
var gameType = "";
var tournamentTitle = "";


getTournaments();

function getTournaments() {
    var endpointTournaments = "/api/players/"+getCookie("myId")+"/statistics/tournaments/basic?";
    var plus = ""
    plus += "pageSize=" + pageSize + "&";
    if(status != "") plus += "result=" + status + "&";
    if(gameType != "") plus += "gameType=" + gameType + "&";
    if(tournamentTitle != "") plus += "title=" + tournamentTitle + "&";

    var endpointTournamentPages = "/api/players/"+getCookie("myId")+"/statistics/tournaments/pages?";
    endpointTournamentPages += plus;
    plus += "page=" + actualPage + "&";

    endpointTournaments += plus;
    console.log(endpointTournaments)


    getPages(endpointTournamentPages);

    $.ajax(endpointTournaments, {
        type: "GET",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            200: function (response) {
                console.log(response);
                listTournaments(response);
            },
            404: function (response) {
                console.log("404");
            }
        }
    });

}


function listTournaments(tournaments) {
    var tournamentsList = $("#tournaments_list");
    tournamentsList.empty();
    tournaments.forEach(function (tournament) {
        //for cycle, for every tournament
        var card = "<div class='card tournament-card col-md-3'>"+
            "<div class='card-block'><a href='tournament.html?id="+tournament.id
            +"'><h4 class='card-title'>";
        card += tournament.title;
        card += "</h4></a><p ><strong>Typ: ";
        card += tournament.gameTypeTitle;
        // card += "</strong></p><p class='card-text'>Pocet karambolu: ";
        // card += tournament.numberOfCarambols;
        card += "</p></div><ul class='list-group list-group-flush'>" +
            "<li class='list-group-item tournament-spec'>Pocet hracu: ";
        card += tournament.playerCount;
        card += "</li><li class='list-group-item tournament-spec'>Odehrane hry: ";
        card += tournament.finished;
        card += "</li><li class='list-group-item tournament-spec'>Zbyva: ";
        card += tournament.unfinished + "</li></ul></div>"

        //every card apend to tournamentList
        tournamentsList.append(card);
    });

}


//filters listener
document.getElementById("status").onchange = function () {
    if(this.value == "all"){
        status = ""
    } else {
        status = this.value;
    }
    console.log("status " + this.value);
    getTournaments();
};

document.getElementById("type").onchange = function () {
    gameType = this.value;
    getTournaments();
    console.log("type " + this.value);
};

document.getElementById("findTitle").onsubmit = function (e) {
    e.preventDefault();
    console.log("looking for: " + e.target.childNodes[1].value);
    tournamentTitle = e.target.childNodes[1].value;
    getTournaments();
};



//pagination
//pages
function getPages(endpoint) {

    $.ajax(endpoint, {
        type: "GET",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            200: function (response) {
                createPagination(response, endpoint);
            },
            404: function (response) {
                console.log("404");
            }
        }
    });
}

function createPagination(number, endpoint) {
    var pages = "<li class=\"page-item\">"+
        "<a class=\"page-link\" href=\"#\" id='1' tabindex=\"-1\">First</a></li>";

    //shows only -2 +2 pages, only +2 when actual is 1
    for (var i = -2; i < 3; i++){
        var num = actualPage+i;
        if(num > number) {break;}
        if(num < 1){continue;}
        pages += "<li class=\"page-item";
        if(num == actualPage) {pages += " active "}
        pages += "\"><a class=\"page-link\" href=\"#\" id='"+num+"'>"+num+"</a></li>";
    }

    pages += "<li class=\"page-item\"> <a class=\"page-link\" href=\"#\" id='"+number+"'>Last</a> </li>";

    $("#tournamentsPagination").html(pages);

}

$("#tournamentsPagination").click(function (e) {
    actualPage = Number(e.target.id);
    //function for get actual page
    getTournaments(actualPage);
});
