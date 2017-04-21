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

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


document.getElementById("btnRegister").addEventListener("click", function (event) {
    event.preventDefault(); // html5's 'required' doesnt work because of this I suppose
    $("#regSpan").text("");

    //------pass checks-----------
    // check for required fields non-emptiness
    if ($('#regLogin').val().length == 0 || $('#regEmail').val().length == 0 || $('#regPass1').val().length == 0 || $('#regPass2').val().length == 0) {
        $("#regSpan").text("Jedno z povinných polí je nevyplněno");

    }
    // check for email format
    else if (validateEmail($('#regEmail').val()) == false) {
        $("#regSpan").text("Zadaný email je ve špatném formátu");

    }
    //check for length
    else if ($('#regPass1').val().length < 5) {
        $("#regSpan").text("Vaše heslo je příliš krátké, musí mít min 5 symbolů");

    }
    // 	check for passwords similarity
    else if ($('#regPass1').val() != $('#regPass2').val()) {
        $("#regSpan").text("Váši hesla jsou různá. Zkuste ještě jednou");

    }
    // check if login value equals to password value
    else if ($('#regPass1').val() == $('#regLogin').val()) {
        $("#regSpan").text("Login je stejný s heslem. Toto není bezpečně!");

    }
    //------pass checks-----------     END

    // TODO maybe make post-registration messages more beautiful
    else {
        var vLogin = $('#regLogin').val();
        var vEmail = $('#regEmail').val();
        var vPassHash = hash($('#regPass1').val(), true, $('#regPass1').val().length).toString();
        var vFirstName = $('#regFirstName').val();
        var vLastName = $('#regLastName').val();

        var obj = {
            "login": vLogin,
            "email": vEmail,
            "passwordHash": vPassHash,
            "firstName": vFirstName,
            "lastName": vLastName
        };

        $.ajax("api/register", {
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            statusCode: {
                201: function (response) {
                    var registrationForm = $("#register")[0];
                    registrationForm.reset();
                    registrationForm.className += "collapse";

                    var feedback = $("#regSpan");
                    feedback.text("Jste úspěšně zaregistrován, můžete se přihlásit.");
                    feedback.delay(5000).fadeOut(300);
                    feedback[0].style.color = "#5ff72d";
                    console.log("201 CREATED");
                },
                400: function (response) {
                    $("#regSpan").text("Can't deserialize JSON");
                    console.log("400 BAD REQUEST");
                },
                409: function (response) {
                    $("#regSpan").text("Can't insert user into DB");
                    console.log("409 CONFLICT");
                }
            }
        });
    }

});