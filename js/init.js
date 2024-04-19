let btnStart;

let initState = {
    preload: preloadInit,
    create: createInit
};

function preloadInit () {
    game.load.image('craft', 'assets/imgs/craft.png');
    game.load.image('ufo', 'assets/imgs/ufo.png');
}

function createInit() {

    btnStart = game.add.button(game.world.centerX, game.world.centerY, 'craft', startPlay);
    btnStart.fixedToCamera = true;
    
    btnStart.anchor.setTo(0.5, 0.5);
    btnStart.scale.setTo(2.0);
}

function startPlay() {
    game.state.start('play');
}
