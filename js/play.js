const GAME_STAGE_WIDTH = 1920;
const GAME_STAGE_HEIGHT = 1920;
let levelConfig;

let maxEnemies = 10;
let spawnDelay = 1000;
let enemiesSpawned = 0;

const MAX_COLLECTABLE = 10;
let numOfcollectable;

let eventSystem;
let sceneData;

let playState = {
	preload: function() {
		//Healthbar
		game.load.image('healthbar_outline', 'assets/imgs/healthbar_outline.png');
		game.load.image('healthbar_mask_red', 'assets/imgs/healthbar_mask_red.png');
		game.load.image('collectableSprite', 'assets/imgs/star.png');

		//Player
		game.load.image('main-character', 'assets/imgs/main-character.png');
		game.load.image('hand', 'assets/imgs/hand-placeholder.png');


		game.load.image('enemySprite', 'assets/imgs/PLACEHOLDERS/default_cube.png');
	},
	create: function() {

		eventSystem = new EventSystem();
		sceneData = {};

		game.world.setBounds(0, 0, GAME_STAGE_WIDTH, GAME_STAGE_HEIGHT);


		sceneData.collisionGroups = {
			player: game.physics.p2.createCollisionGroup(),
			enemies: game.physics.p2.createCollisionGroup(),
			projectiles: game.physics.p2.createCollisionGroup(),
			collectables: game.physics.p2.createCollisionGroup()
		};
		game.physics.p2.updateBoundsCollisionGroup();

		sceneData.player = new Player(eventSystem);
		sceneData.HUD = new HUD(eventSystem);
		sceneData.newCollectible = new Collectible(eventSystem, 100, 100, 'collectableSprite');

		//Begin spawning enemies
		game.time.events.add(spawnDelay, spawnEnemies, this);

		eventSystem.CallEvent("post-scene-create", []);
	},
	update: function() {
		eventSystem.CallEvent("scene-update", []);
	},
};


function spawnEnemies() {
	//Checking if the number of enemies has been surpassed
	if(enemiesSpawned < maxEnemies){
		const newEnemy = new Enemy(eventSystem);
		enemiesSpawned++;

		//Making time for the next enemy to spawn
		game.time.events.add(spawnDelay, spawnEnemies, this);
	}
}
