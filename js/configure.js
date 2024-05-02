let configState = {
    preload: loadConfigAssets,
    create: doConfig
};

function loadConfigAssets() {
    game.load.image('backButton', 'assets/imgs/Titles/BACK.png');
    game.load.image('configTitle', 'assets/imgs/Titles/CONFIG.png');
    game.load.image('bg', 'assets/imgs/Backgrounds/BACKGROUND.jpg');

    //Three buttons for three different difficulties to select
    game.load.image('easyButton', 'assets/imgs/PLACEHOLDERS/gameeasy.png');
    game.load.image('avgButton', 'assets/imgs/PLACEHOLDERS/gameaverage.png');
    game.load.image('ngtmButton', 'assets/imgs/PLACEHOLDERS/gamenightmare.png');
}

function doConfig() {
    game.camera.flash(0x000000, 2000);

    game.input.enabled = true;

    background = game.add.image(game.camera.width/2 ,0, 'bg');
    background.scale.setTo(1.5,1.5);
    background.anchor.setTo(0.5,0);

    // Display the title
    title = game.add.image(game.camera.width / 2, 50, 'configTitle');
    title.anchor.setTo(0.5, 0);
    game.add.tween(title).to({ y: title.y + 10 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

    const text = game.add.text(game.camera.width / 2, 220, 'Select your difficulty...', {font: '40px Merryweather', fill: '#ffffff', align: 'center'});
    text.anchor.setTo(0.5, 0);
    
    // Display the buttons
    btnEasy = game.add.button(game.camera.width / 2 - 300 , game.camera.height/2, 'easyButton', onButtonPressed, this);
    btnEasy.anchor.setTo(0.5, 0.5);
    btnEasy.name = 'btnEasy'; // Add a name property to identify the button

    btnAvg = game.add.button(game.camera.width / 2 , game.camera.height/2, 'avgButton', onButtonPressed, this);
    btnAvg.anchor.setTo(0.5, 0.5);
    btnAvg.name = 'btnAvg'; // Add a name property to identify the button

    btnNgtm = game.add.button(game.camera.width / 2 + 300, game.camera.height/2, 'ngtmButton', onButtonPressed, this);
    btnNgtm.anchor.setTo(0.5, 0.5);
    btnNgtm.name = 'btnNgtm'; // Add a name property to identify the button
}

function onButtonPressed(button) {
    if (button.name === 'btnEasy') {
        // Update the parameters for each control
        console.log("hello! You pressed the Easy button");
        goHome();
        
    } else if (button.name === 'btnAvg') {
        // Update the parameters for each control
        console.log("hello! You pressed the Average button");
        goHome();
        
    } else if (button.name === 'btnNgtm') {
        // Update the parameters for each control
        console.log("hello! You pressed the Nightmare button");
        goHome();
    }
}

function goHome() {
    game.camera.fade(0x000000, 1000);
    game.camera.onFadeComplete.add(function() {
        game.state.start('welcomescreen');
    }, this);
}