/**
 * Created by Erik on 17. 4. 2017.
 */
//actual page
var actualPage = 1;

//table switch
document.getElementById('gameType').addEventListener('change', function () {
    var style = this.value == "all" ? 'block' : 'none';
    document.getElementById('bothGames').style.display = style
    var style = this.value == "pool8" ? 'block' : 'none';
    document.getElementById('8poolGame').style.display = style
    var style = this.value == "carambole" ? 'block' : 'none';
    document.getElementById('caramboleGame').style.display = style
});

//onload of page show default filtered data
window.onload = myFunc();

//opponents to select box
var endpoint = "/api/players/" + getCookie("myId") + "/opponents";
var sel = document.getElementById('opponent');
var fragment = document.createDocumentFragment();

$.ajax(endpoint, {
    type: "GET",
    contentType: "application/json; charset=utf-8",
    statusCode: {
        200: function (response) {
            setOpp(response);
            response.forEach(function (response, index) {
                var opt = document.createElement('option');
                opt.innerHTML = response.login;
                opt.value = response.id;
                fragment.appendChild(opt);

            });
            sel.appendChild(fragment);

        },
        404: function (response) {
            console.log("404");
        }
    }
});

function setOpp(opponents) {
    $("#opponent").html(opponents.opponent);
    // console.log(opponents);
}

