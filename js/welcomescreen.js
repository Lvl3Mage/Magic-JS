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


    //Our game title
    let gameTitle = 'Epic Temporary Game Title!';
    let styleTitle = { 
        font: 'bold 60px Arial', 
        fill: '#ffffff', 
        lign: 'center' };
    game.add.text(GAME_STAGE_WIDTH/4, GAME_STAGE_HEIGHT/6, gameTitle, styleTitle);

    //Buttons corresponding to the start, about and configuration respectively
    buttonStart = game.add.button(GAME_STAGE_WIDTH / 2, GAME_STAGE_HEIGHT / 2 - 100, 'start', onStartButtonPressed);
    buttonStart.anchor.setTo(0.5, 0.5);
    buttonStart.onInputOver.add(onButtonHover, this); // Add hover event listener
    buttonStart.onInputOut.add(onButtonOut, this); // Add hover out event listener

    buttonAbout = game.add.button(GAME_STAGE_WIDTH / 2, GAME_STAGE_HEIGHT / 2, 'about', onAboutButtonPressed);
    buttonAbout.anchor.setTo(0.5, 0.5);
    buttonAbout.onInputOver.add(onButtonHover, this); // Add hover event listener
    buttonAbout.onInputOut.add(onButtonOut, this); // Add hover out event listener

    buttonConfig = game.add.button(GAME_STAGE_WIDTH / 2, GAME_STAGE_HEIGHT / 2 + 100, 'config', onConfigButtonPressed);
    buttonConfig.anchor.setTo(0.5, 0.5);
    buttonConfig.onInputOver.add(onButtonHover, this); // Add hover event listener
    buttonConfig.onInputOut.add(onButtonOut, this); // Add hover out event listener
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

function onButtonHover(button) {
    game.add.tween(button.scale).to({ x: 1.1, y: 1.1 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
}

function onButtonOut(button) {
    game.tweens.removeFrom(button.scale);
    button.scale.setTo(1, 1);
}