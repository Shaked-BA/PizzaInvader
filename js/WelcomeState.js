
function WelcomeState() {

}

WelcomeState.prototype.enter = function(game) {

    // Create and load the sounds.
    game.sounds = new Sounds();
    game.sounds.init();
    game.sounds.loadSound('shoot', 'sounds/SUIII.wav');
    game.sounds.loadSound('enemyShoot', 'sounds/burf.wav');
    game.sounds.loadSound('bang', 'sounds/enemyEat.wav');
    game.sounds.loadSound('explosion', 'sounds/awww-why.wav');
    game.sounds.loadSound('flipflop', 'sounds/flipflop.wav');
    game.sounds.loadSound('click', 'sounds/click.wav');
    game.sounds.loadSound('lose', 'sounds/lose.wav');
    game.sounds.loadSound('pause', 'sounds/excuse_me.wav');
};

WelcomeState.prototype.update = function (game, dt) {


};

WelcomeState.prototype.draw = function(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    // ctx.font="30px Arial";
    // ctx.fillStyle = '#ffffff';
    // ctx.textBaseline="middle"; 
    // ctx.textAlign="center"; 
    // ctx.fillText("PZZA!", game.width / 2, game.height/2 - 40); 
    // ctx.font="16px Arial";

    // ctx.fillText("Press 'Space' or touch to start.", game.width / 2, game.height/2); 
    
    var $menu = $('.Menu'),
    $item = $('.Menu-list-item'),
    w = $(window).width(), //window width
    h = $(window).height(); //window heights

    $(window).on('mousemove', function(e) {
    var offsetX = 0.5 - e.pageX / w, //cursor position X
        offsetY = 0.5 - e.pageY / h, //cursor position Y
        dy = e.pageY - h / 2, //@h/2 = center of poster
        dx = e.pageX - w / 2, //@w/2 = center of poster
        theta = Math.atan2(dy, dx), //angle between cursor and center of poster in RAD
        angle = theta * 180 / Math.PI - 90, //convert rad in degrees
        offsetPoster = $menu.data('offset'),
        transformPoster = 'translate3d(0, ' + -offsetX * offsetPoster + 'px, 0) rotateX(' + (-offsetY * offsetPoster) + 'deg) rotateY(' + (offsetX * (offsetPoster * 2)) + 'deg)'; //poster transform

    //get angle between 0-360
    if (angle < 0) {
        angle = angle + 360;
    }

    //poster transform
    $menu.css('transform', transformPoster);

    //parallax for each layer
    $item.each(function() {
        var $this = $(this),
            offsetLayer = $this.data('offset') || 0,
            transformLayer = 'translate3d(' + offsetX * offsetLayer + 'px, ' + offsetY * offsetLayer + 'px, 20px)';

        $this.css('transform', transformLayer);
    });
    });

};

// WelcomeState.prototype.keyDown = function(game, keyCode) {
//     if(keyCode == KEY_SPACE) {
//         //  Space starts the game.
//         game.level = 1;
//         game.score = 0;
//         game.lives = 3;
//         game.moveToState(new LevelIntroState(game.level));
//     }
// };