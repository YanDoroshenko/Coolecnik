/**
 * Created by Erik on 17. 4. 2017.
 */

var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
if (new Date().getTimezoneOffset() / 60 < 10 && new Date().getTimezoneOffset() / 60 > -10)
    dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";

//table switch
document.getElementById('gameType').addEventListener('change', function () {
    var style = this.value == "all" ? 'block' : 'none';
    document.getElementById('bothGames').style.display = style
    var style = this.value == "pool8" ? 'block' : 'none';
    document.getElementById('8poolGame').style.display = style
    var style = this.value == "carambole" ? 'block' : 'none';
    document.getElementById('caramboleGame').style.display = style

});


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
                opt.value = response;
                fragment.appendChild(opt);

                console.log(opt);
            });
            sel.appendChild(fragment);

            console.log(sel);
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

// $(document).ready(function () {
//     $('#gameType').val("pool8");
// });

//statistics filtering
function myFunc() {

    //to clear tables when selecting filters
    $("#caramboleGame tbody").html("");
    $("#bothGames tbody").html("");
    $("#8poolGame tbody").html("");

// var endpoint = "/api/players/" + getCookie("myId") + "/statistics?gameType=pool8&opponent=60&page=2&pageSize=1";
// var endpoint = "/api/players/" + getCookie("myId") + "/statistics?&result=" + $("#gameStatus").val()+"&opponent="+ $("#opponents").id + "&page=1&pageSize=15";
    var endpoint = "/api/players/" + getCookie("myId") + "/statistics?";
    endpoint += "&gameType=" + $("#gameType").val();
    endpoint += "&result=" + $("#gameStatus").val();
    // endpoint += "&opponent=" + $("#opponent").attr('id');
// endpoint += "&from=" + dateFrom;
// endpoint += "&to=" + dateTo;
    endpoint += "&page=1";
    endpoint += "&pageSize=20";


    $.ajax(endpoint, {
        type: "GET",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            200: function (response) {

                for (var i = 0; i < response.length; i++) {
                    //date of game formation
                    var gameBeg = response[i].beginning;
                    sliceBeg = gameBeg.slice(0,10);
                    replaceBeg = sliceBeg.replace("-", ".");
                    index = 7;
                    replaceBeg2 = replaceBeg.substr(0, index) + '.' + replaceBeg.substr(index + 1);
                    beginTime = replaceBeg2.split(/([^\d])/).reverse().join('');

                    //time played
                    var begTime = response[i].beginning;
                    var endTime = response[i].end;

                    sliceBegg = begTime.slice(0,19);
                    sliceEnd = endTime.slice(0,19);

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


                    $("#caramboleGame tbody").append($("<tr>" +
                        "<th data-th=\"#\" scope=\"row\">" + response[i].gameId + "</th>" +
                        "<td data-th=\"Datum hry\">" + beginTime + "</td>" +
                        "<td data-th=\"Typ hry\">" + response[i].typeTitle + "</td>" +
                        "<td data-th=\"Protihráč\">" + response[i].opponentLogin + "</td>" +
                        "<td data-th=\"Vítěz\">" + response[i].winnerLogin + "</td>" +
                        "<td data-th=\"Kola\">" + response[i].rounds + "</td>" +
                        "<td data-th=\"Délka hry\">" + msToTime(diffMs) + "</td>" +
                        "<td data-th=\"Moje karamboly\">" + response[i].myCaramboles + "</td>" +
                        "<td data-th=\"Soupeřovy karamboli\">" + response[i].opponentsCaramboles + "</td>" +
                        "<td data-th=\"Moje fauly\">" + response[i].myFouls + "</td>" +
                        "<td data-th=\"Soupeřovy fauly\">" + response[i].opponentsFouls + "</td>" +
                        "<td class=\"karambol\"><a class=\"nav-link\" data-toggle=\"modal\" onclick='getIdOfGame(this)' id=\"#" + response[i].gameId + "\" href=\"#" + response[i].typeTitle + "\">detail\</a></td>" +
                        "</tr>"));
                }

                for (var i = 0; i < response.length; i++) {
                    //date of game formation
                    var gameBeg = response[i].beginning;
                    sliceBeg = gameBeg.slice(0,10);
                    replaceBeg = sliceBeg.replace("-", ".");
                    index = 7;
                    replaceBeg2 = replaceBeg.substr(0, index) + '.' + replaceBeg.substr(index + 1);
                    beginTime = replaceBeg2.split(/([^\d])/).reverse().join('');

                    //time played
                    var begTime = response[i].beginning;
                    var endTime = response[i].end;

                    sliceBegg = begTime.slice(0,19);
                    sliceEnd = endTime.slice(0,19);

                    replaceBegg = sliceBegg.replace("T", " ");
                    replaceEnd = sliceEnd.replace("T", " ");

                    var old_date_obj = new Date(Date.parse(replaceBegg));
                    var new_date_obj = new Date(Date.parse(replaceEnd));

                    var diffMs = Math.abs(new_date_obj - old_date_obj);

                    $("#8poolGame tbody").append($("<tr>" +
                        "<th data-th=\"#\" scope=\"row\">" + response[i].gameId + "</th>" +
                        "<td data-th=\"Datum hry\">" + beginTime + "</td>" +
                        "<td data-th=\"Typ hry\">" + response[i].typeTitle + "</td>" +
                        "<td data-th=\"Protihráč\">" + response[i].opponentLogin + "</td>" +
                        "<td data-th=\"Vítěz\">" + response[i].winnerLogin + "</td>" +
                        "<td data-th=\"Délka hry\">" + msToTime(diffMs) + "</td>" +
                        "<td data-th=\"OK strk\">" + response[i].correctStrikes + "</td>" +
                        "<td data-th=\"Zly strk\">" + response[i].wrongStrikes + "</td>" +
                        "<td data-th=\"Faul BK\">" + response[i].faulsWithWhite + "</td>" +
                        "<td data-th=\"Faul SK\">" + response[i].faulsWithOthers + "</td>" +
                        "<td data-th=\"Faul iný\">" + response[i].faulsOther + "</td>" +
                        "<td class=\"eight_pool\"><a class=\"nav-link\" data-toggle=\"modal\" onclick='getIdOfGame(this)' id=\"#" + response[i].gameId + "\" href=\"#" + response[i].typeTitle + "\">detail</a></td>" +
                        "</tr>"));
                }

                for (var i = 0; i < response.length; i++) {
                    //date of game formation
                    var gameBeg = response[i].beginning;
                    sliceBeg = gameBeg.slice(0,10);
                    replaceBeg = sliceBeg.replace("-", ".");
                    index = 7;
                    replaceBeg2 = replaceBeg.substr(0, index) + '.' + replaceBeg.substr(index + 1);
                    beginTime = replaceBeg2.split(/([^\d])/).reverse().join('');

                    //time played
                    var begTime = response[i].beginning;
                    var endTime = response[i].end;

                    sliceBegg = begTime.slice(0,19);
                    sliceEnd = endTime.slice(0,19);

                    replaceBegg = sliceBegg.replace("T", " ");
                    replaceEnd = sliceEnd.replace("T", " ");

                    var old_date_obj = new Date(Date.parse(replaceBegg));
                    var new_date_obj = new Date(Date.parse(replaceEnd));

                    var diffMs = Math.abs(new_date_obj - old_date_obj);

                    $("#bothGames tbody").append($("<tr>" +
                        "<th data-th=\"#\" scope=\"row\">" + response[i].gameId + "</th>" +
                        "<td data-th=\"Datum hry\">" + beginTime + "</td>" +
                        "<td data-th=\"Typ hry\">" + response[i].typeTitle + "</td>" +
                        "<td data-th=\"Protihráč\">" + response[i].opponentLogin + "</td>" +
                        "<td data-th=\"Vítěz\">" + response[i].winnerLogin + "</td>" +
                        "<td data-th=\"Délka hry\">" + msToTime(diffMs) + "</td>" +
                        "<td class=\"pool_and_karambol\"><a class=\"nav-link\" data-toggle=\"modal\" onclick='getIdOfGame(this)' id=\"#" + response[i].gameId + "\" href=\"#" + response[i].typeTitle + "\">detail</a></td>" +
                        // "<td class=\"pool_and_karambol\"><button type=\"button\" class=\"use-address\">Use</button><a class=\"nav-link\" data-toggle=\"modal\" onclick='getIdOfGame(this)' id=\"#" + response[i].gameId + "\" href=\"#" + response[i].typeTitle + "\">detail</a></td>" +
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
    var id = $(elem).attr("id");
    alert(id);
}


// $(".use-address").click(function() {
//     var $row = $(this).closest("tr");    // Find the row
//     var $tds = $row.find("td");
//     $.each($tds, function() {
//         console.log($(this).text());
//     });
//
// });

//should write data between TR's  --> could be useful in modal
// $(".use-address").click(function() {
//     var $row = $(this).closest("tr"),       // Finds the closest row <tr>
//         $tds = $row.find("td");             // Finds all children <td> elements
//
//     $.each($tds, function() {               // Visits every single <td> element
//         console.log($(this).text());        // Prints out the text within the <td>
    // });
    // $(this).closest('tr').find('td').each(function() {
    //     var textval = $(this).text(); // this will be the text of each <td>
    //     alert(textval);
    // });
// });