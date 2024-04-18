//Creating a display screen for the initial welcome screen
let welcomeState = {
    preload: loadassets,
    create: display
};

function loadassets() {
    // Load the background image
    game.load.image('background', 'assets/background.png');
    // Load the necessary buttons
    //Those being the start button, about and instructions
    game.load.image('start', 'assets/start.png');
    game.load.image('about', 'assets/about.png');
    game.load.image('instructions', 'assets/instructions.png');
}

let buttonStart, buttonAbout, buttonInstructions;

function display() {
    buttonStart = game.add.button(GAME_STAGE_WIDTH / 2, GAME_STAGE_HEIGHT / 2 - 100, 'start', startGame);
    buttonStart.anchor.setTo(0.5, 0.5);
    buttonAbout = game.add.button(GAME_STAGE_WIDTH / 2, GAME_STAGE_HEIGHT / 2, 'about', aboutGame);
    buttonAbout.anchor.setTo(0.5, 0.5);
    buttonInstructions = game.add.button(GAME_STAGE_WIDTH / 2, GAME_STAGE_HEIGHT / 2 + 100, 'instructions', instructionsGame);
    buttonInstructions.anchor.setTo(0.5, 0.5);
}