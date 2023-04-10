// Get the button element from the DOM
var loginButton = document.getElementById("login-btn");

// Add an event listener to the button
loginButton.addEventListener("click", function() {
    // Space starts the game.
    game.level = 1;
    game.score = 0;
    game.lives = 3;
    game.moveToState(new LevelIntroState(game.level));
    setVisibility('login', 'none');
});