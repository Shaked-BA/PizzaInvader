//  Create a PlayState with the game config and the level you are on.
function PlayState(config, level) {
    this.config = config;
    this.level = level;
    this.currentInvaderBullet = null;

    //  Game state.
    this.invaderCurrentVelocity =  10;
    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;
    this.lastPlayerBulletTime = null;

    //  Game entities.
    this.player = null;
    this.invaders = [];
    this.playerBullets = [];
    this.invaderBullets = [];
}

PlayState.prototype.enter = function(game) {
    //debugger;
    //  Create the player.
    var playerImage = new Image();
    playerImage.src = game.selectedCharacterImage;
 
    console.log("bottom:" , game.gameBounds.bottom)
    console.log("top:" , game.gameBounds.top)
    console.log("left:" , game.gameBounds.left)
    console.log("right:" , game.gameBounds.right)
    this.player = new Player(game.width / 2, game.gameBounds.bottom - 50, game.characterWidth, game.characterHeight, playerImage);

    //  Setup initial state.
    this.invaderCurrentVelocity =  10;
    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;

    //  Set the player speed for this level, as well as invader params.
    var levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
    var limitLevel = (this.level < this.config.limitLevelIncrease ? this.level : this.config.limitLevelIncrease);
    this.playerSpeed = this.config.playerSpeed;
    this.invaderInitialVelocity = this.config.invaderInitialVelocity + 1.5 * (levelMultiplier * this.config.invaderInitialVelocity);
    this.invaderBulletRate = this.config.invaderBulletRate + (levelMultiplier * this.config.invaderBulletRate);
    this.invaderBulletMinVelocity = this.config.invaderBulletMinVelocity + (levelMultiplier * this.config.invaderBulletMinVelocity);
    this.invaderBulletMaxVelocity = this.config.invaderBulletMaxVelocity + (levelMultiplier * this.config.invaderBulletMaxVelocity);
    this.playerBulletMaxFireRate = this.config.playerBulletMaxFireRate + 0.4 * limitLevel;

    var invaders = [];
    var invaderPhotos = ['images/clients/character_1.png', 'images/clients/character_2.png', 'images/clients/character_3.png', 'images/clients/character_4.png'];
    var invaderWidth = game.width * 0.08;
    var invaderHeight = game.height * 0.11;

    for (var row = 0; row < 4; row++){
        for (var col = 0; col < 5; col++){
            var photo = new Image();
            photo.src = invaderPhotos[Math.floor(Math.random() * invaderPhotos.length)];
            invaders.push(new Invader((0.25 * game.width) + (col * 0.1 * game.width), (0.1 * game.height * row), row, col, invaderWidth, invaderHeight, 'Invader', photo));
        }
    }
    this.invaders = invaders;
    this.invaderCurrentVelocity = this.invaderInitialVelocity;
    this.invaderVelocity = {x: -this.invaderInitialVelocity, y:0};
    this.invaderNextVelocity = null;
};

