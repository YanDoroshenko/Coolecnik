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


document.getElementById("btnLogin").addEventListener("click", function(event){
    // TODO uncoment next line when autorization will be implemented
    //event.preventDefault();

    var vLogin = $('#loginLogin').val();
    var vPassHash = hash($('#loginPass').val(), false, 0);

    var d = { 
        login : vLogin, 
        passwordHash : vPassHash
    };

    //      ------pass checks-----------
    //      ------pass checks-----------     END

    $.post( "api/login/", d, function( data ) {
        console.log(data);
    });

});