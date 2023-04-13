// const characterSelect = document.getElementById('character-menu');
var characters = document.querySelectorAll('.character-option, .character-option-billie, .character-option-luna')

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
    //ship sizes acording to id
    game.characterWidth = 67;
    game.characterHeight = 71;
    if(event.currentTarget.id === "rosetta"){
        game.characterWidth = 76;
        game.characterHeight = 60;
    };
    if(event.currentTarget.id === "luna"){
        game.characterWidth = 78;
        game.characterHeight = 74;
    };
    if(event.currentTarget.id === "billie"){
        game.characterWidth = 76;
        game.characterHeight = 50;
    };
    game.selectedCharacterImage = game.characterImages[event.currentTarget.id];
    game.moveToState(new LevelIntroState(game.level));
    starfield.onCharacterSelect();
    setVisibility('character-menu', 'none');
};