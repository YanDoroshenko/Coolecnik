function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}


function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}


function deleteCookie(name) {
    createCookie(name, "", -1);
}

function unauthorize() {
    deleteCookie("myName");
    deleteCookie("myId");
    deleteCookie("lastName");
    deleteCookie("firstName");
    deleteCookie("email");
    window.location.replace("/");
}

function checkAuth() {
    if (getCookie("myId") == null || getCookie("myName") == null)
        window.location.replace("/");
}

window.onload = function () {
    $("#dropdown03").html(getCookie("myName"));
};

$('#tournament-link').addClass('disabled');