PlayState.prototype.update = function(game, dt) {
    
    //  If the left or right arrow keys are pressed, move
    //  the player. Check this on ticks rather than via a keydown
    //  event for smooth movement, otherwise the player would move
    //  more like a text editor caret.
    if(game.pressedKeys[KEY_LEFT]) {
        this.player.x -= this.playerSpeed * dt;
    }
    if(game.pressedKeys[KEY_RIGHT]) {
        this.player.x += this.playerSpeed * dt;
    }
    if(game.pressedKeys[KEY_UP]) {
        this.player.y -= this.playerSpeed * dt;
    }
    if(game.pressedKeys[KEY_DOWN]) {
        this.player.y += this.playerSpeed * dt;
    }
    if(game.pressedKeys[KEY_SPACE]) {
        this.firePlayerBullet();
    }

    //  Keep the player in bounds.
    if(this.player.x < game.gameBounds.left + 20) {
        this.player.x = game.gameBounds.left + 20;
    }
    if(this.player.x > game.gameBounds.right) {
        this.player.x = game.gameBounds.right;
    }

    if(this.player.y > game.gameBounds.bottom - 50) {
        this.player.y = game.gameBounds.bottom - 50;
    }

    if(this.player.y < game.height * 0.6) {
        this.player.y = game.height * 0.6;
    }

    //  Move each invaderBullet.
    for(var i=0; i<this.invaderBullets.length; i++) {
        var invaderBullet = this.invaderBullets[i];
        invaderBullet.y += dt * invaderBullet.velocity;

        //  If the playerBullet has gone off the screen remove it.
        if(invaderBullet.y > game.gameBounds.bottom) {
            this.invaderBullets.splice(i--, 1);
        }
    }

    //  Move each playerBullet.
    for(i=0; i<this.playerBullets.length; i++) {
        var playerBullet = this.playerBullets[i];
        playerBullet.y -= dt * playerBullet.velocity;

        //  If the playerBullet has gone off the screen remove it.
        if(playerBullet.y < 0) {
            this.playerBullets.splice(i--, 1);
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
    
    //  Check for playerBullet/invader collisions.
    for(i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        var bang = false;

        for(var j=0; j<this.playerBullets.length; j++){
            var playerBullet = this.playerBullets[j];

            if(playerBullet.x >= (invader.x - invader.width/2) && playerBullet.x <= (invader.x + invader.width/2) &&
                playerBullet.y >= (invader.y - invader.height/2) && playerBullet.y <= (invader.y + invader.height/2)) {
                
                //  Remove the playerBullet, set 'bang' so we don't process
                //  this playerBullet again.
                this.playerBullets.splice(j--, 1);
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

    //  Give each front rank invader a chance to drop a invaderBullet.
    for(var i=0; i<this.config.invaderFiles; i++) {
        var invader = frontRankInvaders[i];
        if(!invader) continue;
        var chance = this.invaderBulletRate * dt;
        if(chance > Math.random()) {
            if (!this.currentInvaderBullet || this.currentInvaderBullet.y >= game.height * 0.75) {
                //  Fire!
                this.currentInvaderBullet = new InvaderBullet(invader.x, invader.y + invader.height / 2, 
                this.invaderBulletMinVelocity + Math.random()*(this.invaderBulletMaxVelocity - this.invaderBulletMinVelocity))
                this.invaderBullets.push(this.currentInvaderBullet);
            }
        }
    }

    //  Check for invaderBullet/player collisions.
    for(var i=0; i<this.invaderBullets.length; i++) {
        var invaderBullet = this.invaderBullets[i];
        if(invaderBullet.x >= (this.player.x - this.player.width/2) && invaderBullet.x <= (this.player.x + this.player.width/2) &&
                invaderBullet.y >= (this.player.y - this.player.height/2) && invaderBullet.y <= (this.player.y + this.player.height/2)) {
            this.invaderBullets.splice(i--, 1);
            game.lives--;
            if (game.lives > 0) {
                game.sounds.playSound('explosion', 0.5);
            }
            var playerImage = new Image();
            playerImage.src = game.selectedCharacterImage;

            this.player = new Player(game.width / 2, game.gameBounds.bottom - 50, game.characterWidth, game.characterHeight, playerImage);
            if (invaderBullet = this.currentInvaderBullet && this.currentInvaderBullet.y <= game.height * 0.75) {
                this.currentInvaderBullet = null;
            }
        }
                
    }

    //  Check for invader/player collisions.
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        if((invader.x + invader.width/2) > (this.player.x - this.player.width/2) && 
            (invader.x - invader.width/2) < (this.player.x + this.player.width/2) &&
            (invader.y + invader.height/2) > (this.player.y - this.player.height/2) &&
            (invader.y - invader.height/2) < (this.player.y + this.player.height/2)) {
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
    
    // //  Draw player.
    ctx.fillStyle = '#006600';
    ctx.drawImage(this.player.photo, this.player.x, this.player.y, this.player.height, this.player.width);

    //  Draw invaders.
    ctx.fillStyle = '#006600';
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        console.log(invader)
        ctx.drawImage(invader.photo, invader.x, invader.y, invader.width, invader.height);
    }

    //  Draw invaderBullets.
    ctx.fillStyle = '#ff5555';
    for(var i=0; i<this.invaderBullets.length; i++) {
        var photo = new Image();
		photo.src = 'images/bullets/boss_bullet.png';
        var invaderBullet = this.invaderBullets[i];
        ctx.drawImage(photo, invaderBullet.x - 2, invaderBullet.y - 2, 20, 20);
    }

    //  Draw playerBullets.
    ctx.fillStyle = '#ff5555';
    var playerBulletPhotos = ['images/bullets/bullet_1.png', 'images/bullets/bullet_2.png'];
    for(var i=0; i<this.playerBullets.length; i++) {
        var photo = new Image();
        photo.src = playerBulletPhotos[i % 2];
        var playerBullet = this.playerBullets[i];
        ctx.drawImage(photo, playerBullet.x - 2, playerBullet.y - 2, 20, 20);
    }

    // //  Draw info.
    // var textYpos = game.gameBounds.bottom + ((game.height - game.gameBounds.bottom) / 2) + 14/2;
    // ctx.font="14px Arial";
    // ctx.fillStyle = '#ffffff';
    // var info = "Lives: " + game.lives;
    // ctx.textAlign = "left";
    // ctx.fillText(info, game.gameBounds.left, textYpos);
    // info = "Score: " + game.score + ", Level: " + game.level;
    // ctx.textAlign = "right";
    // ctx.fillText(info, game.gameBounds.right, textYpos);

    //  If we're in debug mode, draw bounds.
    if(this.config.debugMode) {
        ctx.strokeStyle = '#ff0000';;
    }

};

PlayState.prototype.keyDown = function(game, keyCode) {

    if(keyCode == KEY_SPACE) {
        //  Fire!
        this.firePlayerBullet();
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

PlayState.prototype.firePlayerBullet = function() {
    //  If we have no last playerBullet time, or the last playerBullet time 
    //  is older than the max playerBullet rate, we can fire.
    if(this.lastPlayerBulletTime === null || ((new Date()).valueOf() - this.lastPlayerBulletTime) > (1000 / this.playerBulletMaxFireRate))
    {   
        //  Add a playerBullet.
        this.playerBullets.push(new PlayerBullet(this.player.x, this.player.y - 12, this.config.playerBulletVelocity));
        this.lastPlayerBulletTime = (new Date()).valueOf();

        //  Play the 'shoot' sound.
        game.sounds.playSound('shoot', 0.5);
    }
};
