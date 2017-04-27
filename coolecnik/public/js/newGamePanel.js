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

document.getElementById("authPlayer2btn").addEventListener("click", function (event) {
    event.preventDefault();
    if (isSecondPlayerAuthMenuOpened === true)
        return;
    var passField = "<input id='pass' type='password' placeholder='Heslo protihráče' class='form-control' style='width: 60.7%; display: inline;'>";
    var authKey = "<button class='icon-key' id='authBtn' style='width: 42px; height: 32px; padding-top: 3%; margin-left: 2%'></button>";
    var thrashKey = "<button class='icon-thrash' id='thrashBtn' style='width: 42px; height: 32px; padding-top: 3%; margin-left: 2%'></button>";
    isSecondPlayerAuthMenuOpened = true;
    $("#authPlayer2btn").after(passField + authKey + thrashKey);


    document.getElementById("authBtn").addEventListener("click", function (event) {
        event.preventDefault();
        $("#newGameSpan").val = "";
        document.getElementById("authBtn").className = "icon-load";

        var obj = {
            "login": $('#pl0').val(),
            "passwordHash": hash($('#pass').val(), true, $('#pass').val().length).toString()
        };


        $.ajax("api/login", {
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            statusCode: {
                202: function (response) {
                    console.log("202 ACCEPTED");
                    if (getCookie("myId") == response.id) {
                        $("#newGameSpan").text("Nelze hrát s sebou. Fakt nemáte kamarádi na to? Je to smůla");
                        document.getElementById("authBtn").className = "icon-key";
                        return;
                    }
                    isSecondPlayerAuthorized = true;
                    localStorage.setItem("secondPlayerId", response.id);
                    document.getElementById("authBtn").className = "icon-ok";
                },
                400: function (response) {
                    document.getElementById("authBtn").className = "icon-nook";
                },
                401: function (response) {
                    document.getElementById("authBtn").className = "icon-nook";
                }
            }
        });

    });


    document.getElementById("thrashBtn").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("authBtn").className = "icon-key";
        $("#pass").remove();
        $("#authBtn").remove();
        $("#thrashBtn").remove();
        isSecondPlayerAuthorized = false;
        isSecondPlayerAuthMenuOpened = false;
    });

});

// callbacked function for addEventListeners of friends
function tempFunc(event, btnArrHtml, btnArr, i) {
    // if clicked on any friend, not "JIny hrac"
    if (btnArr[i].value !== "-41") {
        console.log(btnArrHtml, i);
        var plname = String(btnArrHtml[i]).slice(65);
        plname = plname.slice(0, -9);
        plname = btnArr[i].innerHTML;
        console.log(btnArr[i]);
        var plid = btnArr[i].value;
        localStorage.setItem("secondPlayerId", btnArr[i].value);
        isSecondPlayerAuthorized = true;
        $("#pl0").val(plname);
        $("#authPlayer2btn").css("display", "none");
    }
    else {
        $("#authPlayer2btn").css("display", "inline");
        $("#pl0").val("");
    }
}

document.getElementById("inviteFriend").addEventListener("click", function (event) {
    if ($("#friendList").length !== 0)
        $("#friendList").remove();

    var frPanel = "<div class='dropdown-menu dropdown-menu-right dropdown-toggle' id='friendList' style=''> </div>";
    $("#inviteFriend").after(frPanel);

    $("#friendList").html("");

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
                    $("#friendList").html($("#friendList").html() + str1 + item.id + str2 + item.login + str3);
                });
                btnArrHtml.push(str1 + "-41" + str2 + "Jiny hrac" + str3);
                $("#friendList").html($("#friendList").html() + "<hr>" + str1 + "-41" + str2 + "<i>Jiny hrac</i>" + str3);
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
    })
});

