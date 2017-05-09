/**
 * Created by Erik on 17. 4. 2017.
 */

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
    console.log(opponents);
}

//statistics filtering
    function myFunc() {

        //to clear tables when selecting filters
        $("#caramboleGame tbody").html("");
        $("#bothGames tbody").html("");
        $("#8poolGame tbody").html("");

        var endpoint = "/api/players/" + getCookie("myId") + "/statistics?";
        endpoint += "&gameType=" + $("#gameType").val();
        endpoint += "&result=" + $("#gameStatus").val();

        //opponent endpoint
        if ($("#opponent").val() == "all") {

        } else {
            endpoint += "&opponent=" + $("#opponent").val();
        }

        //dateFrom endpoint
        if ($("#dateFrom").val() == "") {

        } else {
            endpoint += "&from=" + $("#dateFrom").val() + "T00:00:00Z%2B0200";
        }

        //dateTo endpoint
        if ($("#dateTo").val() == "") {

        } else {
            endpoint += "&to=" + $("#dateTo").val() + "T00:00:00Z%2B0200";
        }

        endpoint += "&page=1";
        endpoint += "&pageSize=20";

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
                            "<th data-th=\"#\" scope=\"row\">" + response[i].gameId + "</th>" +
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
                            "<th class=\"karambol\"><a class=\"nav-link\" data-toggle=\"modal\" onclick='getIdOfGame(this)' id=\"#" + response[i].gameId + "\" href=\"#" + response[i].typeTitle + "\">detail\</a></th>" +
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
                            "<th data-th=\"#\" scope=\"row\">" + response[i].gameId + "</th>" +
                            "<td data-th=\"Datum hry\">" + dateCorrectFormat(dateBeginning) + "</td>" +
                            "<td data-th=\"Typ hry\">" + response[i].typeTitle + "</td>" +
                            "<td data-th=\"Protihráč\">" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                            "<td data-th=\"Vítěz\">" + changeGuestWinnerName(guestWinnerPlayer) + "</td>" +
                            "<td data-th=\"Délka hry\">" + playedTime(begTime,endTime) + "</td>" +
                            "<td data-th=\"OK strk\">" + response[i].correctStrikes + "</td>" +
                            "<td data-th=\"Zly strk\">" + response[i].wrongStrikes + "</td>" +
                            "<td data-th=\"Faul BK\">" + response[i].faulsWithWhite + "</td>" +
                            "<td data-th=\"Faul SK\">" + response[i].faulsWithOthers + "</td>" +
                            "<td data-th=\"Faul iný\">" + response[i].faulsOther + "</td>" +
                            "<th class=\"eight_pool\"><a class=\"nav-link\" data-toggle=\"modal\" onclick='getIdOfGame(this)' id=\"#" + response[i].gameId + "\" href=\"#" + response[i].typeTitle + "\">detail</a></th>" +
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
                            "<th data-th=\"#\" scope=\"row\">" + response[i].gameId + "</th>" +
                            "<td data-th=\"Datum hry\">" + dateCorrectFormat(dateBeginning) + "</td>" +
                            "<td data-th=\"Typ hry\">" + response[i].typeTitle + "</td>" +
                            "<td data-th=\"Protihráč\">" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                            "<td data-th=\"Vítěz\">" + changeGuestWinnerName(guestWinnerPlayer) + "</td>" +
                            "<td data-th=\"Délka hry\">" + playedTime(begTime,endTime) + "</td>" +
                            "<th class=\"pool_and_karambol\"><a class=\"nav-link\" data-toggle=\"modal\" onclick='getIdOfGame(this)' id_of_game=\"" + response[i].gameId + "\" href=\"#both-modal\">detail</a></th>" +
                            // "<td class=\"pool_and_karambol\"><a class=\"nav-link\" data-toggle=\"modal\" onclick='getIdOfGame(this)' id=\"#" + response[i].gameId + "\" href=\"#" + response[i].typeTitle + "\">detail</a></td>" +
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
        guestWinnerPlayer = "neznámy";
    }
    if(guestWinnerPlayer == null){
        guestWinnerPlayer = "remíza";
    }
    return guestWinnerPlayer
}

//change guest opponent name from -1 to something else or draw
function changeGuestOpponentName(guestOpponentPlayer) {
    if(guestOpponentPlayer == -1) {
        guestOpponentPlayer = "neznámy";
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
    console.log(id_of_game);
}

//insert table row into modal bothGames
$("#bothGames").on('click', '.nav-link', function () {
    var $row = $(this).closest("tr");    // Find the row
    var $tds = $row.find("td" );
    $("#both-main tbody").html(""); //to clear data previous session from table
    $.each($tds, function () {

        $("#both-main tbody").append($(
            "<td>" + $(this).text() + "</td>"
        ));
    });
});

//insert table row into modal 8POOL
$("#8poolGame").on('click', '.nav-link', function () {
    var $row = $(this).closest("tr");    // Find the row
    var $tds = $row.find("td");
    $("#eight-pool-main tbody").html(""); //to clear data previous session from table
    $.each($tds, function () {

        $("#eight-pool-main tbody").append($(
            "<td>" + $(this).text() + "</td>"
        ));
    });
});

//insert table row into modal KARAMBOL
$("#caramboleGame").on('click', '.nav-link', function () {
    var $row = $(this).closest("tr");    // Find the row
    var $tds = $row.find("td");
    $("#carambol-main tbody").html(""); //to clear data previous session from table
    $.each($tds, function () {

        $("#carambol-main tbody").append($(
            "<td>" + $(this).text() + "</td>"
        ));
    });
});


// var endpoint = "/api/games/" + $("#id").id  + "/strikes";
var endpoint = "/api/games/388/strikes";
//todo modal strikes ID

$("#both-strikes tbody").html(""); //to clear data previous session from table
$("#eight-pool-strikes tbody").html(""); //to clear data previous session from table
$("#both-strikes tbody").html(""); //to clear data previous session from table

$.ajax(endpoint, {
    type: "GET",
    contentType: "application/json; charset=utf-8",
    statusCode: {
        200: function (response) {

                for (var i = 0; i < response.length; i++) {

                    var guestOpponentPlayer = response[i].playerLogin;

                    $("#both-strikes tbody").append($("<tr>" +
                        "<td>" + response[i].round + "</td>" +
                        "<td>" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                        "<td>" + response[i].strikeTypeTitle + "</td>" +
                        "</tr>"));
                }

            for (var i = 0; i < response.length; i++) {

                var guestOpponentPlayer = response[i].playerLogin;

                $("#eight-pool-strikes tbody").append($("<tr>" +
                    "<td>" + response[i].round + "</td>" +
                    "<td>" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                    "<td>" + response[i].strikeTypeTitle + "</td>" +
                    "</tr>"));
            }

                for (var i = 0; i < response.length; i++) {

                    var guestOpponentPlayer = response[i].playerLogin;

                    $("#carambole-strikes tbody").append($("<tr>" +
                        "<td>" + response[i].round + "</td>" +
                        "<td>" + changeGuestOpponentName(guestOpponentPlayer) + "</td>" +
                        "<td>" + response[i].strikeTypeTitle + "</td>" +
                        "</tr>"));
                }
            console.log(response);
        }
        },
        404: function (response) {
            console.log("404 NOT FOUND");
        }
});