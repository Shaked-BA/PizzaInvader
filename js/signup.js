var Days = [31,28,31,30,31,30,31,31,30,31,30,31];// index => month [0-11]
$(document).ready(function(){
    var option = '<option value="day">day</option>';
    var selectedDay="day";
    for (var i=1;i <= Days[0];i++){ //add option days
        option += '<option value="'+ i + '">' + i + '</option>';
    }
    $('#day').append(option);
    $('#day').val(selectedDay);

    var option = '<option value="month">month</option>';
    var selectedMon ="month";
    for (var i=1;i <= 12;i++){
        option += '<option value="'+ i + '">' + i + '</option>';
    }
    $('#month').append(option);
    $('#month').val(selectedMon);

    var option = '<option value="month">month</option>';
    var selectedMon ="month";
    for (var i=1;i <= 12;i++){
        option += '<option value="'+ i + '">' + i + '</option>';
    }
    $('#month2').append(option);
    $('#month2').val(selectedMon);
  
    var d = new Date();
    var option = '<option value="year">year</option>';
    selectedYear ="year";
    for (var i=1930;i <= d.getFullYear();i++){// years start i
        option += '<option value="'+ i + '">' + i + '</option>';
    }
    $('#year').append(option);
    $('#year').val(selectedYear);
});
function isLeapYear(year) {
    year = parseInt(year);
    if (year % 4 != 0) {
	      return false;
	  } else if (year % 400 == 0) {
	      return true;
	  } else if (year % 100 == 0) {
	      return false;
	  } else {
	      return true;
	  }
}

function change_year(select)
{
    if( isLeapYear( $(select).val() ) )
	  {
		    Days[1] = 29;
		    
    }
    else {
        Days[1] = 28;
    }
    if( $("#month").val() == 2)
		    {
			       var day = $('#day');
			       var val = $(day).val();
			       $(day).empty();
			       var option = '<option value="day">day</option>';
			       for (var i=1;i <= Days[1];i++){ //add option days
				         option += '<option value="'+ i + '">' + i + '</option>';
             }
			       $(day).append(option);
			       if( val > Days[ month ] )
			       {
				          val = 1;
			       }
			       $(day).val(val);
		     }
  }

function change_month(select) {
    var day = $('#day');
    var val = $(day).val();
    $(day).empty();
    var option = '<option value="day">day</option>';
    var month = parseInt( $(select).val() ) - 1;
    for (var i=1;i <= Days[ month ];i++){ //add option days
        option += '<option value="'+ i + '">' + i + '</option>';
    }
    $(day).append(option);
    if( val > Days[ month ] )
    {
        val = 1;
    }
    $(day).val(val);
}

// Get the button element from the DOM
var signupButton = document.getElementById("signup-btn");

// Add an event listener to the button
signupButton.addEventListener("click", function() {
    if (!verify()) {
        return;
    }
    var u = document.getElementById("susername").value;
    var p = document.getElementById("password").value;
    game.players[u] = p;

    // Successful sign up leads to character menu.
    
    // game.moveToState(new LevelIntroState(game.level));
    setVisibility('signup', 'none');
    setVisibility('character-menu', 'flex');
});

function verify() {
    // if (!verifyAllFields()) {
    //     alert("All fields must be filled.");
    //     return false;
    // }
    // if (!verifyPassword()) {
    //     alert("Password must be 8-characters long and contain numbers and letters.");
    //     return false;
    // }
    // if (!verifyFirstName()) {
    //     alert("First name must not contain numbers.");
    //     return false;
    // }
    // if (!verifyLastName()) {
    //     alert("Last name must not contain numbers.");
    //     return false;
    // }
    // if (!verifyEmail()) {
    //     alert("Invalid email address.");
    //     return false;
    // }
    // if (!verifyIdenticalPasswords()) {
    //     alert("Passwords are not identical.");
    //     return false;
    // }
    return true;
}

// Verify all fields have been filled.
function verifyAllFields() {
    var fn = document.getElementById("firstName").value;
    var ln = document.getElementById("lastName").value;
    var p = document.getElementById("password").value;
    var rp = document.getElementById("repassword").value;
    var e = document.getElementById("email").value;

    if (fn.length === 0 || ln.length === 0 || p.length === 0 || rp.length === 0 || e.length === 0) {
        return false;
    }

    var y = document.getElementById("year").value;
    var m = document.getElementById("month").value;
    var d = document.getElementById("day").value;
    if (y === "year" || m === "month" || d === "day") {
        return false;
    }

    return true;
};

// Check if the password 8-characters long and contains numbers and letters.
function verifyPassword() {
    var p = document.getElementById("password").value;

    if (p.length < 8 || !/\d/.test(p) || !/[a-zA-Z]/g.test(p)) {
        return false;
    }
    return true;
};

// Check if the first name is not empty and does not contain numbers.
function verifyFirstName() {
    var fn = document.getElementById("firstName").value;

    if (/^\d+$/.test(fn)) {
        return false;
    }
    return true;
};

// Check if the last name is not empty and does not contain numbers.
function verifyLastName() {
    var ln = document.getElementById("lastName").value;

    if (/^\d+$/.test(ln)) {
        return false;
    }
    return true;
};

// Verify email.
function verifyEmail() {
    var e = document.getElementById("email").value;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e)) {
      return true;
    }
    return false;
};

// Check if the passwords are identical.
function verifyIdenticalPasswords() {
    var p = document.getElementById("password").value;
    var rp = document.getElementById("repassword").value;

    if (p !== rp) {
        return false;
    }
    return true;
};