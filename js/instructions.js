let currentslide = 1;
let slideDuration = 10000;

let instructionState = {
    preload: loadInstructionAssets,
    create: showInstructions
};

function loadInstructionAssets() {
    game.load.image('InstructionsBg', 'assets/imgs/Backgrounds/TheDungeons.jpeg')
}

function showInstructions() {
    game.camera.flash(0x000000, 1000); //Game fades in
    game.input.enabled = true;

    InstructionsBg = game.add.image(game.camera.width/2 ,0, 'InstructionsBg');
    InstructionsBg.scale.setTo(0.6, 0.6);
    InstructionsBg.anchor.setTo(0.5, 0);
    InstructionsBg.alpha = 0.2;

    slide1();

    const skipInstructions = game.add.text(game.camera.width/2, game.camera.height - 100, 'Press SPACE to skip onto the next', {font: '20px Merryweather', fill: '#ffffff', align: 'center'});
    skipInstructions.anchor.setTo(0.5, 0);
}

//************************************************************************************************

function slide1() {
    const Objective = game.add.text(game.camera.width / 2, game.camera.height / 2, 'Your purpose...', {font: '40px Merryweather', fill: '#ffffff', align: 'center'});
    Objective.anchor.setTo(0.5, 0);

    const slideTimer = game.time.events.add(slideDuration, function(){
        Objective.destroy();
        slide2();
    }, this);
    
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(function() {
        game.time.events.remove(slideTimer);
        Objective.destroy();
        slide2();
    });
}

function slide2() {
    const Dangers = game.add.text(game.camera.width / 2, game.camera.height / 2, 'Your foes...', {font: '40px Merryweather', fill: '#ffffff', align: 'center'});
    Dangers.anchor.setTo(0.5, 0);

    const slideTimer = game.time.events.add(slideDuration, function(){
        Dangers.destroy();
        slide3();
    }, this);
    
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(function() {
        game.time.events.remove(slideTimer);
        Dangers.destroy();
        slide3();
    });
}

function slide3() {
    const Help = game.add.text(game.camera.width / 2, game.camera.height / 2, 'Your aid...', {font: '40px Merryweather', fill: '#ffffff', align: 'center'});
    Help.anchor.setTo(0.5, 0);

    game.time.events.add(slideDuration, function(){
        game.camera.fade(0x000000, 1000);
        game.camera.onFadeComplete.add(function() {
            game.state.start('welcomescreen');
        }, this);
    }, this);

    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(function() {
        game.camera.fade(0x000000, 1000);
        game.camera.onFadeComplete.add(function() {
            game.state.start('welcomescreen');
        }, this);
    });
}