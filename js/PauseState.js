function PauseState() {

}

PauseState.prototype.keyDown = function(game, keyCode) {

    if(keyCode == KEY_P) {
        //  Pop the pause state.
        game.popState();
        var gameAudioPlayer = document.getElementById('game-audio-player');
        gameAudioPlayer.play();
    }
};

PauseState.prototype.draw = function(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    var photo = new Image();
    photo.src = 'images/puase.png';
    ctx.drawImage(photo, game.width / 5, game.height / 7, 500, 500);

    // ctx.font="14px Arial";
    // ctx.fillStyle = '#ffffff';
    // ctx.textBaseline="middle";
    // ctx.textAlign="center";
    // ctx.fillText("Paused", game.width / 2, game.height/2);
    return;
};