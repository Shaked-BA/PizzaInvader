// Get the button element from the DOM
var loginButton = document.getElementById("login-btn");

loginButton.addEventListener("click", onLogin);

// Add an event listener to the button
function onLogin() {
    if (!validate()) {
        alert("Wrong username or password.");
        return;
    }
    // Successful login leads to character menu.
    setVisibility('login', 'none');
    setVisibility('character-menu', 'flex');
};

function validate() {
    var un = document.getElementById("username").value;
    var lp = document.getElementById("lpassword").value;

    if (un in game.players && game.players[un] === lp) {
        return true;
    }
    return false;
}