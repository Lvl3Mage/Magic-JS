let configState = {
    preload: loadConfigAssets,
    create: doConfig
};

let btnEasy, btnAvg, btnNgtm;

function loadConfigAssets() {
    game.load.image('backButton', 'assets/imgs/Titles/BACK.png');
    game.load.image('configTitle', 'assets/imgs/Titles/CONFIG.png');
    game.load.image('bg', 'assets/imgs/Backgrounds/BACKGROUND.jpg');

    //Three buttons for three different difficulties to select
    game.load.image('easyButton', 'assets/imgs/PLACEHOLDERS/gameeasy.png');
    game.load.image('avgButton', 'assets/imgs/PLACEHOLDERS/gameaverage.jpg');
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
    btnEasy = game.add.button(game.camera.width / 2 - 300 , game.camera.height/2, 'easyButton', onButtonPressed);
    btnEasy.anchor.setTo(0.5, 0);
    btnEasy.scale.setTo(0.03, 0.03); // Temporary workaround, images were way too big
    btnEasy.inputEnabled = true;
    btnEasy.events.onInputDown.add(onButtonPressed, this);

    btnAvg = game.add.button(game.camera.width / 2 , game.camera.height/2 , 'avgButton', onButtonPressed);
    btnAvg.anchor.setTo(0.5, 0);
    btnAvg.scale.setTo(0.04, 0.04); // Temporary workaround
    btnAvg.inputEnabled =  true;
    btnAvg.events.onInputDown.add(onButtonPressed, this);


    btnNgtm = game.add.button(game.camera.width / 2 + 300, game.camera.height/2, 'ngtmButton', onButtonPressed);
    btnNgtm.anchor.setTo(0.5, 0);
    btnNgtm.scale.setTo(0.6, 0.6); // Temporary workaround
    btnNgtm.inputEnabled = true;
    btnNgtm.events.onInputDown.add(onButtonPressed, this);
}

function onButtonPressed(button) { // TODO
    // let PARAMETERS;
    // console.log("hello! You pressed me"); 

    if (button === 'btnEasy') {
        // Update the parameters for each control
        console.log("hello! You pressed me");
        
    } else if (button === 'btnAvg') {
        // Update the parameters for each control
    } else if (button === 'btnNgtm') {
        // Update the parameters for each control
    }
}

