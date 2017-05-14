/* 	Use as hash(<what>, true);
 thanks to  https://github.com/garycourt/murmurhash-js*/
function hash(str, asString, seed) {
    var i, l,
        hval = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if (asString) {
        // Convert to 8 digit hex string
        return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+'h '+minutes+'m '+seconds+"s";
};

const endpointLoad = "/api/players/" + getCookie("myId") + "/statistics/basic";
const endpointStrikes = "/api/players/" + getCookie("myId") + "/statistics/strikes";
const passMatch = "<strong>Hesla se neshodují.</strong>";
const passChanged = "<strong>Heslo změněno.</strong>";

$("#nickname").html(getCookie("myName"));
$("#email").html(getCookie("email"));
$("#name").attr("value", getCookie("firstName"));
$("#surname").attr("value", getCookie("lastName"));

$.ajax(endpointStrikes, {
    type: "GET",
    contentType: "application/json; charset=utf-8",
    statusCode: {
        200: function (response) {
            response = JSON.parse(response);
            console.log(response);
            createStrikeCharts(response);
        },
        404: function (response) {
            console.log("404");
        }
    }
});


$.ajax(endpointLoad, {
    type: "GET",
    contentType: "application/json; charset=utf-8",
    statusCode: {
        200: function (response) {
            setStats(response);
            console.log(response);
        },
        404: function (response) {
            console.log("404");
        }

    }

});

function setStats(stats) {
    $("#time").html(stats.totalSecs.toString().toHHMMSS());
    $("#total").html(stats.total);
    $("#won").html(stats.won);
    $("#lost").html(stats.lost);
    $("#draws").html(stats.draws);
    var percent = stats.won/((stats.won+stats.lost)/100);
    $("#percent").html(percent.toFixed(2) + " %");

    var chart = new CanvasJS.Chart("chartContainer_games",
        {
            theme: "theme2",
            title:{
                text: "Všechny hry: " + stats.total
            },
            backgroundColor: "rgba(1, 1, 1, 0.2)",
            legend: {
                maxWidth: 350,
                fontColor: "white"
            },
            data: [
                {
                    type: "pie",
                    showInLegend: true,
                    toolTipContent: "{y} : #percent %",
                    yValueFormatString: "#0.#",
                    legendText: "{indexLabel}",
                    dataPoints: [
                        {  y: stats.draws, indexLabel: "Remízy" },
                        {  y: stats.lost, indexLabel: "Prohry" },
                        {  y: stats.won,  indexLabel: "Výhry" }
                    ]
                }
            ]
        });
    if(stats.total != 0) {
        chart.render();
    }
}

function createStrikeCharts(data) {

    var poolStrikes = {
        ball_foul_at_racking: data.eightball_foul_at_racking,
        ball_racket_too_early: data.eightball_racked_too_early,
        ball_to_wrong_hole: data.eightball_to_wrong_hole,
        ball_out_of_table: data.eightball_out_of_table,
        wrong_shot: data.wrong_shot_pool,
        foul_with_white: data.foul_with_white,
        foul_with_others_ball: data.foul_with_others_ball,
        foul_other: data.foul_other,
        game_end_correctly: data.game_end_correctly,
        correct_pool: data.correct_pool,
        total: data.eightball_foul_at_racking+data.eightball_racked_too_early+data.eightball_to_wrong_hole+
        data.eightball_out_of_table+data.wrong_shot_pool+data.foul_with_white+data.foul_with_others_ball+
        data.foul_other+data.game_end_correctly+data.correct_pool,
    };

    var carambolStrikes = {
        correct: data.correct_carambole,
        foul: data.foul_carambole,
        total: data.correct_carambole + data.foul_carambole
    };

    var chartPool = new CanvasJS.Chart("chartPoolStrikes",
        {
            theme: "theme2",
            title:{
                text: "8-pool strky: " + poolStrikes.total
            },
            backgroundColor: "rgba(1, 1, 1, 0.2)",
            legend: {
                maxWidth: 350,
                fontColor: "white"
            },
            data: [
                {
                    type: "pie",
                    showInLegend: true,
                    toolTipContent: "{y} : #percent %",
                    yValueFormatString: "#0.#",
                    legendText: "{indexLabel}",
                    dataPoints: [
                        {  y: poolStrikes.wrong_shot, indexLabel: "Nesprávný strk" },
                        {  y: poolStrikes.foul_with_white, indexLabel: "Utopení bílé" },
                        {  y: poolStrikes.correct_pool, indexLabel: "Správný strk" },
                        {  y: poolStrikes.foul_with_others_ball, indexLabel: "Faul cizí koule" },
                        {  y: poolStrikes.foul_other, indexLabel: "Jiný faul" }
                    ]
                }
            ]
        });
    if(poolStrikes != 0) {
        chartPool.render();
    }

    var chartEndPool = new CanvasJS.Chart("chartPoolEndStrikes",
        {
            theme: "theme2",
            title:{
                text: "8-pool ukončení hry "
            },
            backgroundColor: "rgba(1, 1, 1, 0.2)",
            legend: {
                maxWidth: 350,
                fontColor: "white"
            },
            data: [
                {
                    type: "pie",
                    showInLegend: true,
                    toolTipContent: "{y} : #percent %",
                    yValueFormatString: "#0.#",
                    legendText: "{indexLabel}",
                    dataPoints: [
                        {  y: poolStrikes.ball_foul_at_racking,  indexLabel: "8 faul při potápění" },
                        {  y: poolStrikes.ball_racket_too_early, indexLabel: "8 utopena brzy" },
                        {  y: poolStrikes.ball_to_wrong_hole, color: "salmon", indexLabel: "8 utopena do špatné díry" },
                        {  y: poolStrikes.ball_out_of_table, indexLabel: "8 vyražena ze stolu" },
                        {  y: poolStrikes.game_end_correctly, color: "lightgreen", indexLabel: "Hra ukončena správně" },
                    ]
                }
            ]
        });
    if(poolStrikes != 0) {
        chartEndPool.render();
    }

    var chartCarambol = new CanvasJS.Chart("chartCarambolStrikes",
        {
            theme: "theme2",
            title:{
                text: "Karambol strky: " + carambolStrikes.total
            },
            backgroundColor: "rgba(1, 1, 1, 0.2)",
            legend: {
                maxWidth: 350,
                fontColor: "white"
            },
            data: [
                {
                    type: "pie",
                    showInLegend: true,
                    toolTipContent: "{y} : #percent %",
                    yValueFormatString: "#0.#",
                    legendText: "{indexLabel}",
                    dataPoints: [
                        {  y: carambolStrikes.correct,  indexLabel: "Správné" },
                        {  y: carambolStrikes.foul, indexLabel: "Špatné" }
                    ]
                }
            ]
        });
    if(carambolStrikes.total != 0) {
        chartCarambol.render();
    }

}

$("#changePass").click(function () {
   if ($("#newPass1").val() == $("#newPass2").val()){
       updatePassword();
   } else {
       $(".alert").html(passMatch);
       $( ".alert" ).removeClass( "alert-success d-none" );
   }
});

function updatePassword() {
    var obj= {
        email: getCookie("email"),
        oldPassword: hash($('#oldPass').val(), true, $('#oldPass').val().length).toString(),
        newPassword: hash($('#newPass1').val(), true, $('#newPass1').val().length).toString()
    };
    $.ajax("/api/passwdupdate ", {
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        statusCode: {
            201: function (response) {
                $(".alert").html(passChanged);
                $( ".alert" ).removeClass( "alert-danger d-none" );
                unauthorize();
                console.log("201 CREATED");
            },
            400: function (response) {

                console.log("400 BAD REQUEST");
            },
            409: function (response) {

                console.log("409 CONFLICT");
            }
        }
    });
}

var changeNameAlert = $("#nameAlert");

$("#changeName").click(function (e) {
    e.preventDefault();
    var obj = {
        firstName: $("#name").val(),
        id: getCookie("myId"),
        lastName: $("#surname").val()
    };
    console.log(obj.firstName + " " + obj.lastName + " " + obj.id);
    $.ajax("/api/players/"+getCookie("myId")+"/nameupdate", {
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        statusCode: {
            201: function (response) {
                console.log("201 Name and Surname changed" + obj.toLocaleString());
                changeBadgeState(true);
            },
            404: function (response) {
                console.log("404 BAD REQUEST");
                changeBadgeState(false);
            }
        }
    });

});

function changeBadgeState(good) {
    if (good) {
        changeNameAlert.removeClass("d-none");
        changeNameAlert.addClass("badge-success");
        changeNameAlert.html("Uspěšně změněno");
    } else {
        changeNameAlert.removeClass("d-none");
        changeNameAlert.addClass("badge-danger");
        changeNameAlert.html("Chyba");
    }


}