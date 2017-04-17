/**
 * Created by Erik on 17. 4. 2017.
 */


document.getElementById('gameType').addEventListener('change', function () {
    var style = this.value == 0 ? 'block' : 'none';
    document.getElementById('bothGames').style.display = style
    var style = this.value == 1 ? 'block' : 'none';
    document.getElementById('8poolGame').style.display = style
    var style = this.value == 2 ? 'block' : 'none';
    document.getElementById('karambolGame').style.display = style

});