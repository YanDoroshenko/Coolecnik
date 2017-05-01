/**
 * Created by Erik on 17. 4. 2017.
 */

//table switch
document.getElementById('gameType').addEventListener('change', function () {
    var style = this.value == 0 ? 'block' : 'none';
    document.getElementById('bothGames').style.display = style
    var style = this.value == 1 ? 'block' : 'none';
    document.getElementById('8poolGame').style.display = style
    var style = this.value == 2 ? 'block' : 'none';
    document.getElementById('karambolGame').style.display = style

});

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

            // console.log(response);

        },
        404: function (response) {
            console.log("404");
        }
    }
});

function setOpp(opponents) {
    $("#playersStatistics").html(opponents.playersStatistics);
}

