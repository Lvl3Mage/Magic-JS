let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};
function preloadPlay() {
    game.load.image('main-character', 'assets/imgs/main-character.png');
}

function createPlay() {
    player = game.add.sprite(0, 0, 'main-character');
    console.log(new BaseComponent());
}

function updatePlay() {
    
}


