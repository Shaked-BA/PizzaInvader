var players = {"p": "testuser"};

// Get the button element from the DOM
var loginButton = document.getElementById("login-btn");

// Add an event listener to the button
loginButton.addEventListener("click", function() {
    if (!validate()) {
        alert("Wrong username or password.");
        return;
    }
    // Space starts the game.
    game.level = 1;
    game.score = 0;
    game.lives = 3;
    game.moveToState(new LevelIntroState(game.level));
    setVisibility('login', 'none');
});

function validate() {
    var un = document.getElementById("username").value;
    var lp = document.getElementById("lpassword").value;

    if (un in players && players[un] === lp) {
        return true;
    }
    return false;
}