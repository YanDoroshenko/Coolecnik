/**
 * Created by hodek on 14.05.2017.
 */
/* 	Use as hash(<what>, true);
 thanks to  https://github.com/garycourt/murmurhash-js*/

var GET = {};
var query = window.location.search.substring(1).split("&");
for (var i = 0, max = query.length; i < max; i++)
{
    if (query[i] === "") // check for trailing & with no param
        continue;

    var param = query[i].split("=");
    GET[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
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

const endpointLoad = "/api/players/" + GET.id + "/statistics/basic";
const endpointStrikes = "/api/players/" + GET.id + "/statistics/strikes";
const endpointTournamentsBasics = "/api/players/" + GET.id + "/statistics/basicTournament";


$("#nickname").html(GET.nick);

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


$.ajax(endpointTournamentsBasics, {
    type: "GET",
    contentType: "application/json; charset=utf-8",
    statusCode: {
        200: function (response) {
            setTournamentsStats(response);
            console.log(response);
        },
        404: function (response) {
            console.log("404");
        }

    }

});

function setTournamentsStats(stats) {
    $("#t_total").html(stats.total);
    $("#t_won").html(stats.won);
    $("#t_lost").html(stats.lost);
    $("#t_draws").html(stats.draws);
    var percent = stats.won/((stats.won+stats.lost)/100);
    $("#t_percent").html(percent.toFixed(2) + " %");

    var chart = new CanvasJS.Chart("chartTournament_games",
        {
            theme: "theme2",
            title:{
                text: "Turnajové hry: " + stats.total
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
        console.log("show chart Tournament");
        chart.render();
    } else {
        $("#chartTournament_games").addClass("d-none");
        console.log("NOT show chart Tournament");
    }
}


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
    } else {
        $("#chartContainer_games").addClass("d-none");
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
        totalEndStrikes: data.eightball_foul_at_racking + data.eightball_racked_too_early + data.eightball_to_wrong_hole
        + data.eightball_out_of_table + data.game_end_correctly
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
    if(poolStrikes.total != 0) {
        chartPool.render();
    } else {
        $("#chartPoolStrikes").addClass("d-none");
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
    if(poolStrikes.totalEndStrikes != 0) {
        chartEndPool.render();
    } else {
        $("#chartPoolEndStrikes").addClass("d-none");
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
    } else {
        $("#chartCarambolStrikes").addClass("d-none");
    }

}
