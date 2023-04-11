// Get the button element from the DOM
var loginButton = document.getElementById("login-btn");

// Add an event listener to the button
function onLogin() {
    if (!validate()) {
        alert("Wrong username or password.");
        return;
    }
    // Successful login starts the game.
    game.level = 1;
    game.score = 0;
    game.lives = 3;
    game.moveToState(new LevelIntroState(game.level));
    setVisibility('login', 'none');
};

function validate() {
    var un = document.getElementById("username").value;
    var lp = document.getElementById("lpassword").value;

    if (un in game.players && game.players[un] === lp) {
        return true;
    }
    return false;
}