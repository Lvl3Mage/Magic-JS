let configState = {
    preload: loadConfigAssets,
    create: doConfig
};

let btnEasy, btnAvg, btnNgtm;

function loadConfigAssets() {
    game.load.image('backButton', 'assets/imgs/Titles/BACK.png');
    game.load.image('configTitle', 'assets/imgs/Titles/CONFIG.png');

    //Three buttons for three different difficulties to select
    //game.load.image('easyButton', '');
    //game.load.image('avgButton', '');
    //game.load.image('ngtmButton', '');
}

function doConfig() {
    game.camera.flash(0x000000, 2000);

    // Display the title
    title = game.add.image(game.camera.width / 2, 50, 'configTitle');
    title.anchor.setTo(0.5, 0);
    game.add.tween(title).to({ y: title.y + 10 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

    const text = game.add.text(game.camera.width / 2, 250, 'Select your difficulty...', {font: '50px Merryweather', fill: '#ffffff', align: 'center'});
    text.anchor.setTo(0.5, 0);

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