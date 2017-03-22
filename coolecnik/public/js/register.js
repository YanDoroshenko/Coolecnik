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
	var vPassHash = hash($('#regPass1').val(), false, 0);
	var vName =  $('#regName').val();

	//var hashPass = new String(vPassHash.hashCode());

	var d = { 
		login : vLogin, 
		email : vEmail, 
		passwordHash : vPassHash, 
		firstName : vName 
	};

    var isValid = true;

    //		------pass checks-----------
    // 	check for similarity
    if ($('#regPass1').val() != $('#regPass2').val()){
    	//alert ("Váši hesla jsou různá. Zkuste ještě jednou");
    	$("#regSpan").text("Váši hesla jsou různá. Zkuste ještě jednou");
        return;
    }
    //check for length
    if ($('#regPass1').val().length < 5){
    	//alert ("Vaše heslo je příliš krátké, musí být min. 5 symbolů");
    	$("#regSpan").text("Vaše heslo je příliš krátké, musí mít min. 5 symbolů");
        return;
    }
    //		------pass checks-----------     END


	console.log("Pass check OK. Sending request...");
	$.post( "api/register/", d, function( data ) {
		console.log(data);
	});

	console.log("Hash of pass:", vPassHash);
});