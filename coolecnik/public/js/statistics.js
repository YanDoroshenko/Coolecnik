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

//opponents fill selectBox
document.getElementById("playersStatistics").ready(function (){
    var endpoint = "/api/players/" + getCookie("myId") + "/opponents";

    $.ajax(endpoint, {
        type: "GET",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            200: function (response) {
                var str1 = "<button class='dropdown-item friendBtns' type='button' value='";
                var str2 = "'>";
                var str3 = "</button>";
                var btnArrHtml = [];

                response.forEach(function (item, i, response) {
                    btnArrHtml.push(str1 + item.id + str2 + item.login + str3);
                    $("#friendList").html($("#friendList").html() + str1 + item.id + str2 + item.login + str3);
                });

                }
            }
    });
});
