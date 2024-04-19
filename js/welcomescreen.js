//Creating a display screen for the initial welcome screen
let welcomeState = {
    preload: loadassets,
    create: display
};

function loadassets() { //THESE ASSETS ARE CURRENTLY TEMPORARY AND WILL BE DRAWN LATER
    // Load the background image
    game.load.image('background', 'assets/imgs/stars.png');
    // Load the necessary buttons
    //Those being the start button, about and configutration
    game.load.image('start', 'assets/imgs/TEMPORARY IMAGES/playButton.png');
    game.load.image('about', 'assets/imgs/TEMPORARY IMAGES/aboutButton.png');
    game.load.image('config', 'assets/imgs/TEMPORARY IMAGES/configButton.png');
}

let buttonStart, buttonAbout, buttonConfig;

function display() {
    game.input.enabled = true;
    game.add.image(0,0, 'background');

    buttonStart = game.add.button(GAME_STAGE_WIDTH / 2, GAME_STAGE_HEIGHT / 2 - 100, 'start', onStartButtonPressed);
    buttonStart.anchor.setTo(0.5, 0.5);
    buttonAbout = game.add.button(GAME_STAGE_WIDTH / 2, GAME_STAGE_HEIGHT / 2, 'about', onAboutButtonPressed);
    buttonAbout.anchor.setTo(0.5, 0.5);
    buttonConfig = game.add.button(GAME_STAGE_WIDTH / 2, GAME_STAGE_HEIGHT / 2 + 100, 'config', onConfigButtonPressed);
    buttonConfig.anchor.setTo(0.5, 0.5);
}


function onStartButtonPressed() {
    game.state.start('start');
}
function onAboutButtonPressed() {
    game.state.start('about');
}
function onConfigButtonPressed() {
    game.state.start('config');
}