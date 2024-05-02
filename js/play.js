const GAME_STAGE_WIDTH = 1920;
const GAME_STAGE_HEIGHT = 1920;

let maxEnemies = 10;
let spawnDelay = 1000;
let enemiesSpawned = 0;

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

	game.load.image('enemySprite', 'assets/imgs/PLACEHOLDERS/default_cube.png');


	eventSystem.CallEvent("preload", []);
}

function createPlay() {
	game.world.setBounds(0, 0, GAME_STAGE_WIDTH, GAME_STAGE_HEIGHT);
	game.camera.roundPx = false;
	eventSystem.CallEvent("create", []);
	
	//I'll start spawning enemies here
	game.time.events.add(spawnDelay, spawnEnemies, this);
}

function updatePlay() {
    eventSystem.CallEvent("update", []);

}

function spawnEnemies() {
	//Checking if the number of enemies has been surpassed
	if(enemiesSpawned < maxEnemies){
		const newEnemy = new Enemy(eventSystem);
		enemiesSpawned++;

		//Making time for the next enemy to spawn
		game.time.events.add(spawnDelay, spawnEnemies, this);
	}
}
