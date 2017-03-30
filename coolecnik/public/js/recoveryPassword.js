var email = "";
var inpRecCode = "";
var inpRecCodeFromSrv = "";
var newPass = "";

document.getElementById("btnRec").addEventListener("click", function (event) {
    event.preventDefault();
    $("#myModal").modal();
});

document.getElementById("recEmailBtn").addEventListener("click", function (event) {
    event.preventDefault();


    $("#recEmailSpan").text("");
    window.email = $('#recEmailForm').val();
    if (validateEmail(window.email) == false) {
        $("#recEmailSpan").text("Zadaný email je ve špatném formátu");
        return;
    }
    var obj = {
        "email": window.email
    };
    $("#recEmailSpan").css('text-color', 'red');
    $.ajax("api/passwdreset", {
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        statusCode: {
            404: function (response) {
                console.log("404 NOT FOUND");
                $("#recEmailSpan").text("Zadaný email neexistuje");
            },
            202: function (response) {
                console.log("202 ACCEPTED");
                window.inpRecCodeFromSrv = response.restorePassword;
                $("#recEmail").css('display', 'none');
                $("#recRecCode").css('display', 'block');
            },
            400: function (response) {
                $("#recEmailSpan").text("Can't deserialize JSON");
                console.log("400 BAD REQUEST");
            }
        },
        // success: function(response) {
        // 		window.inpRecCodeFromSrv = JSON.parse(response).recoveryPassword;
        // }

    });

    /*
     $("#recEmail").css('display', 'none');
     $("#recRecCode").css('display', 'block');
     */
});

document.getElementById("recRecCodeBtn").addEventListener("click", function (event) {
    event.preventDefault();
    $("#recRecCodeSpan").text("");
    window.inpRecCode = $('#recRecCodeForm').val();
    $("#recRecCodeForm").css('text-color', 'red');
    if ($('#recRecCodeForm').val() != window.inpRecCodeFromSrv) {
        $("#recRecCodeSpan").text("Špatný kod");

    }
    else {
        $("#recRecCode").css('display', 'none');
        $("#recRecNewPass").css('display', 'block');
    }
});

document.getElementById("recRecNewPassBtn").addEventListener("click", function (event) {
    event.preventDefault();
    $("#recRecNewPassSpan").text("");
    if ($('#recRecNewPass1').val().length < 5) {
        $("#recRecNewPassSpan").text("Vaše heslo je příliš krátké, musí mít min 5 symbolů");
        return;
    }
    if ($('#recRecNewPass1').val() != $('#recRecNewPass2').val()) {
        $("#recRecNewPassSpan").text("Váši hesla jsou různá. Zkuste ještě jednou");
        return;
    }
    window.newPass = $('#recRecNewPass1').val();
    var obj = {
        "email": window.email,
        "oldPassword": window.inpRecCodeFromSrv,
        "newPassword": hash(window.newPass, true, window.newPass.length).toString()
    };
    $("#recRecCode").css('text-color', 'red');
    $.ajax("api/passwdupdate", {
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        statusCode: {
            404: function (response) {
                console.log("404 NOT FOUND");
                $("#recRecNewPassSpan").text("Zadaný email neexistuje");
            },
            201: function (response) {
                console.log("201 CREATED");
                $("#recRecCode").css('text-color', 'green');
                $("#recRecNewPassSpan").text("Heslo bylo obnoveno");
            },
            400: function (response) {
                console.log("400 BAD REQUEST");
                $("#recRecNewPassSpan").text("Can't deserialize JSON");
            },
            401: function (response) {
                console.log("401 UNAUTHORIZED");
                $("#recRecNewPassSpan").text("Špatný kod");
            }
        }
    });
});




