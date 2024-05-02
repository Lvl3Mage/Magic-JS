const GAME_STAGE_WIDTH = 1920;
const GAME_STAGE_HEIGHT = 1920;
let levelConfig;

let maxEnemies = 10;
let spawnDelay = 1000;
let enemiesSpawned = 0;

const MAX_COLLECTABLE = 10;
let collectable;
let numOfcollectable;

let eventSystem;
let sceneData;

let playState = {
	preload: function() {
		//Healthbar
		game.load.image('healthbar_outline', 'assets/imgs/healthbar_outline.png');
		game.load.image('healthbar_mask_red', 'assets/imgs/healthbar_mask_red.png');
		game.load.image('collectable', 'assets/imgs/star.png');

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

		
		createCollectables();
		drawCollectables();

		//Begin spawning enemies
		game.time.events.add(spawnDelay, spawnEnemies, this);

		eventSystem.CallEvent("post-scene-create", []);
	},
	update: function() {
		eventSystem.CallEvent("scene-update", []);
	},
};





function createCollectables(){
	collectable = game.add.group();
	collectable.enableBody = true;
	collectable.createMultiple(MAX_COLLECTABLE, 'collectable');
	collectable.forEach(setupItem, this);
}

function setupItem(element) {
	element.anchor.setTo(0.5, 0.5);
}

function drawCollectables(){
	collectable.forEach(setupCollectable, this);
}

function setupCollectable(collectable){
	let numx = Math.floor(Math.random() * 500); // de 0 a 499
	let numy = Math.floor(Math.random() * 500); // de 0 a 499
	collectable.reset(numx, numy);
	console.log(collectable);
    numOfcollectable += 1;
}


// Bool en update para que no llame a las funciones de move
// Animacion un tween
// onComplete para acabar el tween


function spawnEnemies() {
	//Checking if the number of enemies has been surpassed
	if(enemiesSpawned < maxEnemies){
		const newEnemy = new Enemy(eventSystem);
		enemiesSpawned++;

		//Making time for the next enemy to spawn
		game.time.events.add(spawnDelay, spawnEnemies, this);
	}
}
