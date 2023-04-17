/*
  PizzaInvaders.js

  the core logic for the space invaders game.

*/

/*  
    Game Class

    The Game class represents a Space Invaders game.
    Create an instance of it, change any of the default values
    in the settings, and call 'start' to run the game.

    Call 'initialise' before 'start' to set the canvas the game
    will draw to.

    Call 'movePlayer' or 'playerFire' to control the player.

    Listen for 'gameWon' or 'gameLost' events to handle the game
    ending.
*/

//  Constants for the keyboard.
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_SPACE = 32;
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_P = 80;

/*
 
  Player

  The player has a position and that's about it.

*/
function Player(x, y, width, height, photo) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.photo = photo;
}

/*
    PlayerBullet

    Fired by the player, they've got a position, velocity and state.

    */
function PlayerBullet(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
}

/*
    InvaderBullet

    Dropped by invaders, they've got position, velocity.

*/
function InvaderBullet(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
}
 
/*
    Invader 

    Invader's have position, type, rank/file and that's about it. 
*/

function Invader(x, y, rank, file, invaderWidth, invaderHeight, type, photo) {
    this.x = x;
    this.y = y;
    this.rank = (20 - (rank * 5));
    this.file = file;
    this.type = type;
    this.width = invaderWidth;
    this.height = invaderHeight;
    this.photo = photo;
}