//statistics filtering
    function myFunc() {

        //to clear tables when selecting filters
        $("#caramboleGame tbody").html("");
        $("#bothGames tbody").html("");
        $("#8poolGame tbody").html("");

        var pagesEndpoint = "/api/players/" + getCookie("myId") + "/pages?";
        var endpoint = "/api/players/" + getCookie("myId") + "/statistics?";
        endpoint += "&gameType=" + $("#gameType").val();
        pagesEndpoint += "&gameType=" + $("#gameType").val();
        endpoint += "&result=" + $("#gameStatus").val();
        pagesEndpoint += "&result=" + $("#gameStatus").val();

        //opponent endpoint
        if ($("#opponent").val() == "all") {

        } else {
            endpoint += "&opponent=" + $("#opponent").val();
            pagesEndpoint += "&opponent=" + $("#opponent").val();
        }

        //dateFrom endpoint
        if ($("#dateFrom").val() == "") {

        } else {
            endpoint += "&from=" + $("#dateFrom").val() + "T00:00:00Z%2B0200";
            pagesEndpoint += "&from=" + $("#dateFrom").val() + "T00:00:00Z%2B0200";
        }

        //dateTo endpoint
        if ($("#dateTo").val() == "") {

        } else {
            endpoint += "&to=" + $("#dateTo").val() + "T00:00:00Z%2B0200";
            pagesEndpoint += "&to=" + $("#dateTo").val() + "T00:00:00Z%2B0200";
        }

        endpoint += "&pageSize=20";
        pagesEndpoint += "&pageSize=20";

        getPages(pagesEndpoint);

        endpoint += "&page=" + actualPage;


        $.ajax(endpoint, {
            type: "GET",
            contentType: "application/json; charset=utf-8",
            statusCode: {
                200: function (response) {

                    //carambole games
                    for (var i = 0; i < response.length; i++) {

                        //game beginning date formatting
                        var dateBeginning = response[i].beginning;

                        //changes guest players -1 name to "neznámy"
                        var guestWinnerPlayer = response[i].winnerLogin;
                        var guestOpponentPlayer = response[i].opponentLogin;

                        //time played counting
                        var begTime = response[i].beginning;
                        var endTime = response[i].end;

                        $("#caramboleGame tbody").append($("<tr>" +
                            "<th data-th=\"#\" scope=\"row\">" + response[i].gameNumber + "</th>" +
                            "<td data-th=\"Datum hry\">" + dateCorrectFormat(dateBeginning) + "</td>" +
                            "<td data-th=\"Typ hry\">" + response[i].typeTitle + "</td>" +
                            "<td data-th=\"Protihráč\">" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                            "<td data-th=\"Vítěz\">" + changeGuestWinnerName(guestWinnerPlayer) + "</td>" +
                            "<td data-th=\"Kola\">" + response[i].rounds + "</td>" +
                            "<td data-th=\"Délka hry\">" + playedTime(begTime,endTime) + "</td>" +
                            "<td data-th=\"Moje karamboly\">" + response[i].myCaramboles + "</td>" +
                            "<td data-th=\"Soupeřovy karamboli\">" + response[i].opponentsCaramboles + "</td>" +
                            "<td data-th=\"Moje fauly\">" + response[i].myFouls + "</td>" +
                            "<td data-th=\"Soupeřovy fauly\">" + response[i].opponentsFouls + "</td>" +
                            "<th class=\"karambol\"><a class=\"nav-link\" data-toggle=\"modal\" onclick='getIdOfGame(this)' id_of_game=\"" + response[i].gameId + "\" href=\"#" + response[i].typeTitle + "\">detail\</a></th>" +
                            "</tr>"));
                    }

                    //8pool game
                    for (var i = 0; i < response.length; i++) {

                        //game beginning date formatting
                        var dateBeginning = response[i].beginning;

                        //changes guest players -1 name to "neznámy"
                        var guestWinnerPlayer = response[i].winnerLogin;
                        var guestOpponentPlayer = response[i].opponentLogin;

                        //time played counting
                        var begTime = response[i].beginning;
                        var endTime = response[i].end;

                        $("#8poolGame tbody").append($("<tr>" +
                            "<th data-th=\"#\" scope=\"row\">" + response[i].gameNumber + "</th>" +
                            "<td data-th=\"Datum hry\">" + dateCorrectFormat(dateBeginning) + "</td>" +
                            "<td data-th=\"Typ hry\">" + response[i].typeTitle + "</td>" +
                            "<td data-th=\"Protihráč\">" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                            "<td data-th=\"Vítěz\">" + changeGuestWinnerName(guestWinnerPlayer) + "</td>" +
                            "<td data-th=\"Délka hry\">" + playedTime(begTime,endTime) + "</td>" +
                            "<td data-th=\"OK strk\">" + response[i].correctStrikes + "</td>" +
                            "<td data-th=\"Zly strk\">" + response[i].wrongStrikes + "</td>" +
                            "<td data-th=\"Faul BK\">" + response[i].faulsWithWhite + "</td>" +
                            "<td data-th=\"Faul SK\">" + response[i].faulsWithOthers + "</td>" +
                            "<td data-th=\"Faul jiný\">" + response[i].faulsOther + "</td>" +
                            "<th class=\"eight_pool\"><a class=\"nav-link\" data-toggle=\"modal\" onclick='getIdOfGame(this)' id_of_game=\"" + response[i].gameId + "\" href=\"#" + response[i].typeTitle + "\">detail</a></th>" +
                            "</tr>"));
                    }

                    //both games
                    for (var i = 0; i < response.length; i++) {

                        //game beginning date formatting
                        var dateBeginning = response[i].beginning;

                        //changes guest players -1 name to "neznámy"
                        var guestWinnerPlayer = response[i].winnerLogin;
                        var guestOpponentPlayer = response[i].opponentLogin;

                        //time played counting
                        var begTime = response[i].beginning;
                        var endTime = response[i].end;

                        $("#bothGames tbody").append($("<tr>" +
                            "<th data-th=\"#\" scope=\"row\">" + response[i].gameNumber + "</th>" +
                            "<td data-th=\"Datum hry\">" + dateCorrectFormat(dateBeginning) + "</td>" +
                            "<td data-th=\"Typ hry\">" + response[i].typeTitle + "</td>" +
                            "<td data-th=\"Protihráč\">" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                            "<td data-th=\"Vítěz\">" + changeGuestWinnerName(guestWinnerPlayer) + "</td>" +
                            "<td data-th=\"Délka hry\">" + playedTime(begTime,endTime) + "</td>" +
                            "<th class=\"pool_and_karambol\"><a class=\"nav-link\" data-toggle=\"modal\" onclick='getIdOfGame(this)' id_of_game=\"" + response[i].gameId + "\" href=\"#both-modal\">detail</a></th>" +
                            "</tr>"));
                    }
                },
                400: function (response) {
                    console.log("400 BAD REQUEST");
                },
                404: function (response) {
                    console.log("404 NOT FOUND");
                }
            }
        });
    };


//change guest winner name from -1 to something else
function changeGuestWinnerName(guestWinnerPlayer) {
    if(guestWinnerPlayer == -1) {
        guestWinnerPlayer = "'Host'";
    }
    if(guestWinnerPlayer == null){
        guestWinnerPlayer = "remíza";
    }
    return guestWinnerPlayer
}

