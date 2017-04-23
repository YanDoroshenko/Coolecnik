String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

// timer for HTML timer - starts from 0
function countTimer() {
    var minute = parseInt($("#timerM").text());
    var seconds = parseInt($("#timerS").text());
    seconds++;
    if (seconds === 60) {
        minute++;
        seconds = 0;
    }
    $("#timerM").html(minute);
    $("#timerS").html(seconds);

    var timeObj = {
        "m": $("#timerM").text(),
        "s": $("#timerS").text()
    };
    localStorage.setItem("savedTime", JSON.stringify(timeObj));
}

// timer for HTML timer - starts from secStart
function countTimer1() {
    ++totalSeconds;
    var hour = Math.floor(totalSeconds / 3600);
    var minute = Math.floor((totalSeconds - hour * 3600) / 60);
    var seconds = totalSeconds - (hour * 3600 + minute * 60);

    document.getElementById("timer").innerHTML = minute + "m : " + seconds + "s";
}

// generate hash for pass
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