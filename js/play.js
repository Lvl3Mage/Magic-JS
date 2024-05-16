// let GAME_STAGE_WIDTH;
// let GAME_STAGE_HEIGHT;
// const TILE_SIZE = 1000;
// const ROWS = GAME_STAGE_WIDTH / TILE_SIZE;
// const COLUMNS = GAME_STAGE_HEIGHT / TILE_SIZE;
let levelConfig;

let maxEnemies = 100;
let spawnDelay = 100;

const MAX_COLLECTABLE = 10;
let numOfcollectable;

let eventSystem;
let sceneData;

let debuging = true;

let gameConfig;
function FormConfig(configData, difficulty){
	let defaultConfig = configData['default'];
	let difficultyConfig = configData.diffucultyOverrides[difficulty];
	ApplyObjectOverride(defaultConfig, difficultyConfig);
	return defaultConfig;
}
function ApplyObjectOverride(main, override){
	for(let key in override){
		if(typeof override[key] === 'object'){
			if(!main[key]){
				main[key] = {};
			}
			ApplyObjectOverride(main[key], override[key]);
		}
		else{
			if(!main[key]){
				console.warn('Key not found in main object, applying override anyways:', key);
			}
			main[key] = override[key];
		}
	}
}
let playState = {
	preload: function() {
		//Healthbar
		game.load.image('healthbar_outline', 'assets/imgs/healthbar_outline.png');
		game.load.image('healthbar_mask_red', 'assets/imgs/healthbar_mask_red.png');
		game.load.image('hudWall', 'assets/imgs/hudWall.png');
		game.load.image('xp', 'assets/imgs/INTpoints.png');
		game.load.image('Floor', 'assets/imgs/Backgrounds/Tileset.png');
		game.load.tilemap('levelMap', 'assets/levels/squareTilemap.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.json('config', 'assets/levels/config.json');

		//Player
		game.load.image('shadow', 'assets/imgs/PLACEHOLDERS/shadow.png');
		game.load.image('main-character', 'assets/imgs/mage.png');
		game.load.image('hand', 'assets/imgs/Buttons/HandButton.png');
		game.load.image('bullet', 'assets/imgs/bullet.png')

		game.load.image('enemySprite', 'assets/imgs/greenSlime.png');

		//Store
		game.load.image('upgradeVelocity', 'assets/imgs/PLACEHOLDERS/Flash-Logo.png');
		game.load.image('upgradeDamage', 'assets/imgs/PLACEHOLDERS/w.jpg');
		game.load.image('upgradeVelocityAttack', 'assets/imgs/PLACEHOLDERS/speedAttack.jpg');
		game.load.image('heal', 'assets/imgs/PLACEHOLDERS/CaminateBlanco.png');
	},
	create: function() {
		const gameConfigData = game.cache.getJSON('config');
		gameConfig = FormConfig(gameConfigData, difficulty);


		eventSystem = new EventSystem();
		game.physics.p2.setPostBroadphaseCallback(function (body1, body2) {
			eventSystem.CallEvent("on-physics-overlap", [body1, body2]);
			return true;
		});



		sceneData = {};
		sceneData.collisionGroups = {
			player: game.physics.p2.createCollisionGroup(),
			enemies: game.physics.p2.createCollisionGroup(),
			// enemyHitbox: game.physics.p2.createCollisionGroup(),
			projectiles: game.physics.p2.createCollisionGroup(),
			collectables: game.physics.p2.createCollisionGroup(),
			safeZones: game.physics.p2.createCollisionGroup(),
			bounds: game.physics.p2.createCollisionGroup(),
			walls: game.physics.p2.createCollisionGroup(),
			store: game.physics.p2.createCollisionGroup(),
		};
		sceneData.layers = {
			background: game.add.group(),
			shadows: game.add.group(),
			player: game.add.group(),
			enemies: game.add.group(),
			projectiles: game.add.group(),
			collectables: game.add.group(),
			UI: game.add.group(),
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
					// parent: sceneData.layers.background
				},
			],
			sceneData.layers.background
		);
		game.world.setBounds(0, 0, game.world.width, game.world.height);


		sceneData.HUD = new HUD(eventSystem);
		sceneData.player = new Player(eventSystem);
		sceneData.safeZone = new SafeZone(eventSystem, new Vector2(50,50), new Vector2(1000,500));
		sceneData.collectables; //Inicializo los collectables (ns si es necesario)
		setUpStore();

		const spawnPoints = {
		};
		for(let enemyType of Object.keys(gameConfig.enemies)){
			const points = tilemap.objects[enemyType];
			spawnPoints[enemyType] = [];
			for(let point of points){
				spawnPoints[enemyType].push(new Vector2(point.x, point.y));
			}
		}

		sceneData.enemyManager = new EnemyManager(eventSystem, spawnPoints);


		eventSystem.CallEvent("post-scene-create", []);

	},
	update: function() {
		// Update the realm's happenings
		eventSystem.CallEvent("scene-update", []);
		game.debug.text('FPS: ' + game.time.fps || 'FPS: --', 40, 40, "#00ff00");
		if(debuging) cheatActions();
		//game.time.advancedTiming = true;
		if (sceneData.HUD.score >= gameConfig.winScore && !gameWin){
			gameWin = true;
			totalScore = sceneData.HUD.scoreTotal;
			game.state.start('endScreen');
		}
	},
};

