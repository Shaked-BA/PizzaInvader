/*
	Starfield lets you take a div and turn it into a starfield.

*/

//	Define the starfield class.
function Starfield() {
	this.fps = 30;
	this.canvas = null;
	this.width = 0;
	this.height = 0;
	this.minVelocity = 15;
	this.maxVelocity = 30;
	this.stars = 100;
	this.intervalId = 0;
}

//	The main function - initialises the starfield.
Starfield.prototype.initialise = function(div) {
	var self = this;

	//	Store the div.
	this.containerDiv = div;
	self.width = window.innerWidth;
	self.height = window.innerHeight;

	// window.onresize = function(event) {
	// 	self.width = window.innerWidth;
	// 	self.height = window.innerHeight;
	// 	self.canvas.width = self.width;
	// 	self.canvas.height = self.height;
	// 	self.draw();
 	// }

	//	Create the canvas.
	var canvas = document.createElement('canvas');
	div.appendChild(canvas);
	this.canvas = canvas;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
};

Starfield.prototype.start = function() {

	//	Create the stars.
	var stars = [];
	for(var i=0; i<this.stars; i++) {
		stars[i] = new Star(Math.random()*this.width, Math.random()*this.height, Math.random()*50+1,
		 (Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
	this.stars = stars;

	var self = this;
	//	Start the timer.
	this.intervalId = setInterval(function() {
		self.update();
		self.draw();	
	}, 1000 / this.fps);
};

Starfield.prototype.stop = function() {
	clearInterval(this.intervalId);
};

Starfield.prototype.update = function() {
	var dt = 1 / this.fps;

	for(var i=0; i<this.stars.length; i++) {
		var star = this.stars[i];
		star.y += dt * star.velocity;
		//	If the star has moved from the bottom of the screen, spawn it at the top.
		if(star.y > this.height) {
			this.stars[i] = new Star(Math.random()*this.width, 0, Math.random()*50+1, 
		 	(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
};

Starfield.prototype.draw = function() {

	//	Get the drawing context.
	var ctx = this.canvas.getContext("2d");

	//	Draw the background.
 	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, this.width, this.height);

	//	Draw photos.
	var photos = ['images/stars/half_pizza.png', 'images/stars/pizza_stars.png', 'images/stars/pizza_stars_2.png', 'images/stars/pizza_star_3.png'];
	for(var i=0; i<this.stars.length;i++) {
		var photo = new Image();
		photo.src = photos[i % 4];
		var star = this.stars[i];
		ctx.drawImage(photo, star.x, star.y, star.size, star.size);
	}
};

Starfield.prototype.drawPlayingBackground = function() {
	var ctx = this.canvas.getContext("2d");

	// var photo = new Image();
	// photo.src = 'images/background.png';
	// photo.width = window.innerWidth;
	// photo.height = window.innerHeight;
	// ctx.drawImage(photo, 0,0);
}

Starfield.prototype.clear = function() {
	var ctx = this.canvas.getContext("2d");
	ctx.clearRect(0, 0, this.width, this.height);
}

Starfield.prototype.onCharacterSelect = function() {
	this.stop();
	this.clear();
	this.drawPlayingBackground();
	switchMusic();
}

var switchMusic = function() {
	var menuAudioPlayer = document.getElementById('menu-audio-player');
	menuAudioPlayer.pause();
	var gameAudioPlayer = document.getElementById('game-audio-player');
	gameAudioPlayer.play();
}

function Star(x, y, size, velocity) {
	this.x = x;
	this.y = y; 
	this.size = size;
	this.velocity = velocity;
}