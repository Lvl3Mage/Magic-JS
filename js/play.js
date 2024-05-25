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

		game.load.image('manabar_outline', 'assets/imgs/manabar_outline.png');
		game.load.image('manabar_mask', 'assets/imgs/manabar_mask_red.png');

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

		game.load.image('greenSlime', 'assets/imgs/greenSlime.png');
		game.load.image('purpleSlime', 'assets/imgs/purpleSlime.png');

		//Store
		game.load.image('characterUpgrade', 'assets/imgs/books/book1.png');
		game.load.image('speedUpgrade', 'assets/imgs/books/book2.png');
		game.load.image('bulletUpgrade', 'assets/imgs/books/book3.png');
		game.load.image('reload', 'assets/imgs/books/book4.png');
		game.load.image('upgradeDamage', 'assets/imgs/PLACEHOLDERS/w.jpg');
		game.load.image('upgradeVelocityAttack', 'assets/imgs/PLACEHOLDERS/speedAttack.jpg');
		game.load.image('heal', 'assets/imgs/PLACEHOLDERS/CaminateBlanco.png');

		//Safe zone
		game.load.image('safeZoneArea', 'assets/imgs/safeZone.png');
		game.load.image('crystal1', 'assets/imgs/crystalSprite1.png');
		game.load.image('crystal2', 'assets/imgs/crystalSprite2.png');
		game.load.image('crystal3', 'assets/imgs/crystalSprite3.png');

		//Sounds
		//volume up
		game.load.audio('sFireA', 'assets/snds/Laser_Shoot43.wav');
		game.load.audio('sCollectibleA', 'assets/snds/Pickup_Coin30.wav');
		game.load.audio('sHurtA', 'assets/snds/Hit_Hurt21.wav');
		game.load.audio('sSquishy', 'assets/snds/SlimeDamage97.wav');
		//volume down
		game.load.audio('sFire', 'assets/snds/Laser_Shoot43 (mp3cut.net vol-75).wav');
		game.load.audio('sCollectible', 'assets/snds/Pickup_Coin30 (mp3cut.net vol-75).wav');
		game.load.audio('sHurt', 'assets/snds/Hit_Hurt21 (mp3cut.net vol-50).wav');
		game.load.audio('sSquishy', 'assets/snds/SlimeDamage97 (mp3cut.net vol-25)');
		// game.load.audio('sCorn', 'assets/snds/epic-braam-1-171527.mp3');
		// game.load.audio('sbg', 'assets/snds/epic-dramatic-inspirational-logo-196234 (mp3cut.net).mp3');
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
			safezone: game.add.group(),
			world: game.add.group(),
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
				"Infill",
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
		const playerSpawn = tilemap.objects.playerSpawn[0];


		sceneData.player = new Player(eventSystem, new Vector2(playerSpawn.x, playerSpawn.y));
		sceneData.HUD = new HUD(eventSystem);
		const safeZoneSpawn = tilemap.objects.safeZone[0];
		sceneData.safeZone = new SafeZone(eventSystem, new Vector2(safeZoneSpawn.x,safeZoneSpawn.y), new Vector2(1000,500));
		sceneData.collectables; //Inicializo los collectables (ns si es necesario)
		sceneData.sounds = {
			sFire: game.add.audio('sFire'),
			sCollectible: game.add.audio('sCollectible'),
			sHurt:game.add.audio('sHurt'),
			// sBackground: game.add.audio('sbg'),
			sSquishy: game.add.audio('sSquishy'),
		}
		// game.time.events.loop(Phaser.Timer.SECOND * 20, sceneData.sounds.sBackground.play(), this); // If anyone knows forward

		const spawnPoints = {
		};
		for(let enemyType of Object.keys(gameConfig.enemies)){
			const points = tilemap.objects[enemyType];
			if (!points){
				console.warn('No spawn points found for enemy type:', enemyType);
				continue;
			}
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
				console.log(bodies);
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


function cheatActions(){
	if (debuging) {
		let killKey = game.input.keyboard.addKey(Phaser.Keyboard.K);
		if (killKey.isDown) {
			sceneData.player.takeDamage(sceneData.player.maxHealth);
		}
	}
}