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