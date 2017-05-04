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
            response.forEach(function(response, index) {
                var opt = document.createElement('option');
                opt.innerHTML = response.login;
                opt.value = response;
                fragment.appendChild(opt);
            });
            sel.appendChild(fragment);

            console.log(response);

        },
        404: function (response) {
            console.log("404");
        }
    }
});

function setOpp(opponents) {
    $("#opponent").html(opponents.playersStatistics);
}



//statistics filtering
function myFunc() {
    // var x = document.getElementById("gameStatus").value;


// var endpoint = "/api/players/" + getCookie("myId") + "/statistics?gameType=pool8&opponent=60&page=2&pageSize=1";
// var endpoint = "/api/players/" + getCookie("myId") + "/statistics?&result=" + $("#gameStatus").val()+"&opponent="+ $("#opponents").id + "&page=1&pageSize=15";
    var endpoint = "/api/players/" + getCookie("myId") + "/statistics?";
    endpoint += "&gameType=" + $("#gameType").val();
    endpoint += "&result=" + $("#gameStatus").val();
    // endpoint += "&opponent=" + $("#opponent").id;
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
                    $("#caramboleGame tbody").append($("<tr>" +
                        "<th data-th=\"#\" scope=\"row\">" + response[i].gameId + "</th>" +
                        "<td data-th=\"Datum hry\">" + response[i].beginning + "</td>" +
                        "<td data-th=\"Typ hry\">" + response[i].gameType + "</td>" +
                        "<td data-th=\"Protihráč\">" + response[i].opponent + "</td>" +
                        "<td data-th=\"Vítěz\">" + response[i].winner + "</td>" +
                        "<td data-th=\"Kola\">" + response[i].rounds + "</td>" +
                        "<td data-th=\"Délka hry\">" + response[i].end + "</td>" +
                        "<td data-th=\"Moje karamboly\">" + response[i].myCaramboles + "</td>" +
                        "<td data-th=\"Soupeřovy karamboli\">" + response[i].opponentsCaramboles + "</td>" +
                        "<td data-th=\"Moje fauly\">" + response[i].myFouls + "</td>" +
                        "<td data-th=\"Soupeřovy fauly\">" + response[i].opponentsFouls + "</td>" +
                        "<td class=\"karambol\"><a class=\"nav-link\" data-toggle=\"modal\" href=\"#" + response[i].gameType+ "\">detail\</a></td>"+
                        "</tr>"));
                }


                for (var i = 0; i < response.length; i++) {
                    $("#8poolGame tbody").append($("<tr>" +
                        "<th data-th=\"#\" scope=\"row\">" + response[i].gameId +"</th>" +
                        "<td data-th=\"Datum hry\">" + response[i].beginning + "</td>" +
                        "<td data-th=\"Typ hry\">" + response[i].gameType + "</td>" +
                        "<td data-th=\"Protihráč\">" + response[i].opponent + "</td>" +
                        "<td data-th=\"Vítěz\">" + response[i].winner + "</td>" +
                        "<td data-th=\"Délka hry\">" + response[i].end + "</td>" +
                        "<td data-th=\"OK strk\">" + response[i].correctStrikes + "</td>" +
                        "<td data-th=\"Zly strk\">" + response[i].wrongStrikes + "</td>" +
                        "<td data-th=\"Faul BK\">" + response[i].faulsWithWhite + "</td>" +
                        "<td data-th=\"Faul SK\">" + response[i].faulsWithOthers + "</td>" +
                        "<td data-th=\"Faul iný\">" + response[i].faulsOther + "</td>" +
                        "<td id=\"modal_8pool\" class=\"eight_pool\"><a class=\"nav-link\" data-toggle=\"modal\" href=\"#" + response[i].gameType+ "\">detail</a></td>"+
                        "</tr>"));
                }


                for (var i = 0; i < response.length; i++) {
                    $("#bothGames tbody").append($("<tr>" +
                        "<th data-th=\"#\" scope=\"row\">" + response[i].gameId +
                        "<td data-th=\"Datum hry\">" + response[i].beginning + "</td>" +
                        "<td data-th=\"Typ hry\">" + response[i].gameType + "</td>" +
                        "<td data-th=\"Protihráč\">" + response[i].opponent + "</td>" +
                        "<td data-th=\"Vítěz\">" + response[i].winner + "</td>" +
                        "<td data-th=\"Délka hry\">" + response[i].end + "</td>" +
                        "<td class=\"pool_and_karambol\"><a class=\"nav-link\" data-toggle=\"modal\"  href=\"#" + response[i].gameType+ "\">detail</a></td>"+
                        "</tr>"));
                }

                console.log(response);

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