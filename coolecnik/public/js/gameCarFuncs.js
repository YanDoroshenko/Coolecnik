function setCarCounters(goodOrBad) {
    if (activePlayer === 1) {
        var preparedStr = "#pl1" + goodOrBad + "c";
        $(preparedStr).html(parseInt($(preparedStr).text()) + 1);
    }
    else {
        var preparedStr = "#pl2" + goodOrBad + "c";
        $(preparedStr).html(parseInt($(preparedStr).text()) + 1);
    }
}


function carGameRoutine(strikeTime, changePlayer, badOrGood) {
    savePoolStrike(strikeTime);


    if (badOrGood !== undefined)
        setCarCounters(badOrGood);
    else {
        setCarCounters(changePlayer);
    }

    if (changePlayer === "true") {
        activePlayer = (activePlayer === 1) ? 0 : 1;
        setActivePlayerOnScreen();
    }

    localStorage.setItem("activePlayer", activePlayer);

    var savedCounterValues = poolGetSavedCounterValuesObjs();


    localStorage.setItem("savedCounterValues", JSON.stringify(savedCounterValues));

    console.log("--currentGame        ", JSON.parse(localStorage.getItem("currentGame")));
    console.log("--savedCounterValues ", savedCounterValues);

}