document.getElementById("newGameBtn").addEventListener("click", function (event) {
    event.preventDefault();
    $("#newGameSpan").val = "";
    if ($("#pl0").val().length == 0) {
        $("#newGameSpan").text("Jméno musí být neprazdné");
        return;
    }

    if (document.getElementById('gameType').checked) {
        var gameType = 2; //karambol
        if ($("#karambolGameType").prop("checked")) {
            localStorage.setItem("carType", "2"); //round game
        }
        else {
            localStorage.setItem("carType", "1"); //carambol game
        }
    }
    else
        var gameType = 1; //pool

    localStorage.setItem("gameType", gameType);

    var dateTime = new Date().toISOString().slice(0, new Date().toISOString().length - 5) + "Z" + new Date().getTimezoneOffset() / 60 + "00";
    if (new Date().getTimezoneOffset() / 60 < 10 && new Date().getTimezoneOffset() / 60 > -10)
        dateTime = dateTime.slice(0, 21) + 0 + dateTime.slice(21, 22) + "00";

    if (dateTime[20] === "0") {
        dateTime = dateTime.replaceAt(20, "+");
        console.log("new dateTime ", dateTime);
    }

    localStorage.setItem("secondPlayerName", $('#pl0').val());

    var obj = {
        "gameType": gameType,
        "player1": parseInt(getCookie("myId")),
        "player2": (isSecondPlayerAuthorized === true) ? parseInt(localStorage.getItem("secondPlayerId")) : -1,
        "beginning": dateTime
    };

    $.ajax("/api/games/new", {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        statusCode: {
            201: function (response) {
                console.log("201 CREATED");

                if (gameType === 1) {
                    localStorage.setItem("currentGame", null);
                    $("#player1").text(getCookie("myName"));
                    $("#player2").text($('#pl0').val());
                    $("#newGameDiv").css("display", "none");

                    $("#poolControlDiv").css("display", "block");

                    gameId = response.id;
                    players = [{
                        "id": parseInt(getCookie("myId")),
                        "name": getCookie("myName")
                    }, {
                        "id": (isSecondPlayerAuthorized == true) ? parseInt(localStorage.getItem("secondPlayerId")) : -1,
                        "name": $('#pl0').val()
                    }];
                    localStorage.setItem("players", JSON.stringify(players));

                    activePlayer = Math.floor(Math.random() * (3 - 1)) + 1; // 1 for 1st player, 2 for second
                    if (activePlayer === 1) {
                        document.getElementById("player1").className = "active-player";
                        document.getElementById("player2").className = "";
                    }
                    else {
                        document.getElementById("player1").className = "";
                        document.getElementById("player2").className = "active-player";
                    }
                    localStorage.setItem("activePlayer", activePlayer);

                    $("#helpDiv").html("");
                    $("#endOfGameDiv").html("");

                    $("#pl1good").html("0");
                    $("#pl2good").html("0");
                    $("#pl1bad").html("0");
                    $("#pl2bad").html("0");

                    $("#timerM").html("0");
                    $("#timerS").html("0");
                    var savedCounterValues = {
                        "green1": 0,
                        "green2": 0,
                        "red1": 0,
                        "red2": 0
                    };
                    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

                    localStorage.setItem("activeGame", true);

                    localStorage.setItem("savedGame", null);
                    localStorage.setItem("savedGameInfo", null);
                    clearTimeout(timerVar);
                    timerVar = setInterval(countTimer, 1000);
                    round = 1;
                }
                else if (gameType === 2) {
                    localStorage.setItem("currentGame", null);
                    $("#player1c").text(getCookie("myName"));
                    $("#player2c").text($('#pl0').val());
                    $("#newGameDiv").css("display", "none");

                    $("#karambolControlDiv").css("display", "block");

                    if (localStorage.getItem("carType") === "1") { //carambol game
                        $("#carGameType1Div").show();

                        localStorage.setItem("roundsTotal", $("#carambCount").val());
                        localStorage.setItem("roundsRemain", round);

                        $("#carGameType1CarsTotal").html(localStorage.getItem("roundsTotal"));
                        $("#carGameType1CurrentRound").html(localStorage.getItem("roundsRemain"));
                    }
                    else if (localStorage.getItem("carType") === "2") {  //round game
                        $("#carGameType2Div").show();

                        localStorage.setItem("carsTotal", $("#carambCount").val());
                        localStorage.setItem("currentRound", $("#carambCount").val());

                        $("#carGameType2RoundsTotal").html(localStorage.getItem("carsTotal"));
                        $("#carGameType2RoundsRemain").html(localStorage.getItem("currentRound"));
                    }


                    gameId = response.id;
                    players = [{
                        "id": parseInt(getCookie("myId")),
                        "name": getCookie("myName")
                    }, {
                        "id": (isSecondPlayerAuthorized === true) ? parseInt(localStorage.getItem("secondPlayerId")) : -1,
                        "name": $('#pl0').val()
                    }];
                    localStorage.setItem("players", JSON.stringify(players));

                    activePlayer = Math.floor(Math.random() * (3 - 1)) + 1; // 1 for 1st player, 2 for second
                    if (activePlayer === 1) {
                        document.getElementById("player1c").className = "active-player";
                        document.getElementById("player2c").className = "";
                    }
                    else {
                        document.getElementById("player1c").className = "";
                        document.getElementById("player2c").className = "active-player";
                    }
                    localStorage.setItem("activePlayer", activePlayer);

                    $("#helpDiv").html("");
                    $("#endOfGameDiv").html("");

                    $("#pl1goodc").html("0");
                    $("#pl2goodc").html("0");

                    $("#timerMc").html("0");
                    $("#timerSc").html("0");
                    var savedCounterValues = {
                        "green1": 0,
                        "green2": 0
                    };
                    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

                    localStorage.setItem("activeGame", true);

                    localStorage.setItem("savedGame", null);
                    localStorage.setItem("savedGameInfo", null);
                    clearTimeout(timerVar);
                    clearTimeout(timerVar);
                    timerVar = setInterval(countTimer, 1000);
                    round = 1;
                }

            },
            400: function (response) {
                console.log("400 BAD REQUEST");
                $("#newGameSpan").val = "OH NO";
                localStorage.setItem("activeGame", "false");
            },
            409: function (response) {
                console.log("409 CONFLICT");
                $("#newGameSpan").val = "OH NO";
                localStorage.setItem("activeGame", "false");
            }
        }
    });


});
