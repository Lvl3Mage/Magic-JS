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
		game.load.image('collectible', 'assets/imgs/collectibleGem.png');
		game.load.image('Floor', 'assets/imgs/Backgrounds/Tileset.png');
		game.load.tilemap('levelMap', 'assets/levels/squareTilemap.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.json('config', 'assets/levels/config.json');

		//Player
		game.load.image('shadow', 'assets/imgs/PLACEHOLDERS/shadow.png');
		game.load.image('main-character', 'assets/imgs/mage.png');
		game.load.image('hand0', 'assets/imgs/hands/1.png');
		game.load.image('hand1', 'assets/imgs/hands/2.png');
		game.load.image('hand2', 'assets/imgs/hands/3.png');
		game.load.image('hand3', 'assets/imgs/hands/4.png');
		game.load.image('hand4', 'assets/imgs/hands/5.png');
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
		game.load.audio('sFire', 'assets/snds/Laser_Shoot43.wav');
		game.load.audio('sCollectible', 'assets/snds/Pickup_Coin30.wav');
		game.load.audio('sHurt', 'assets/snds/Hit_Hurt21.wav');
		game.load.audio('sSquishy', 'assets/snds/SlimeDamage97.wav');
		game.load.audio('purchase', 'assets/snds/Purchase.wav');
		game.load.audio('charge', 'assets/snds/charge.wav');
		game.load.audio('empty', 'assets/snds/empty.wav');
		game.load.audio('explosion', 'assets/snds/Explosion.wav');
		//volume down
		// game.load.audio('sFire', 'assets/snds/Laser_Shoot43 (mp3cut.net vol-75).wav');
		// game.load.audio('sCollectible', 'assets/snds/Pickup_Coin30 (mp3cut.net vol-75).wav');
		// game.load.audio('sHurt', 'assets/snds/Hit_Hurt21 (mp3cut.net vol-50).wav');
		// game.load.audio('sSquishy', 'assets/snds/SlimeDamage97 (mp3cut.net vol-25)');
		
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
		gameWin = false;
		sceneData.gameComplete = false;
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
			decor: game.add.group(),
			UI: game.add.group(),
		};
		const obstacles = [];
		for(let i = 0; i < 3; i++){
			obstacles.push({
				name: `obstacle${i}`,
				objectCollisions: true,
				collisionGroup: sceneData.collisionGroups.walls,
				collideWith: [sceneData.collisionGroups.player, sceneData.collisionGroups.enemies, sceneData.collisionGroups.projectiles],
				parent: game.add.group(),
				physicsGroup: [],
			});
		}
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
				...obstacles
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
			fire: game.add.audio('sFire', 0.2),
			collectible: game.add.audio('sCollectible', 0.1),
			hurt:game.add.audio('sHurt', 0.1),
			// sBackground: game.add.audio('sbg'),
			squishy: game.add.audio('sSquishy', 0.2),
			purchase: game.add.audio('purchase', 0.4),
			charge: game.add.audio('charge', 0.2),
			empty: game.add.audio('empty', 0.7),
			explosion: game.add.audio('explosion', 0.7),
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



		const rechargeZones = CreatePoints(tilemap.objects.rechargeZones);
		for(let point of rechargeZones){
			new Store(eventSystem, point, {
				spriteName: 'reload',
				spriteScale: 0.3,
				priceHidden: true,
				purchaseSound: "purchase", 
				upgradeText: 'Reload & Heal',
				stages: [
					{
						changes: [
							{
								"actionType": "heal",
								"factor": 1
							},
							{
								"actionType": "reload",
								"factor": 1
							}
						],
						cost: 0,
						repeat: -1
					}
				],
			});
		}
		let unlockCost = 5;
		for(let obstacle of obstacles){
			let point = CreatePoints(tilemap.objects[obstacle.name + "Unlock"])[0];
			new Store(eventSystem, point, {
				spriteName: 'characterUpgrade',
				spriteScale: 0.3,
				getBalance: () => sceneData.HUD.crystals,
				setBalance: (value) => sceneData.HUD.setCrystals(value),
				priceUnits: " Crystals",
				purchaseSound: "purchase",
				upgradeText: 'Unlock Area',
				stages: [
					{
						changes: [
							{
								"actionType": "custom",
								"action": function(){
									obstacle.parent.destroy();
									obstacle.physicsGroup.forEach(body => body.destroy());
									unlockCost+=10;
								}
							}
						],
						get cost(){
							return unlockCost;
						}
					}
				],
			});
		}



		eventSystem.CallEvent("post-scene-create", []);

	},
	update: function() {
		// Update the realm's happenings
		eventSystem.CallEvent("scene-update", []);
		game.debug.text('FPS: ' + game.time.fps || 'FPS: --', 40, 40, "#00ff00");
		game.debug.text(
			`maxHealth: ${gameConfig.playerStats.maxHealth} \n` +
			`maxMana: ${gameConfig.playerStats.maxMana} \n` +
			`maxVelocity: ${gameConfig.playerStats.maxVelocity}\t\t\t \n` +
			`damage: ${gameConfig.playerStats.attacks.light.damage} \n` +
			`speed: ${gameConfig.playerStats.attacks.light.speed} \n` +
			`delay: ${gameConfig.playerStats.attacks.light.delay} \n`
			, 40, 80, "#00ff00");
		if(debuging) cheatActions();
		//game.time.advancedTiming = true;
		if (!sceneData.player.sprite.inWorld && !sceneData.gameComplete){
			sceneData.gameComplete = true;
			gameWin = true;
			game.state.start('endScreen');
		}
	},
};
function CreatePoints(pointsObjs){
	const points = [];
	for(let pointsObj of pointsObjs){
		points.push(new Vector2(pointsObj.x, pointsObj.y));
	}
	return points;
}
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

				if(config.physicsGroup){
					config.physicsGroup.push(body);
				}
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
		let keyTest = game.input.keyboard.addKey(Phaser.Keyboard.X);
		if (keyTest.isDown) { sceneData.HUD.addScore(100); }
	}
}