//change guest opponent name from -1 to something else or draw
function changeGuestOpponentName(guestOpponentPlayer) {
    if(guestOpponentPlayer == -1) {
        guestOpponentPlayer = "'Host'";
    }
    return guestOpponentPlayer
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

//beginTime - endTime = time player in MS and converted to normal time HH:MM:SS
function playedTime(begTime, endTime) {

    sliceBegg = begTime.slice(0, 19);
    sliceEnd = endTime.slice(0, 19);

    replaceBegg = sliceBegg.replace("T", " ");
    replaceEnd = sliceEnd.replace("T", " ");

    var old_date_obj = new Date(Date.parse(replaceBegg));
    var new_date_obj = new Date(Date.parse(replaceEnd));

    var diffMs = Math.abs(new_date_obj - old_date_obj);
// var diffDays = Math.round(diffMs / 86400000); // days
// var diffHrs = Math.round((diffMs % 86400000) / 3600000); // hours
// var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
// var diffSecs = Math.round(((diffMs % 86400000) % 3600000) / 60000 / 60000); // minutes
// alert("days:"+diffDays+"\nhours:"+diffHrs+"\nminutes:"+diffMins+"\nseconds:"+diffSecs+"\nMSseconds:"+diffMs);
    return msToTime(diffMs);
}

//convert miliSeconds to Time
function msToTime(s) {

    // Pad to 2 or 3 digits, default is 2
    function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    convert = pad(hrs) + ':' + pad(mins) + ':' + pad(secs);

    return convert;
}

//get ID of game when we click on detail
function getIdOfGame(elem) {
    var id_of_game = $(elem).attr("id_of_game");

    $("#both-main-eight tbody").html(""); //to clear data previous session from table
    $("#both-main-carambole tbody").html(""); //to clear data previous session from table
    $("#eight-pool-main tbody").html(""); //to clear data previous session from table
    $("#carambol-main tbody").html(""); //to clear data previous session from table

    //game by id
    var endpoint_single_game = "/api/players/" + getCookie("myId") + "/games/" + id_of_game;
    $.ajax(endpoint_single_game, {
        type: "GET",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            200: function (response) {

                //game beginning date formatting
                var dateBeginning = response.beginning;

                //changes guest players -1 name to "neznámy"
                var guestWinnerPlayer = response.winnerLogin;
                var guestOpponentPlayer = response.opponentLogin;

                //time played counting
                var begTime = response.beginning;
                var endTime = response.end;

                //which table to show
                if (response.typeId == "1") {
                    document.getElementById("both-main-carambole").style.display = "none";
                    document.getElementById("both-main-eight").style.display = "";
                }

                if (response.typeId == "2") {
                    document.getElementById("both-main-carambole").style.display = "";
                    document.getElementById("both-main-eight").style.display = "none";
                }

                    $("#both-main-eight tbody").append($("<tr>" +
                        "<td>" + dateCorrectFormat(dateBeginning) + "</td>" +
                        "<td>" + response.typeTitle + "</td>" +
                        "<td>" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                        "<td>" + changeGuestWinnerName(guestWinnerPlayer) + "</td>" +
                        "<td>" + playedTime(begTime, endTime) + "</td>" +
                        "<td>" + response.correctStrikes + "</td>" +
                        "<td>" + response.wrongStrikes + "</td>" +
                        "<td>" + response.faulsWithWhite + "</td>" +
                        "<td>" + response.faulsWithOthers + "</td>" +
                        "<td>" + response.faulsOther + "</td>" +
                        "</tr>"));

                    $("#both-main-carambole tbody").append($("<tr>" +
                        "<td>" + dateCorrectFormat(dateBeginning) + "</td>" +
                        "<td>" + response.typeTitle + "</td>" +
                        "<td>" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                        "<td>" + changeGuestWinnerName(guestWinnerPlayer) + "</td>" +
                        "<td>" + response.rounds + "</td>" +
                        "<td>" + playedTime(begTime, endTime) + "</td>" +
                        "<td>" + response.myCaramboles + "</td>" +
                        "<td>" + response.opponentsCaramboles + "</td>" +
                        "<td>" + response.myFouls + "</td>" +
                        "<td>" + response.opponentsFouls + "</td>" +
                        "</tr>"));

                //carambole game
                $("#carambol-main tbody").append($("<tr>" +
                    "<td data-th=\"Datum hry\">" + dateCorrectFormat(dateBeginning) + "</td>" +
                    "<td data-th=\"Typ hry\">" + response.typeTitle + "</td>" +
                    "<td data-th=\"Protihráč\">" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                    "<td data-th=\"Vítěz\">" + changeGuestWinnerName(guestWinnerPlayer) + "</td>" +
                    "<td data-th=\"Kola\">" + response.rounds + "</td>" +
                    "<td data-th=\"Délka hry\">" + playedTime(begTime, endTime) + "</td>" +
                    "<td data-th=\"Moje karamboly\">" + response.myCaramboles + "</td>" +
                    "<td data-th=\"Soupeřovy karamboli\">" + response.opponentsCaramboles + "</td>" +
                    "<td data-th=\"Moje fauly\">" + response.myFouls + "</td>" +
                    "<td data-th=\"Soupeřovy fauly\">" + response.opponentsFouls + "</td>" +
                    "</tr>"));

                //8pool game
                $("#eight-pool-main tbody").append($("<tr>" +
                    "<td>" + dateCorrectFormat(dateBeginning) + "</td>" +
                    "<td>" + response.typeTitle + "</td>" +
                    "<td>" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                    "<td>" + changeGuestWinnerName(guestWinnerPlayer) + "</td>" +
                    "<td>" + playedTime(begTime, endTime) + "</td>" +
                    "<td>" + response.correctStrikes + "</td>" +
                    "<td>" + response.wrongStrikes + "</td>" +
                    "<td>" + response.faulsWithWhite + "</td>" +
                    "<td>" + response.faulsWithOthers + "</td>" +
                    "<td>" + response.faulsOther + "</td>" +
                    "</tr>"));
            }
        },
        404: function (response) {
            console.log("404 NOT FOUND");
        }
    });


    $("#both-strikes tbody").html(""); //to clear data previous session from table
    $("#eight-pool-strikes tbody").html(""); //to clear data previous session from table
    $("#carambole-strikes tbody").html(""); //to clear data previous session from table

    //single strikes
    var endpoint_strikes = "/api/games/" + id_of_game + "/strikes";

    $.ajax(endpoint_strikes, {
        type: "GET",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            200: function (response) {

                for (var i = 0; i < response.length; i++) {

                    var guestOpponentPlayer = response[i].playerLogin;

                    //strike id to change name
                    var strikeRename = response[i].strikeTypeId;

                    $("#both-strikes tbody").append($("<tr>" +
                        "<td>" + response[i].round + "</td>" +
                        "<td>" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                        "<td>" + strikeTypeRename(strikeRename) + "</td>" +
                        "</tr>"));
                }

                for (var i = 0; i < response.length; i++) {

                    var guestOpponentPlayer = response[i].playerLogin;

                    //strike id to change name
                    var strikeRename = response[i].strikeTypeId;

                    $("#eight-pool-strikes tbody").append($("<tr>" +
                        "<td>" + response[i].round + "</td>" +
                        "<td>" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                        "<td>" + strikeTypeRename(strikeRename) + "</td>" +
                        "</tr>"));
                }

                for (var i = 0; i < response.length; i++) {

                    var guestOpponentPlayer = response[i].playerLogin;

                    //strike id to change name
                    var strikeRename = response[i].strikeTypeId;

                    $("#carambole-strikes tbody").append($("<tr>" +
                        "<td>" + response[i].round + "</td>" +
                        "<td>" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                        "<td>" + strikeTypeRename(strikeRename) + "</td>" +
                        "</tr>"));
                }
            }
        },
        404: function (response) {
            console.log("404 NOT FOUND");
        }
    });
}

