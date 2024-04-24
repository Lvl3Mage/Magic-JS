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
    title.scale.setTo(0.8, 0.8);
    game.add.tween(title).to({ y: title.y + 10 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

    const text1 = game.add.text(game.camera.width / 2, 280, 'A game created by GROUP 1: Karl Marx', {font: '24px Merryweather', fill: '#ffffff', align: 'center'});
    text1.anchor.setTo(0.5, 0);
    const text2 = game.add.text(game.camera.width / 2, 320, 'Saul Pacheco Trilles, Karl Kalantarov and Lucas Godoy Nebot', {font: '24px Merryweather', fill: '#ffffff', align: 'center'});
    text2.anchor.setTo(0.5, 0);

    const text3 = game.add.text(game.camera.width / 2, 400, '~CONTROLS~', {font: '24px Merryweather', fill: '#ffffff', align: 'center'});
    text3.anchor.setTo(0.5, 0);
    const text4 = game.add.text(game.camera.width / 2, 440, 'Movement - WASD', {font: '24px Merryweather', fill: '#ffffff', align: 'center'});
    text4.anchor.setTo(0.5, 0);
    const text5 = game.add.text(game.camera.width / 2, 480, 'Aim - Mouse', {font: '24px Merryweather', fill: '#ffffff', align: 'center'});
    text5.anchor.setTo(0.5, 0);
    const text6 = game.add.text(game.camera.width / 2, 512, 'Shoot - ', {font: '24px Merryweather', fill: '#ffffff', align: 'center'});
    text6.anchor.setTo(0.5, 0);

    const text7 = game.add.text(game.camera.width / 2, 592, '~OBJECTIVE~', {font: '24px Merryweather', fill: '#ffffff', align: 'center'});
    text7.anchor.setTo(0.5, 0);
    const text8 = game.add.text(game.camera.width / 2, 630, 'Eliminate as many enemies as possible to obtain enough points to progress! Rest in the camp if you need to, but don`t overstay!', {font: '24px Merryweather', fill: '#ffffff', align: 'center'});
    text8.anchor.setTo(0.5, 0);

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