console.log("My ID: " + getCookie("myId"));

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
            console.log("404 NOT FOUND");
        }

    }
});

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

function removeFriend(friendId) {
    $.ajax("api/players/" + getCookie("myId") + "/unfriend/" + friendId, {
        type: "DELETE",
        contentType: "application/json; charset=utf-8",
        statusCode: {
            204: function (response) {
                console.log("204 NO CONTENT");
            },
            404: function (response) {
                console.log("404 NOT FOUND");
            }
        }
    });

}

function addFriend(name) {
    var obj= {
        playerId: getCookie("myId"),
        friendId: 63 //TODO CANNOT GET ID FROM NAME
    };

    $.ajax("api/players/" + getCookie("myId") + "/befriend/63", { //TODO CANNOT GET ID FOR ENDPOINT
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        statusCode: {
            201: function (response) {
                parseFriends(response);
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

document.getElementById("addFriend").addEventListener("click", function (event) {
    addFriend(document.getElementById("friendName").value);
});

var removeBtn = document.getElementsByClassName("removeBtn"); //TODO Doesn't work, probably because of Bootstrap
for (var i = 0; i < removeBtn.length; i++) {
    removeBtn[i].addEventListener('click', function (event) {
        removeFriend($(this).attr('id'));
    });
}