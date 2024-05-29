let configState = {
    preload: loadConfigAssets,
    create: doConfig
};

function loadConfigAssets() {
    game.load.image('configTitle', 'assets/imgs/Titles/CONFIG.png');

    //Three buttons for three different difficulties to select
    game.load.image('easyButton', 'assets/imgs/Buttons/gameeasy.png');
    game.load.image('avgButton', 'assets/imgs/Buttons/gamemedium.png');
    game.load.image('ngtmButton', 'assets/imgs/Buttons/gamenightmare.png');
}

function doConfig() {
    game.camera.flash(0x000000, 2000);

    game.input.enabled = true;

    // Display the title
    title = game.add.image(game.camera.width / 2, 50, 'configTitle');
    title.anchor.setTo(0.5, 0);
    game.add.tween(title).to({ y: title.y + 10 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

    const text = game.add.text(game.camera.width / 2, 220, 'Select your difficulty...', {font: '40px Merryweather', fill: '#ffffff', align: 'center'});
    text.anchor.setTo(0.5, 0);

    // Display the buttons
    btnEasy = game.add.button(game.camera.width / 2 - 300 , game.camera.height/2 + 100, 'easyButton', onButtonPressed, this);
    btnEasy.anchor.setTo(0.5, 0.5);
    btnEasy.name = 'btnEasy'; // Add a name property to identify the button
    btnEasy.events.onInputOver.add(jiggle, this); // Add hover event listener

    btnAvg = game.add.button(game.camera.width / 2 , game.camera.height/2 + 100, 'avgButton', onButtonPressed, this);
    btnAvg.anchor.setTo(0.5, 0.5);
    btnAvg.name = 'btnAvg'; // Add a name property to identify the button
    btnAvg.events.onInputOver.add(jiggle, this); // Add hover event listener

    btnNgtm = game.add.button(game.camera.width / 2 + 300, game.camera.height/2 + 100, 'ngtmButton', onButtonPressed, this);
    btnNgtm.anchor.setTo(0.5, 0.5);
    btnNgtm.name = 'btnNgtm'; // Add a name property to identify the button
    btnNgtm.events.onInputOver.add(jiggle, this); // Add hover event listener

    difficultyDisplay = game.add.text(game.camera.width / 2, game.camera.height / 2 + 250, 'Current difficulty: ' + difficultyText, { font: '25px Merryweather', fill: '#ffffff' });
    difficultyDisplay.anchor.setTo(0.5, 0.5);
}

difficultyText = 'Easy';

function onButtonPressed(button) {
    if (button.name === 'btnEasy') {
        difficulty = 'easy';
        difficultyText = 'Easy';
        goHome();

    } else if (button.name === 'btnAvg') {
        difficulty = 'medium';
        difficultyText = 'Medium';
        goHome();

    } else if (button.name === 'btnNgtm') {
        difficulty = 'nightmare';
        difficultyText = 'Nightmare';
        goHome();
    }
}

function jiggle(button) {
    game.add.tween(button.scale).to({ x: 1.2, y: 0.8 }, 200, Phaser.Easing.Cubic.InOut, true, 0, 0, true)
    .onComplete.add(function() {
        // Recoil effect
        game.add.tween(button.scale).to({ x: 1, y: 1 }, 200, Phaser.Easing.Cubic.InOut, true);
    });
}

function goHome() {
    game.camera.fade(0x000000, 1000);
    game.camera.onFadeComplete.add(function() {
        game.state.start('welcomescreen');
    }, this);
}