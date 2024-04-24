//Creating a display screen for the initial welcome screen
let welcomeState = {
    preload: loadassets,
    create: display
};

function loadassets() {
    // Load the background image and title
    //game.load.image('', 'assets/imgs/stars.png');
    game.load.image('title', 'assets/imgs/Titles/TITLE.png');
    game.load.image('scrollDecor', 'assets/imgs/Titles/SCROLL.png');

    // Load the necessary buttons
    //Those being the start button, about and configutration
    game.load.image('start', 'assets/imgs/Buttons/playButton.png');
    game.load.image('about', 'assets/imgs/TEMPORARY IMAGES/aboutButton.png');
    game.load.image('config', 'assets/imgs/TEMPORARY IMAGES/configButton.png');
}

let buttonStart, buttonAbout, buttonConfig;

function display() {
    game.camera.flash(0x000000, 1000); //Game fades in

    game.input.enabled = true;
    //game.add.image(0,0, 'background'); (NO BACKGROUND YET!)

    //Our game title
    title = game.add.image(game.camera.width / 2, 40, 'title');
    title.anchor.setTo(0.5, 0);
    game.add.tween(title).to({ y: title.y + 10 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

    scroll = game.add.image(game.camera.width / 2, 250, 'scrollDecor');
    scroll.anchor.setTo(0.5, 0);
    game.add.tween(scroll).to({ y: scroll.y + 20 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

    //Buttons corresponding to the start, about and configuration respectively
    buttonStart = game.add.text(game.camera.width / 2, game.camera.height / 2 , 'Play', { font: '70px Merryweather', fill: '#000000' });
    buttonStart.anchor.setTo(0.5, 0.5);
    buttonStart.inputEnabled = true;
    buttonStart.events.onInputDown.add(onStartButtonPressed, this); // Add click event listener
    buttonStart.events.onInputOver.add(onButtonHover, this); // Add hover event listener
    buttonStart.events.onInputOut.add(onButtonOut, this); // Add hover out event listener

    buttonAbout = game.add.text(game.camera.width / 2, game.camera.height / 2 + 100, 'About', { font: '70px Merryweather', fill: '#000000' });
    buttonAbout.anchor.setTo(0.5, 0.5);
    buttonAbout.inputEnabled = true;
    buttonAbout.events.onInputDown.add(onAboutButtonPressed, this); // Add click event listener
    buttonAbout.events.onInputOver.add(onButtonHover, this); // Add hover event listener
    buttonAbout.events.onInputOut.add(onButtonOut, this); // Add hover out event listener

    buttonConfig = game.add.text(game.camera.width / 2, game.camera.height / 2 + 200, 'Config', { font: '70px Merryweather', fill: '#000000' });
    buttonConfig.anchor.setTo(0.5, 0.5);
    buttonConfig.inputEnabled = true;
    buttonConfig.events.onInputDown.add(onConfigButtonPressed, this); // Add click event listener
    buttonConfig.events.onInputOver.add(onButtonHover, this); // Add hover event listener
    buttonConfig.events.onInputOut.add(onButtonOut, this); // Add hover out event listener
}

function onStartButtonPressed() {
    game.camera.fade(0x000000, 2000); // Fade out to black
    game.camera.onFadeComplete.add(function() {
        game.state.start('play');
    }, this);
}

function onAboutButtonPressed() {
    game.camera.fade(0x000000, 2000); // Fade out to black
    game.camera.onFadeComplete.add(function() {
        game.state.start('about');
    }, this);
}

function onConfigButtonPressed() {
    game.camera.fade(0x000000, 2000); // Fade out to black
    game.camera.onFadeComplete.add(function() {
        game.state.start('config');
    }, this);
}

function onButtonHover(button) {
    button.text = '~' + button.text + '~';
    game.add.tween(button.scale).to({ x: 1.1, y: 1.1 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
}

function onButtonOut(button) {
    button.text = button.text.replaceAll('~', ''); // Replace all occurrences of '~' with an empty string
    game.tweens.removeFrom(button.scale);
    button.scale.setTo(1, 1);
}