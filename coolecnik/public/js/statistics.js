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
var sel = document.getElementById('playersStatistics');
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
    $("#playersStatistics").html(opponents.playersStatistics);
}



//statistics filtering

// var endpoint = "/api/players/" + getCookie("myId") + "/statistics?gameType=pool8&opponent=60&page=2&pageSize=1";
// var endpoint = "/api/players/" + getCookie("myId") + "/statistics?gameType="+$("#gameType").val()+"&result="+
//     $("#gameStatus").val()+"&opponent="+ $("#opponents").val() + "&page=1&pageSize=15";
var endpoint = "/api/players/" + getCookie("myId") + "/statistics?gameType=pool8&opponent=60";

// &from=" +$("#dateFrom").val();


$.ajax(endpoint, {
    type: "GET",
    contentType: "application/json; charset=utf-8",
    statusCode: {
        200: function (response) { 

                for (var i = 0; i < response.length; i++) {
                    $("#caramboleGame tbody").append($("<tr><th>" + response[i].gameId +
                        "</th><td>" + response[i].beginning + "</td>" +
                        "</td><td>" + response[i].gameType + "</td>" +
                        "</td><td>" + response[i].opponent + "</td>" +
                        "</td><td>" + response[i].winner + "</td>" +
                        "</td><td>" + response[i].end + "</td>" +
                        "</td><td>" + response[i].rounds + "</td>" +
                        // "</td><td>" + response[i].myCarambole + "</td>" +
                        // "</td><td>" + response[i].othersCarambole + "</td>" +
                        // "</td><td>" + response[i].myFauls + "</td>" +
                        // "<td>" + response[i].othersFauls + "</td>" +
                        "</tr>"));
                }


                for (var i = 0; i < response.length; i++) {
                    $("#8poolGame tbody").append($("<tr><th>" + response[i].gameId +
                        "</th><td>" + response[i].beginning + "</td>" +
                        "</td><td>" + response[i].gameType + "</td>" +
                        "</td><td>" + response[i].opponent + "</td>" +
                        "</td><td>" + response[i].winner + "</td>" +
                        "</td><td>" + response[i].end + "</td>" +
                        "</td><td>" + response[i].correctStrikes + "</td>" +
                        "</td><td>" + response[i].wrongStrikes + "</td>" +
                        "</td><td>" + response[i].faulsWithWhite + "</td>" +
                        "</td><td>" + response[i].faulsWithOthers + "</td>" +
                        "<td>" + response[i].faulsOther + "</td></tr>"));
                }


                for (var i = 0; i < response.length; i++) {
                    $("#bothGames tbody").append($("<tr><th>" + response[i].gameId +
                        "</th><td>" + response[i].beginning + "</td>" +
                        "</td><td>" + response[i].gameType + "</td>" +
                        "</td><td>" + response[i].opponent + "</td>" +
                        "</td><td>" + response[i].winner + "</td>" +
                        "</td><td>" + response[i].end + "</td></tr>"));

            }

            console.log(response);

            // if($("#gameType") == all){
            //
            // }

            // if($("#gameType") == pool8){
            //
            // }
            //
            // if($("#gameType") == carambole){
            //
            // }

            // console.log(response);

        },
        400: function (response) {
            console.log("400 BAD REQUEST");
        },
        404: function (response) {
            console.log("404 NOT FOUND");
        }
    }
    });