/* 	Use as hash(<what>, false, 0);
	thanks to  https://github.com/garycourt/murmurhash-js*/
function hash(str, asString, seed) {
    var i, l,
        hval = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if( asString ){
        // Convert to 8 digit hex string
        return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
}


document.getElementById("btnRegister").addEventListener("click", function(event){
    event.preventDefault();

	var vLogin = $('#regLogin').val();
	var vEmail = $('#regEmail').val();
	var vPassHash = hash($('#regPass1').val(), false, 0).toString();
	var vFirstName =  $('#regFirstName').val();
  var vLastName =  $('#regLastName').val();

/*  var str1 = ' { "login" : ' + vLogin + ' ,';
  var str2 = ' "email" : ' + vEmail + ' ,';
  var str3 = ' "passwordHash" : ' + vPassHash + ' ,';
  var str4 = ' "firstName" : ' + vFirstName + ' ,';
  var str5 = ' "lastName" : ' + vLastName + ' }';*/
  var obj = {
    "login": vLogin,
    "email": vEmail,
    "passwordHash": vPassHash,
    "firstName": vFirstName,
    "lastName": vLastName
  }

    //		------pass checks-----------
    // 	check for similarity
    if ($('#regPass1').val() != $('#regPass2').val()){
    	//alert ("Váši hesla jsou různá. Zkuste ještě jednou");
    	$("#regSpan").text("Váši hesla jsou různá. Zkuste ještě jednou");
        return;
    }
    //check for length
    else if ($('#regPass1').val().length < 5){
    	//alert ("Vaše heslo je příliš krátké, musí být min. 5 symbolů");
    	$("#regSpan").text("Vaše heslo je příliš krátké, musí mít min 5 symbolů");
        return;
    }
    //		------pass checks-----------     END

    // TODO maybe make error messages more beautiful
    else
    {
        $.ajax("api/register", {
           type: "POST",
           contentType: "application/json; charset=utf-8",
           data: JSON.stringify(obj),
           statusCode: {
              201: function (response) {
                 $("#regSpan").text("Jste úspěšně zaregistrován, můžete se přihlásit.");
                 console.log("201 CREATED");
              },
              400: function (response) {
                 $("#regSpan").text("Can't deserialize JSON");
                 console.log("400 BAD REQUEST");
              },
              406: function (response) {
                 $("#regSpan").text("Can't insert user into DB");
                 console.log("406 NOT ACCEPTABLE");
              }
           }
        });
    }
});