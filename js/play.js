const GAME_STAGE_WIDTH = 1920;
const GAME_STAGE_HEIGHT = 1920;


let playState = {
	preload: preloadPlay,
	create: createPlay,
	update: updatePlay
};

const eventSystem = new EventSystem();
const player = new Player(eventSystem);
const hud = new HUD(eventSystem);

function preloadPlay() {
	game.load.image('healthbar_outline', 'assets/imgs/healthbar_outline.png');
	game.load.image('healthbar_mask_red', 'assets/imgs/healthbar_mask_red.png');

    eventSystem.CallEvent("preload", []);
}

function createPlay() {
	game.world.setBounds(0, 0, GAME_STAGE_WIDTH, GAME_STAGE_HEIGHT);
	game.camera.roundPx = false;
	eventSystem.CallEvent("create", []);

}

function updatePlay() {
    eventSystem.CallEvent("update", []);

}

// Bool en update para que no llame a las funciones de move
// Animacion un tween
// onComplete para acabar el tween