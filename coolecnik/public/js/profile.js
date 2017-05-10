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
}

const endpointLoad = "/api/players/" + getCookie("myId") + "/statistics/basicGames ";
const passMatch = "<strong>Hesla se neshodují.</strong>";
const passChanged = "<strong>Heslo změněno.</strong>";

$("#nickname").html(getCookie("myName"));
$("#email").html(getCookie("email"));
$("#name").attr("value", getCookie("firstName"));
$("#surname").attr("value", getCookie("lastName"));


$.ajax(endpointLoad, {
    type: "GET",
    contentType: "application/json; charset=utf-8",
    statusCode: {
        200: function (response) {
            setStats(response);
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