function strikeTypeRename(strikeTypeId) {
    if(strikeTypeId == 1){
        return strikeTypeTitle = "Správny strk";
    }else if(strikeTypeId == 2) {
        return strikeTypeTitle = "Špatný strk";
    }else if(strikeTypeId == 3) {
        return strikeTypeTitle = "Faul s bílou koulí";
    }else if(strikeTypeId == 4) {
        return strikeTypeTitle = "Faul s koulí protiháče";
    }else if(strikeTypeId == 5) {
        return strikeTypeTitle = "Jiný faul";
    }else if(strikeTypeId == 6) {
        return strikeTypeTitle = "Hra ukončená v pořádku - výhra hráče";
    }else if(strikeTypeId == 7) {
        return strikeTypeTitle = "Faul s koulí 8- faul při potápění koule č.8 --> výhra protihráče";
    }else if(strikeTypeId == 8) {
        return strikeTypeTitle = "Faul s koulí 8- potopená příliš brzy --> výhra protihráče";
    }else if(strikeTypeId == 9) {
        return strikeTypeTitle = "Faul s koulí 8- do nehlášené kapsy --> výhra protihráče";
    }else if(strikeTypeId == 10) {
        return strikeTypeTitle = "Faul s koulí 8- vyhozená ze stola --> výhra protihráče";
    }else if(strikeTypeId == 11) {
        return strikeTypeTitle = "Karambol";
    }else if(strikeTypeId == 12) {
        return strikeTypeTitle = "Faul";
    }
}

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

    $("#statsPaginationAll").html(pages);
}

$("#statsPaginationAll").click(function (e) {
    actualPage = Number(e.target.id);
    myFunc();
});