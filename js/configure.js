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
    btnEasy.scale.setTo(0.2,0.2);
    btnEasy.name = 'btnEasy'; // Add a name property to identify the button
    btnEasy.events.onInputOver.add(jiggle, this); // Add hover event listener
    btnEasy.events.onInputOut.add(noJiggle, this); // Add hover out event listener

    btnAvg = game.add.button(game.camera.width / 2 , game.camera.height/2 + 100, 'avgButton', onButtonPressed, this);
    btnAvg.anchor.setTo(0.5, 0.5);
    btnAvg.scale.setTo(0.2,0.2);
    btnAvg.name = 'btnAvg'; // Add a name property to identify the button
    btnAvg.events.onInputOver.add(jiggle, this); // Add hover event listener
    btnAvg.events.onInputOut.add(noJiggle, this); // Add hover out event listener

    btnNgtm = game.add.button(game.camera.width / 2 + 300, game.camera.height/2 + 100, 'ngtmButton', onButtonPressed, this);
    btnNgtm.anchor.setTo(0.5, 0.5);
    btnNgtm.scale.setTo(0.2,0.2);
    btnNgtm.name = 'btnNgtm'; // Add a name property to identify the button
    btnNgtm.events.onInputOver.add(jiggle, this); // Add hover event listener
    btnNgtm.events.onInputOut.add(noJiggle, this); // Add hover out event listener
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

function jiggle(button) {
    game.add.tween(button.scale).to({ x: 0.22, y: 0.18 }, 200, Phaser.Easing.Linear.None, true, 0, 0, true) 
    .onComplete.add(function() {
        // Recoil effect
        game.add.tween(button.scale).to({ x: 0.22, y: 0.18 }, 200, Phaser.Easing.Linear.None, true);
    });
}

function noJiggle(button) {
    game.add.tween(button.scale).to({ x: 0.2, y: 0.2 }, 100, Phaser.Easing.Linear.None, true);
}

function goHome() {
    game.camera.fade(0x000000, 1000);
    game.camera.onFadeComplete.add(function() {
        game.state.start('welcomescreen');
    }, this);
}