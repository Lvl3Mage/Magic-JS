const GAME_STAGE_WIDTH = 1920;
const GAME_STAGE_HEIGHT = 1920;

//  3. HUDin-play screens (both for part A & B if done):
let score;
let scoreText;
let level;
let levelText;
let lives;
let livesBar;
let livesBarOutline;
let livesScore; // esto solo irá de 0 a 1
//! 3.b, 3.c


let playState = {
	preload: preloadPlay,
	create: createPlay,
	update: updatePlay
};

function preloadPlay() {
	game.load.image('healthbar_outline', 'assets/imgs/healthbar_outline.png');
	game.load.image('healthbar_mask_red', 'assets/imgs/healthbar_mask_red.png');
}

function createPlay() {
	score = 0;
	level = 1;
	lives = 3;
	livesScore = 1;
	createHUD();



	game.world.setBounds(0, 0, GAME_STAGE_WIDTH, GAME_STAGE_HEIGHT);
	game.camera.roundPx = false;
	eventSystem.CallEvent("create", []);
	
}

function updatePlay() {
    eventSystem.CallEvent("update", []);

}

function createHUD() {
	let scoreX = game.world.width - 10;
	let levelX = game.world.width / 2; //Ya veremos como escala
	let healthX= 10;
	let allY = 10; //game.world.height
	let styleHUD = {fontSize: '18px', fill: '#FFFFFF'};

	scoreText = game.add.text(scoreX,allY,'Score: '+score,styleHUD);
	scoreText.anchor.setTo(1, 0);
	scoreText.fixedToCamera = true;
	scoreText.cameraOffset = new Phaser.Point(scoreX,allY);

	levelText = game.add.text(levelX,allY,'Level: '+level,styleHUD);
	levelText.anchor.setTo(0.5, 0);
	levelText.fixedToCamera = true;
	levelText.cameraOffset = new Phaser.Point(levelX,allY);

	//healthbar
	livesBar = game.add.sprite(healthX, allY, 'healthbar_mask_red');
	livesBar.fixedToCamera = true;
	livesBar.cameraOffset = new Phaser.Point(healthX,allY);
	let barMask = game.add.graphics(0,0);
	barMask.beginFill(0xfff);
	barMask.drawRect(healthX, allY, livesBar.width * livesScore, livesBar.height);
	barMask.endFill();
	livesBar.mask = barMask;
	console.log(livesBar);

	livesBarOutline = game.add.sprite(healthX, allY, 'healthbar_outline');
	livesBarOutline.fixedToCamera = true;
	livesBarOutline.cameraOffset = new Phaser.Point(healthX,allY);
}