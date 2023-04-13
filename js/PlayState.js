//  Create a PlayState with the game config and the level you are on.
function PlayState(config, level) {
    this.config = config;
    this.level = level;
    this.currentBomb = null;

    //  Game state.
    this.invaderCurrentVelocity =  10;
    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;
    this.lastRocketTime = null;

    //  Game entities.
    this.ship = null;
    this.invaders = [];
    this.rockets = [];
    this.bombs = [];
}



PlayState.prototype.enter = function(game) {
    //debugger;
    //  Create the ship.
    var shipImage = new Image();
    shipImage.src = game.selectedCharacterImage;
 

    this.ship = new Ship(game.width / 2, game.gameBounds.bottom, game.characterWidth, game.characterHeight, shipImage);

    //  Setup initial state.
    this.invaderCurrentVelocity =  10;
    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;

    //  Set the ship speed for this level, as well as invader params.
    var levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
    var limitLevel = (this.level < this.config.limitLevelIncrease ? this.level : this.config.limitLevelIncrease);
    this.shipSpeed = this.config.shipSpeed;
    this.invaderInitialVelocity = this.config.invaderInitialVelocity + 1.5 * (levelMultiplier * this.config.invaderInitialVelocity);
    this.bombRate = this.config.bombRate + (levelMultiplier * this.config.bombRate);
    this.bombMinVelocity = this.config.bombMinVelocity + (levelMultiplier * this.config.bombMinVelocity);
    this.bombMaxVelocity = this.config.bombMaxVelocity + (levelMultiplier * this.config.bombMaxVelocity);
    this.rocketMaxFireRate = this.config.rocketMaxFireRate + 0.4 * limitLevel;

    // //  Create the invaders.
    // var ranks = this.config.invaderRanks + 0.1 * limitLevel;
    // var files = this.config.invaderFiles + 0.2 * limitLevel;
    // var invaders = [];
    // for(var rank = 0; rank < ranks; rank++){
    //     for(var file = 0; file < files; file++) {
    //         invaders.push(new Invader(
    //             (game.width / 2) + ((files/2 - file) * 200 / files),
    //             (game.gameBounds.top + rank * 20),
    //             rank, file, 'Invader'));
    //     }
    // }
    var invaders = [];
    var invaderPhotos = ['images/clients/character_1.png', 'images/clients/character_2.png', 'images/clients/character_3.png', 'images/clients/character_4.png'];
    for (var row = 0; row < 4; row++){
        for (var col = 0; col < 5; col++){
            var photo = new Image();
            photo.src = invaderPhotos[Math.floor(Math.random() * invaderPhotos.length)];
            invaders.push(new Invader((game.width / 2) + ((2 - col) * 85), (game.gameBounds.top + row * 65), row, col, 'Invader', photo));
        }
    }
    this.invaders = invaders;
    this.invaderCurrentVelocity = this.invaderInitialVelocity;
    this.invaderVelocity = {x: -this.invaderInitialVelocity, y:0};
    this.invaderNextVelocity = null;
};