function SetupTilemap(tilemapKey, tilesets, layersConfig, defaultParent){
	let tilemap = game.add.tilemap(tilemapKey);
	tilesets.forEach(tileset => {
		tilemap.addTilesetImage(tileset.innerKey, tileset.imageKey);
	});
	let mapLayers = {};
	layersConfig.forEach(config => {
		if(typeof config === 'string'){
			config = {name: config};
		}
		mapLayers[config.name] = tilemap.createLayer(config.name);
		if(config.resizeWorld){
			mapLayers[config.name].resizeWorld();
		}
		if(config.debug){
			mapLayers[config.name].debug = true;
		}
		if(config.objectCollisions){
			tilemap.setCollisionByExclusion([], true, mapLayers[config.name]);
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
		if(config.parent){
			config.parent.addChild(mapLayers[config.name]);
		}
		else if(defaultParent){
			defaultParent.addChild(mapLayers[config.name]);
		}
	});
	return tilemap;
}

function setUpStore(){
	let state = 0;
	let statePrice = [50, 100, 150, 200, 300, 400, 600, `---`];
	let posX = 150;
	let posY = 150;
	let debug = debuging;
	new Store(eventSystem, new Vector2(posX, posY),
		{
			spriteName: "upgradeVelocity",
			spriteScale: new Vector2(0.03,0.03),
			debug: debug,
			statePrice: statePrice,
			state: state,
			action: function(){
				if (sceneData.HUD.score >= statePrice[state]) {
					sceneData.HUD.addScore(-statePrice[state]);
					console.log(`Mejora velocidad de ${sceneData.player.maxVelocity} a ${sceneData.player.maxVelocity+100} y me ha costado ${-statePrice[state]}.`);
					sceneData.player.maxVelocity += 50;
					state ++;
				}
				return state;
			}
		});
	new Store(eventSystem, new Vector2(posX + 150, posY),
		{
			spriteName: "upgradeDamage",
			spriteScale: new Vector2(0.05,0.05),
			debug: debug,
			statePrice: statePrice,
			state: state,
			action: function(){
				if (sceneData.HUD.score >= statePrice[state]) {
					sceneData.HUD.addScore(-statePrice[state]);
					console.log(`Mejora daño de ${sceneData.player.maxVelocity} a ${sceneData.player.maxVelocity+100} y me ha costado ${-statePrice[state]}.`);
					sceneData.player.maxVelocity += 50;
					state ++;
				}
				return state;
			}
		});
	new Store(eventSystem, new Vector2(posX + 300, posY),
		{
			spriteName: "heal",
			spriteScale: new Vector2(0.1,0.1),
			debug: debug,
			statePrice: statePrice,
			state: state,
			action: function(){
				if (sceneData.HUD.score >= statePrice[state]) {
					sceneData.HUD.addScore(-statePrice[state]);
					console.log(`Curacion de ${sceneData.player.health} a ${sceneData.player.health+20} y me ha costado ${-statePrice[state]}.`);
					sceneData.player.Heal(20);
					state ++;
				}
				return state;
			}
		});
}

function cheatActions(){
	if (debuging) {
		let killKey = game.input.keyboard.addKey(Phaser.Keyboard.K);
		if (killKey.isDown) {
			sceneData.player.takeDamage(sceneData.player.maxHealth);
		}
	}
}






function spawnEnemies() {
	//Checking if the number of enemies has been surpassed
	if(sceneData.enemiesSpawned < maxEnemies){
		const newEnemy = new Enemy(eventSystem);
	}
	//Making time for the next enemy to spawn
	game.time.events.add(spawnDelay, spawnEnemies, this);
}
