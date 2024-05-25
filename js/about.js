let aboutState = {
    preload: loadAboutAssets,
    create: showAbout
};

function loadAboutAssets() {
    game.load.image('backButton', 'assets/imgs/Titles/BACK.png');
    game.load.image('aboutTitle', 'assets/imgs/Titles/ABOUT.png');
    game.load.image('slideButtonOpen', 'assets/imgs/Buttons/HandButton.png');
    game.load.image('slideButtonClosed', 'assets/imgs/Buttons/FistButton.png');
}

function showAbout() {
    game.camera.flash(0x000000, 2000);

    title = game.add.image(game.camera.width / 2, 50, 'aboutTitle');
    title.anchor.setTo(0.5, 0);
    title.scale.setTo(0.5, 0.5);
    game.add.tween(title).to({ y: title.y + 10 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

    const groupname = game.add.text(game.camera.width / 2, 220, 'A game created by GROUP 1: Karl Marx', {font: '20px Merryweather', fill: '#ffffff', align: 'center'});
    groupname.anchor.setTo(0.5, 0);
    const ournames = game.add.text(game.camera.width / 2, 250, 'Composed by: Saul Pacheco Trilles, Karl Kalantarov and Lucas Godoy Nebot', {font: '20px Merryweather', fill: '#ffffff', align: 'center'});
    ournames.anchor.setTo(0.5, 0);
    const guide = game.add.text(game.camera.width / 2, 280, 'Unravel the enigmatic rules of the game with a mere touch upon the mystical hand below...', {font: '20px Merryweather', fill: '#ffffff', align: 'center'});
    guide.anchor.setTo(0.5, 0);

    slides = game.add.image(game.camera.width / 2, 320, 'slideButtonOpen');
    slides.anchor.setTo(0.5, 0);
    slides.inputEnabled = true;
    slides.events.onInputDown.add(onHandButtonPressed, this); // Add click event listener

    back = game.add.image(game.camera.width / 2, game.camera.height - 150, 'backButton');
    back.anchor.setTo(0.5, 0);
    back.scale.setTo(0.3, 0.3);
    back.inputEnabled = true;
    back.events.onInputDown.add(onBackButtonPressed, this); // Add click event listener
    back.events.onInputOver.add(onBackHover, this); // Add hover event listener
    back.events.onInputOut.add(onBackOut, this); // Add hover out event listener
}

//This is for the instructions slide button
function onHandButtonPressed() {
    slides.loadTexture('slideButtonClosed');
    slides.scale.setTo(0.8, 0.8);
    game.camera.fade(0x000000, 1000, true, 1);
    game.camera.onFadeComplete.addOnce(function() {
        game.state.start('instructions');
    }, this);
}

//This is for the back button
function onBackButtonPressed() {
    game.camera.fade(0x000000, 1000);
    game.camera.onFadeComplete.add(function() {
        game.state.start('welcomescreen');
    }, this);
}

function onBackHover(button) {
    game.add.tween(button.scale).to({ x: 0.35, y: 0.35 }, 1000, Phaser.Easing.Quartic.Out, true, 0, 0, false);
}

function onBackOut(button) {
    game.tweens.removeFrom(button.scale);
    
    game.add.tween(button.scale).to({ x: 0.3, y: 0.3 }, 1000, Phaser.Easing.Quartic.Out, true, 0, 0, false);
    // button.scale.setTo(0.3, 0.3);
}