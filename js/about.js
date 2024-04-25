let aboutState = {
    preload: loadAboutAssets,
    create: showInstructions
};

function loadAboutAssets() {
    game.load.image('backButton', 'assets/imgs/Titles/BACK.png');
    game.load.image('aboutTitle', 'assets/imgs/Titles/ABOUT.png');
}

function showInstructions() {
    game.camera.flash(0x000000, 2000);

    title = game.add.image(game.camera.width / 2, 50, 'aboutTitle');
    title.anchor.setTo(0.5, 0);
    title.scale.setTo(0.5, 0.5);
    game.add.tween(title).to({ y: title.y + 10 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

    const groupname = game.add.text(game.camera.width / 2, 220, 'A game created by GROUP 1: Karl Marx', {font: '20px Merryweather', fill: '#ffffff', align: 'center'});
    groupname.anchor.setTo(0.5, 0);
    const ournames = game.add.text(game.camera.width / 2, 250, 'Saul Pacheco Trilles, Karl Kalantarov and Lucas Godoy Nebot', {font: '20px Merryweather', fill: '#ffffff', align: 'center'});
    ournames.anchor.setTo(0.5, 0);

    const placeholder = game.add.text(game.camera.width / 2, 400, 'INSTRUCTION SLIDES BUTTON WILL GO HERE', {font: '25px Merryweather', fill: '#ffffff', align: 'center'});
    placeholder.anchor.setTo(0.5, 0);

    back = game.add.image(game.camera.width / 2, game.camera.height - 200, 'backButton');
    back.anchor.setTo(0.5, 0);
    back.scale.setTo(0.3, 0.3);
    back.inputEnabled = true;
    back.events.onInputDown.add(onBackButtonPressed, this); // Add click event listener
    back.events.onInputOver.add(onBackHover, this); // Add hover event listener
    back.events.onInputOut.add(onBackOut, this); // Add hover out event listener
}

function onBackButtonPressed() {
    game.camera.fade(0x000000, 1000);
    game.camera.onFadeComplete.add(function() {
        game.state.start('welcomescreen');
    }, this);
}

function onBackHover(button) {
    game.add.tween(button.scale).to({ x: 0.35, y: 0.35 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
}

function onBackOut(button) {
    game.tweens.removeFrom(button.scale);
    button.scale.setTo(0.3, 0.3);
}