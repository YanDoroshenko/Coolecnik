document.getElementById("addFriend").addEventListener("click", function (event) {

    var vName = $('#friendName').val();

    var obj = {
        "name": vName
    };

    $.ajax("api/friends", {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        statusCode: {
            201: function (response) {
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
})