PlayState.prototype.update = function(game, dt) {
    
    //  If the left or right arrow keys are pressed, move
    //  the ship. Check this on ticks rather than via a keydown
    //  event for smooth movement, otherwise the ship would move
    //  more like a text editor caret.
    if(game.pressedKeys[KEY_LEFT]) {
        this.ship.x -= this.shipSpeed * dt;
    }
    if(game.pressedKeys[KEY_RIGHT]) {
        this.ship.x += this.shipSpeed * dt;
    }
    if(game.pressedKeys[KEY_UP]) {
        this.ship.y -= this.shipSpeed * dt;
    }
    if(game.pressedKeys[KEY_DOWN]) {
        this.ship.y += this.shipSpeed * dt;
    }
    if(game.pressedKeys[KEY_SPACE]) {
        this.fireRocket();
    }

    //  Keep the ship in bounds.
    if(this.ship.x < game.gameBounds.left + 20) {
        this.ship.x = game.gameBounds.left + 20;
    }
    if(this.ship.x > game.gameBounds.right) {
        this.ship.x = game.gameBounds.right;
    }

    if(this.ship.y > game.gameBounds.bottom) {
        this.ship.y = game.gameBounds.bottom;
    }

    if(this.ship.y < game.gameCanvas.height * 0.6) {
        this.ship.y = game.gameCanvas.height * 0.6;
    }

    //  Move each bomb.
    for(var i=0; i<this.bombs.length; i++) {
        var bomb = this.bombs[i];
        bomb.y += dt * bomb.velocity;

        //  If the rocket has gone off the screen remove it.
        if(bomb.y > this.height) {
            this.bombs.splice(i--, 1);
        }
    }

    //  Move each rocket.
    for(i=0; i<this.rockets.length; i++) {
        var rocket = this.rockets[i];
        rocket.y -= dt * rocket.velocity;

        //  If the rocket has gone off the screen remove it.
        if(rocket.y < 0) {
            this.rockets.splice(i--, 1);
        }
    }

    //  Move the invaders.
    var hitLeft = false, hitRight = false, hitBottom = false;
    for(i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        var newx = invader.x + this.invaderVelocity.x * dt;
        var newy = invader.y + this.invaderVelocity.y * dt;
        if(hitLeft == false && newx < game.gameBounds.left) {
            hitLeft = true;
        }
        else if(hitRight == false && newx > game.gameBounds.right) {
            hitRight = true;
        }
        else if(hitBottom == false && newy > game.gameBounds.bottom) {
            hitBottom = true;
        }

        if(!hitLeft && !hitRight && !hitBottom) {
            invader.x = newx;
            invader.y = newy;
        }
    }

    //  Update invader velocities.
    if(this.invadersAreDropping) {
        this.invaderCurrentDropDistance += this.invaderVelocity.y * dt;
        if(this.invaderCurrentDropDistance >= this.config.invaderDropDistance) {
            this.invadersAreDropping = false;
            this.invaderVelocity = this.invaderNextVelocity;
            this.invaderCurrentDropDistance = 0;
        }
    }
    //  If we've hit the left, move down then right.
    if(hitLeft) {
        this.invaderCurrentVelocity += this.config.invaderAcceleration;
        this.invaderVelocity = {x: 0, y:this.invaderCurrentVelocity };
        this.invadersAreDropping = true;
        this.invaderNextVelocity = {x: this.invaderCurrentVelocity , y:0};
    }
    //  If we've hit the right, move down then left.
    if(hitRight) {
        this.invaderCurrentVelocity += this.config.invaderAcceleration;
        this.invaderVelocity = {x: 0, y:this.invaderCurrentVelocity };
        this.invadersAreDropping = true;
        this.invaderNextVelocity = {x: -this.invaderCurrentVelocity , y:0};
    }
    //  If we've hit the bottom, it's game over.
    if(hitBottom) {
        game.lives = 0;
    }
    
    //  Check for rocket/invader collisions.
    for(i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        var bang = false;

        for(var j=0; j<this.rockets.length; j++){
            var rocket = this.rockets[j];

            if(rocket.x >= (invader.x - invader.width/2) && rocket.x <= (invader.x + invader.width/2) &&
                rocket.y >= (invader.y - invader.height/2) && rocket.y <= (invader.y + invader.height/2)) {
                
                //  Remove the rocket, set 'bang' so we don't process
                //  this rocket again.
                this.rockets.splice(j--, 1);
                bang = true;
                game.score += this.config.pointsPerInvader;
                break;
            }
        }
        if(bang) {
            this.invaders.splice(i--, 1);
            game.sounds.playSound('bang', 0.5);
        }
    }

    //  Find all of the front rank invaders.
    var frontRankInvaders = {};
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        //  If we have no invader for game file, or the invader
        //  for game file is futher behind, set the front
        //  rank invader to game one.
        if(!frontRankInvaders[invader.file] || frontRankInvaders[invader.file].rank < invader.rank) {
            frontRankInvaders[invader.file] = invader;
        }
    }

    //  Give each front rank invader a chance to drop a bomb.
    for(var i=0; i<this.config.invaderFiles; i++) {
        var invader = frontRankInvaders[i];
        if(!invader) continue;
        var chance = this.bombRate * dt;
        if(chance > Math.random()) {
            if (!this.currentBomb || this.currentBomb.y >= game.gameCanvas.height * 0.75) {
                //  Fire!
                this.currentBomb = new Bomb(invader.x, invader.y + invader.height / 2, 
                this.bombMinVelocity + Math.random()*(this.bombMaxVelocity - this.bombMinVelocity))
                this.bombs.push(this.currentBomb);
            }
        }
    }

    //  Check for bomb/ship collisions.
    for(var i=0; i<this.bombs.length; i++) {
        var bomb = this.bombs[i];
        if(bomb.x >= (this.ship.x - this.ship.width/2) && bomb.x <= (this.ship.x + this.ship.width/2) &&
                bomb.y >= (this.ship.y - this.ship.height/2) && bomb.y <= (this.ship.y + this.ship.height/2)) {
            this.bombs.splice(i--, 1);
            game.lives--;
            if (game.lives > 0) {
                game.sounds.playSound('explosion', 0.5);
            }
            var shipImage = new Image();
            shipImage.src = game.selectedCharacterImage;

            this.ship = new Ship(game.width / 2, game.gameBounds.bottom, game.characterWidth, game.characterHeight, shipImage);
            if (bomb = this.currentBomb && this.currentBomb.y <= game.gameCanvas.height * 0.75) {
                this.currentBomb = null;
            }
        }
                
    }

    //  Check for invader/ship collisions.
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        if((invader.x + invader.width/2) > (this.ship.x - this.ship.width/2) && 
            (invader.x - invader.width/2) < (this.ship.x + this.ship.width/2) &&
            (invader.y + invader.height/2) > (this.ship.y - this.ship.height/2) &&
            (invader.y - invader.height/2) < (this.ship.y + this.ship.height/2)) {
            //  Dead by collision!
            game.lives = 0;
        }
    }

    //  Check for failure
    if(game.lives <= 0) {
        //  Play the 'lose' sound.
        game.sounds.playSound('lose', 1.5);

        game.moveToState(new GameOverState());
    }

    // TODO - change the level update to changing the speed every 5 seconds + speeding up the nusic + can add boss 
    //  Check for victory
    if(this.invaders.length === 0) {
        game.score += this.level * 50;
        game.level += 1;
        game.moveToState(new LevelIntroState(game.level));
    }
};

