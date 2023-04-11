const characterSelect = document.getElementById('character-menu');
const characters = document.querySelectorAll('.character-option')

characters.forEach(element => {
	element.addEventListener("mouseenter", () => {
		var currentHighlight = document.querySelector(".highlight");
		currentHighlight.classList.toggle("highlight");
		element.classList.toggle("highlight");
	});
});


const click = () => {




    game.moveToState(new LevelIntroState(game.level));
}


