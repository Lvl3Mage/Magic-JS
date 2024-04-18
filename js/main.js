const GAME_STAGE_WIDTH = 800;
const GAME_STAGE_HEIGHT = 600;

let game = new Phaser.Game(GAME_STAGE_WIDTH, GAME_STAGE_HEIGHT, Phaser.CANVAS, 'gamestage');

// Entry point
window.onload = startGame;

function startGame() {
    game.state.add('init', initState);
    game.state.add('play', playState);
    game.state.add('hof', hofState);

    game.state.start('init');
}
