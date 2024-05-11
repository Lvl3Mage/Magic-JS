let currentslide = 1;
let slideDuration = 10000;

let instructionState = {
    preload: loadInstructionAssets,
    create: showInstructions
};

function loadInstructionAssets() {
    game.load.image('InstructionsBg', 'assets/imgs/Backgrounds/TheDungeons.jpeg')
    game.load.image('instructions1', 'assets/imgs/Backgrounds/instructions1.png')
    game.load.image('instructions2', 'assets/imgs/Backgrounds/instructions2.png')
    game.load.image('instructions3', 'assets/imgs/Backgrounds/instructions3.png')
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
    const Objective = game.add.text(game.camera.width / 2, game.camera.height / 2 - 400, 'Your purpose...', {font: '40px Merryweather', fill: '#ffffff', align: 'center'});
    Objective.anchor.setTo(0.5, 0);
    instructions1 = game.add.image(game.camera.width/2, game.camera.height / 2, 'instructions1');
    instructions1.scale.setTo(2, 2);
    instructions1.anchor.setTo(0.5, 0.5);

    const slideTimer = game.time.events.add(slideDuration, function(){
        Objective.destroy();
        instructions1.destroy();
        slide2();
    }, this);
    
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(function() {
        game.time.events.remove(slideTimer);
        Objective.destroy();
        instructions1.destroy();
        slide2();
    });
}

function slide2() {
    const Dangers = game.add.text(game.camera.width / 2, game.camera.height / 2 - 400, 'Your foes...', {font: '40px Merryweather', fill: '#ffffff', align: 'center'});
    Dangers.anchor.setTo(0.5, 0);
    instructions2 = game.add.image(game.camera.width/2, game.camera.height / 2, 'instructions2');
    instructions2.scale.setTo(2, 2);
    instructions2.anchor.setTo(0.5, 0.5);

    const slideTimer = game.time.events.add(slideDuration, function(){
        Dangers.destroy();
        instructions2.destroy();
        slide3();
    }, this);
    
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(function() {
        game.time.events.remove(slideTimer);
        Dangers.destroy();
        instructions2.destroy();
        slide3();
    });
}

function slide3() {
    const Help = game.add.text(game.camera.width / 2, game.camera.height / 2 - 400, 'Your path to victory...', {font: '40px Merryweather', fill: '#ffffff', align: 'center'});
    Help.anchor.setTo(0.5, 0);
    instructions3 = game.add.image(game.camera.width/2, game.camera.height / 2, 'instructions3');
    instructions3.scale.setTo(2, 2);
    instructions3.anchor.setTo(0.5, 0.5);

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