PlayState.prototype.draw = function(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);
    
    // //  Draw ship.
    ctx.fillStyle = '#006600';
    // ctx.fillRect(this.ship.x - (this.ship.width / 2), this.ship.y - (this.ship.height / 2), this.ship.width, this.ship.height);
    ctx.drawImage(this.ship.photo, this.ship.x, this.ship.y, this.ship.height, this.ship.width);

    //  Draw invaders.
    ctx.fillStyle = '#006600';
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        ctx.drawImage(invader.photo, invader.x - 2, invader.y - 2, invader.height, invader.width);
    }

    //  Draw bombs.
    ctx.fillStyle = '#ff5555';
    for(var i=0; i<this.bombs.length; i++) {
        var photo = new Image();
		photo.src = 'images/bullets/boss_bullet.png';
        var bomb = this.bombs[i];
        ctx.drawImage(photo, bomb.x - 2, bomb.y - 2, 20, 20);
    }

    //  Draw rockets.
    ctx.fillStyle = '#ff5555';
    var rocketPhotos = ['images/bullets/bullet_1.png', 'images/bullets/bullet_2.png'];
    for(var i=0; i<this.rockets.length; i++) {
        var photo = new Image();
        photo.src = rocketPhotos[i % 2];
        var rocket = this.rockets[i];
        ctx.drawImage(photo, rocket.x - 2, rocket.y - 2, 20, 20);
    }

    //  Draw info.
    var textYpos = game.gameBounds.bottom + ((game.height - game.gameBounds.bottom) / 2) + 14/2;
    ctx.font="14px Arial";
    ctx.fillStyle = '#ffffff';
    var info = "Lives: " + game.lives;
    ctx.textAlign = "left";
    ctx.fillText(info, game.gameBounds.left, textYpos);
    info = "Score: " + game.score + ", Level: " + game.level;
    ctx.textAlign = "right";
    ctx.fillText(info, game.gameBounds.right, textYpos);

    //  If we're in debug mode, draw bounds.
    if(this.config.debugMode) {
        ctx.strokeStyle = '#ff0000';
        ctx.strokeRect(0,0,game.width, game.height);
        ctx.strokeRect(game.gameBounds.left, game.gameBounds.top,
            game.gameBounds.right - game.gameBounds.left,
            game.gameBounds.bottom - game.gameBounds.top);
    }

};

PlayState.prototype.keyDown = function(game, keyCode) {

    if(keyCode == KEY_SPACE) {
        //  Fire!
        this.fireRocket();
    }
    if(keyCode == KEY_P) {
        //  Push the pause state.
        var gameAudioPlayer = document.getElementById('game-audio-player');
        gameAudioPlayer.pause();
        game.sounds.playSound('pause', 2.3);
        game.pushState(new PauseState());
    }
};

PlayState.prototype.keyUp = function(game, keyCode) {

};

PlayState.prototype.fireRocket = function() {
    //  If we have no last rocket time, or the last rocket time 
    //  is older than the max rocket rate, we can fire.
    if(this.lastRocketTime === null || ((new Date()).valueOf() - this.lastRocketTime) > (1000 / this.rocketMaxFireRate))
    {   
        //  Add a rocket.
        this.rockets.push(new Rocket(this.ship.x, this.ship.y - 12, this.config.rocketVelocity));
        this.lastRocketTime = (new Date()).valueOf();

        //  Play the 'shoot' sound.
        game.sounds.playSound('shoot', 0.5);
    }
};
