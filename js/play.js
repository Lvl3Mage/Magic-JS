// let GAME_STAGE_WIDTH;
// let GAME_STAGE_HEIGHT;
// const TILE_SIZE = 1000;
// const ROWS = GAME_STAGE_WIDTH / TILE_SIZE;
// const COLUMNS = GAME_STAGE_HEIGHT / TILE_SIZE;
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
		game.load.image('xp', 'assets/imgs/PLACEHOLDERS/XPminecraft.png');
		game.load.image('Floor', 'assets/imgs/Backgrounds/Tileset.png');
		game.load.tilemap('levelMap', 'assets/levels/squareTilemap.json', null, Phaser.Tilemap.TILED_JSON);

		//Player
		game.load.image('main-character', 'assets/imgs/mage.png');
		game.load.image('hand', 'assets/imgs/Buttons/HandButton.png');
		game.load.image('bullet', 'assets/imgs/bullet.png')


		game.load.image('enemySprite', 'assets/imgs/greenSlime.png');
	},
	create: function() {

		eventSystem = new EventSystem();
		sceneData = {};


		sceneData.collisionGroups = {
			player: game.physics.p2.createCollisionGroup(),
			enemies: game.physics.p2.createCollisionGroup(),
			projectiles: game.physics.p2.createCollisionGroup(),
			collectables: game.physics.p2.createCollisionGroup(),
			safeZones: game.physics.p2.createCollisionGroup(),
			bounds: game.physics.p2.createCollisionGroup(),
			walls: game.physics.p2.createCollisionGroup(),
		};
		let tilemap = SetupTilemap(
			'levelMap', 
			[
				{innerKey: 'WallsTileset', imageKey: 'Floor'}
			], 
			[
				"Floor",
				{
					name: "Walls",
					objectCollisions: true,
					collisionGroup: sceneData.collisionGroups.walls,
					resizeWorld:true,
					collideWith: [sceneData.collisionGroups.player, sceneData.collisionGroups.enemies, sceneData.collisionGroups.projectiles],
					debug:false,
				},
			]
		);
		console.log(game.world.width, game.world.height);
		game.world.setBounds(0, 0, game.world.width, game.world.height);
	

		// game.physics.p2.setBounds(0,0,GAME_STAGE_WIDTH,GAME_STAGE_HEIGHT,true,true,true,true, sceneData.collisionGroups.bounds);
		// game.physics.p2.boundsCollisionGroup = sceneData.collisionGroups.bounds;
		// game.physics.p2.updateBoundsCollisionGroup();
		sceneData.player = new Player(eventSystem);
		sceneData.HUD = new HUD(eventSystem);
		sceneData.safeZone = new SafeZone(eventSystem, new Vector2(50,50), new Vector2(1000,500));
		sceneData.collectables; //Inicializo los collectables (ns si es necesario)
		sceneData.store = new Store(eventSystem);

		sceneData.enemiesSpawned = 0;

		//Begin spawning enemies
		game.time.events.add(spawnDelay, spawnEnemies, this);

		eventSystem.CallEvent("post-scene-create", []);

	},
	update: function() {
		// Update the realm's happenings
		eventSystem.CallEvent("scene-update", []);
	},
};

function SetupTilemap(tilemapKey, tilesets, layersConfig){
	let tilemap = game.add.tilemap(tilemapKey);
	tilesets.forEach(tileset => {
		tilemap.addTilesetImage(tileset.innerKey, tileset.imageKey);
	});
	let layers = {};
	layersConfig.forEach(config => {
		if(typeof config === 'string'){
			config = {name: config};
		}
		layers[config.name] = tilemap.createLayer(config.name);
		if(config.resizeWorld){
			layers[config.name].resizeWorld();
		}
		if(config.debug){
			layers[config.name].debug = true;
		}
		if(config.objectCollisions){
			tilemap.setCollisionByExclusion([], true, layers[config.name]);
			tilemap.collision[config.name] = tilemap.objects[config.name];
			const bodies = game.physics.p2.convertCollisionObjects(tilemap, config.name, true);
			bodies.forEach(function (body) {
				body.setCollisionGroup(config.collisionGroup);
				if(config.debug){
					body.debug = true;
				}
				body.collides(config.collideWith);
			});
		}
	});
	return tilemap
}
function spawnEnemies() {
	//Checking if the number of enemies has been surpassed
	if(sceneData.enemiesSpawned < maxEnemies){
		const newEnemy = new Enemy(eventSystem);
	}
	//Making time for the next enemy to spawn
	game.time.events.add(spawnDelay, spawnEnemies, this);
}
