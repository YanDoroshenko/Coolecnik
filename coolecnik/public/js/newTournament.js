/**
 * Created by hodek on 30.05.2017.
 */

//players for tournaments
var allPlayers = [];
allPlayers.push({
    id: getCookie("myId"),
    name: getCookie("myName")
});

$("#gameType").change(function () {
    if (this.checked) {
        $("#carambParams").show();
    }
    else {
        $("#carambParams").hide();
    }
});

$("#karambolGameType").change(function () {
    if ($("#karambolGameType").prop("checked")) {
        console.log("checked");
        $("#carambCount").prop("placeholder", "Počet kol");
    }
    else {
        console.log(" not checked");
        $("#carambCount").prop("placeholder", "Počet karambolů");
    }
});

// callbacked function for addEventListeners of friends
function tempFunc(event, btnArrHtml, btnArr, i) {
    //console.log(btnArrHtml, i);
    var plname = $.parseHTML(btnArrHtml[i]);
    plname = plname[0].innerText;
    var plid = btnArr[i].value;
    //console.log(plname + " " + plid);

    $("#player").html(plname).attr("value", plid);

    // $("#authPlayer2btn").css("display", "none");
}

var endpoint = "/api/players/" + getCookie("myId") + "/friends";
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
                $("#friendlist").append(str1 + item.id + str2 + item.login + str3);
            });
            var btnArr = document.querySelectorAll(".friendBtns");
            console.log(btnArr);
            for (var i = 0; i < btnArr.length; i++) {
                // fucking closure. What the hell is this?
                (function (i) {
                    btnArr[i].addEventListener('click', function () {
                        tempFunc(event, btnArrHtml, btnArr, i);
                    }, false);
                })(i);
            }

        },
        404: function (response) {
            console.log("404");
        }
    }
});


$("#addPlayer").click(function () {
    var player = $("#player");
    var pl = {
        id: player.attr("value"),
        name: player.html()
    };
    if (pl.id != -1 && !allPlayers.some(function (someId) {
            return someId.id == pl.id;
        })) {
        allPlayers.push(pl);
    }
    showPlayers();
});

function showPlayers() {
    var list = $("#playerslist");
    list.html("");
    allPlayers.forEach(function (player) {
        if(player.id != getCookie("myId")) {
            var pattern = "<li class='list-group-item list-group-item-action justify-content-between friend'>" +
                "<a href=friendProfile.html?id=" + player.id + "&nick=" + player.name + ">" + player.name + "</a>" +
                "<button type='button' class='btn btn-outline-danger btn-sm removeBtn' id=" + player.id + ">✘</button></li>";
            list.append(pattern);
        }
    });
}

$("#playerslist").click(function (e) {
    if (e.target.classList.contains("removeBtn")) {
        console.log(e.target.id);
        removePlayer(e.target.id);
    }
});

function removePlayer(id) {
    allPlayers = allPlayers.filter(function (player) {
        return player.id != id;
    });
    showPlayers();
}

$("#createTournament").click(function (e) {
    //delete
    e.preventDefault();

    if (document.getElementById('gameType').checked) {
        var gameType = 2; //karambol
        if (isNaN(parseInt($("#carambCount").val())) || parseInt($("#carambCount").val()) < 1) {
            console.log("bad input in number of rounds");
            $("#carambParams").addClass("has-danger");
            $("#carambCount").addClass("form-control-danger");
            $("#newGameSpan").text("Zadejte správný počet karambolů nebo kol").removeClass("d-none");
            e.preventDefault();
            return;
        } else {
            var rounds = parseInt($("#carambCount").val());
            $("#carambParams").removeClass("has-danger");
            $("#carambCount").removeClass("form-control-danger");
            $("#newGameSpan").text("").addClass("d-none");
        }
    }
    else {
        var gameType = 1; //pool
    }

    if(allPlayers.length < 3) {
        $("#newGameSpan").text("Přidejte alespoň 2 hráče").removeClass("d-none");
        e.preventDefault();
        return;
    } else {
        $("#newGameSpan").text("").addClass("d-none");
    }

    if($("#tournamentTitle")[0].value.length < 1){
        $("#newGameSpan").text("Zadejte název turnaje").removeClass("d-none");
        e.preventDefault();
        return;
    } else {
        $("#newGameSpan").text("").addClass("d-none");
    }

    var endpoint = "/api/tournaments/new";
    var data;
    if ($("#karambolGameType").prop("checked")) {
        //round game
        data = {
            title: $("#tournamentTitle").val(),
            tournamentType: 1,
            gameType: gameType,
            rounds: parseInt($("#carambCount").val()),
            players: allPlayers.map(function (player) {
                return parseInt(player.id);
            })
        };
    }
    else {
        //carambol game
        data = {
            title: $("#tournamentTitle").val(),
            tournamentType: 1,
            gameType: gameType,
            caramboles: parseInt($("#carambCount").val()),
            players: allPlayers.map(function (player) {
                return parseInt(player.id);
            })
        };
    }


    console.log(JSON.stringify(data));

    $.ajax(endpoint, {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        statusCode: {
            201: function (response) {
                console.log(response);
            },
            400: function (response) {
                console.log(response);
            }
        }
    });


});