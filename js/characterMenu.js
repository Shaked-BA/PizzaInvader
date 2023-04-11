// const characterSelect = document.getElementById('character-menu');
var characters = document.querySelectorAll('.character-option')

characters.forEach(function (element) {
	element.addEventListener("mouseenter", function () {onCharacterMouseEnter(element)});
    element.addEventListener("click", onCharacterClick)
});

var onCharacterMouseEnter = function(element) {
    var currentHighlight = document.querySelector(".highlight");
    currentHighlight.classList.toggle("highlight");
    element.classList.toggle("highlight");
};

var onCharacterClick = function(event) {
    game.selectedCharacterImage = game.characterImages[event.currentTarget.id];
    game.moveToState(new LevelIntroState(game.level));
    starfield.onCharacterSelect()
    setVisibility('character-menu', 'none');
};