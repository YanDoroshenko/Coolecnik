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

getFriends();

console.log("My ID: " + getCookie("myId"));

function getFriends() {
    var friendPoint = "api/players/" + getCookie("myId") + "/friends";
    $.ajax(friendPoint, {
        type: "GET",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            200: function (response) {
                parseFriends(response);
                console.log("200 OK");
            },
            404: function (response) {
                console.log("friends 404 NOT FOUND");
            }

        }
    });
}

function parseFriends(friends) {
    document.getElementById("friendList").innerHTML = "";
    for (var i in friends) {
        $("#friendList").append(
            "<li class=\"list-group-item list-group-item-action friend\"><a href=\"\">" + friends[i].login
            + "</a><button class=\"btn btn-outline-danger btn-sm removeBtn\" id=\"" + friends[i].id
            + "\">&#10008;</button></li>"
        )
    }
}

function secondDirectionRemove(friendId) {
    $.ajax("api/players/" + friendId + "/unfriend/" + getCookie("myId"), {
        type: "DELETE",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            204: function (response) {
                getFriends();
                console.log("204 NO CONTENT");
            },
            404: function (response) {
                console.log("404 NOT FOUND");
            }
        }
    });

}

function removeFriend(friendId) {
    $.ajax("api/players/" + getCookie("myId") + "/unfriend/" + friendId, {
        type: "DELETE",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            204: function (response) {
                secondDirectionRemove(friendId);
                console.log("204 NO CONTENT");
            },
            404: function (response) {
                console.log("404 NOT FOUND");
            }
        }
    });

}

function checkFriend() {
    var vLogin = $('#friendName').val();
    var vPassHash = hash($('#friendPassword').val(), true, $('#friendPassword').val().length).toString();

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
                addFriend(response.id);
            },
            400: function (response) {
                $("#friendSpan").text("Can't deserialize JSON.");
                console.log("400 BAD REQUEST");
            },
            401: function (response) {
                $("#friendSpan").text("Špatný login nebo heslo. Zkuste ještě jednou.");
                console.log("401 UNAUTHORIZED");
            }
        }
    });
}

function secondDirectionAdd(friendId) {
    $.ajax("api/players/" + friendId + "/befriend/" + getCookie("myId"), {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            201: function (response) {
                $("#friendSpan").text("Přítel úspěšně přidán.");
                console.log("201 CREATED");
            },
            404: function (response) {
                console.log("404 NOT FOUND");
            },
            409: function (response) {
                console.log("409 CONFLICT");
            }

        }
    });
}

function addFriend(friendId) {
    $.ajax("api/players/" + getCookie("myId") + "/befriend/" + friendId, {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            201: function (response) {
                secondDirectionAdd(friendId);
                parseFriends(response);
                $('#addFriendModal').modal('hide');
                console.log("201 CREATED");
            },
            404: function (response) {
                console.log("404 NOT FOUND");
            },
            409: function (response) {
                console.log("409 CONFLICT");
            }

        }
    });
}

// Event Listeners
document.getElementById("addFriend").addEventListener("click", function (event) {
    checkFriend();
});

document.getElementById("friendList").addEventListener("click", function(event) {
    var target = event.target;
    if (target.classList.contains("removeBtn")) {
        removeFriend(target.id);
    }
});