var num = 0;

var inp1 = "<div><span id='first'><input type='text' placeholder='Name' class='form-control' id='pl";
var inp2 = "' required style='width: 57%; display: inline;'>"

var inp4 = "<span id='second'><input type='password' placeholder='Password' class='form-control' id='pl";
var inp5 = "pass' required style='width: 57%; display: inline;'>";
var inp6 = "<button class='btn btn-lg btn-danger btn-block btn-sm remove' id='newPlayer' style='margin-left: 3%; width: 25%; display: inline;'>Remove</button></span>";
var inp8 = "<button class='btn btn-lg btn-success green-btn btn-block btn-sm user' style='margin-left: 3%; width: 10%; display: inline;'><span class='icon-user'></span> </button>";
var inp7 = "<hr class='hr-green'/> <div>"
var inp9 = "<button class='btn btn-lg btn-success btn-block btn-sm' id='auth' style='margin-left: 3%; width: 28%; display: inline;'>Login</button> </span>";

/*
var inp1 = "<input type='text' placeholder='Name' class='form-control' id='pl";
var inp2 = "' required style='width: 60%; display: inline;'>"
var inp3 = "<div class='checkbox' style='display: inline; margin-left: 5%;'><label><input type='checkbox' class='cbPl' value='remember-me'> Registered</label></div>";

var inp4 = "<input type='password' placeholder='Password' class='form-control' id='pl";
var inp5 = "pass' required style='width: 60%; display: inline;'>";
var inp6 = "<button class='btn btn-lg btn-warning green-btn btn-block btn-sm' id='newPlayer' style='margin-left: 5%; width: 10%; display: inline;'><span class='glyphicon glyphicon-heart'></span></button>";
var inp7 = "<button class='btn btn-lg btn-warning green-btn btn-block btn-sm' id='newPlayer' style='margin-left: 5%; width: 10%; display: inline;'><span class='glyphicon glyphicon-trash'></span> </button>";
var inp8 = "<hr class='hr-green'/>"
*/

        

$(function() {
    $("#newPlayer").click(function(){
        num++;
        var input = inp1 + num + inp2 + inp8 + inp6 + inp7;
        $(this).before(input);
    });
});

$(document).on('click', '.user', function () {
	    var input = inp4 + num + inp5 + inp9;
	    //var input = inp7;
        $(this).parent().after(input);
	
});

$(document).on('click', '.remove', function () {
        $(this).parent().parent().remove();
	
});
