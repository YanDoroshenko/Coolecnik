// thanks to  https://github.com/garycourt/murmurhash-js
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


document.getElementById("btnLogin").addEventListener("click", function (event) {
    event.preventDefault();
    $("#loginSpan").text("");

    // check for required fields non-emptiness
    if ($('#loginLogin').val().length === 0 || $('#loginPass').val() === 0) {
        $("#loginSpan").text("Jedno z povinných polí je nevyplněno");
        return;
    }

    var vLogin = $('#loginLogin').val();
    var vPassHash = hash($('#loginPass').val(), true, $('#loginPass').val().length).toString();

    var obj = {
        "login": vLogin,
        "passwordHash": vPassHash
    };

    $.ajax("api/login", {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        statusCode: {
            202: function (response) {
                console.log("202 ACCEPTED");

                if ($("#remembChBox").prop("checked")) {
                    createCookie("myId", response.id, 365);
                    createCookie("myName", vLogin, 365);
                    createCookie("email", response.email, 365);
                    createCookie("firstName", response.firstName, 365);
                }
                else {
                    createCookie("myId", response.id);
                    createCookie("myName", vLogin);
                    createCookie("email", response.email);
                    createCookie("firstName", response.firstName);
                }
                localStorage.setItem("myId", response.id);
                localStorage.setItem("myName", vLogin);
                window.location.replace("/game.html");
            },
            400: function (response) {
                $("#loginSpan").text("Can't deserialize JSON");
                console.log("400 BAD REQUEST");
            },
            401: function (response) {
                $("#loginSpan").text("Špatný login nebo heslo. Zkuste ještě jednou. ");
                console.log("401 UNAUTHORIZED");
            }
        }
    });

});



