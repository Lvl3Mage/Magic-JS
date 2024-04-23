const GAME_STAGE_WIDTH = window.innerWidth;
const GAME_STAGE_HEIGHT = window.innerHeight;

let game = new Phaser.Game(GAME_STAGE_WIDTH, GAME_STAGE_HEIGHT, Phaser.CANVAS, 'gamestage');

// Entry point
window.onload = startGame;

function startGame() {
    game.state.add('welcomescreen', welcomeState);
    game.state.add('play', playState);
    game.state.add('about', aboutState);
    game.state.add('config', configState);

    game.state.start('welcomescreen');
}
