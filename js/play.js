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
	game.load.image('collectable', 'assets/imgs/star.png');

    eventSystem.CallEvent("preload", []);
}

function createPlay() {
	game.world.setBounds(0, 0, GAME_STAGE_WIDTH, GAME_STAGE_HEIGHT);
	game.camera.roundPx = false;
	eventSystem.CallEvent("create", []);
	tryCollectables();

}

function updatePlay() {
    eventSystem.CallEvent("update", []);
}

let levelConfig;
const MAX_COLLECTABLE = 10;
let collectable;
let numOfcollectable;

function tryCollectables(){
	// DrawSomeFigures();
	createCollectables();
	drawCollectables();
}

function createCollectables(){
	collectable = game.add.group();
	collectable.enableBody = true;
	collectable.createMultiple(MAX_COLLECTABLE, 'collectable');
	collectable.forEach(setupItem, this);
}

function setupItem(element) {
	element.anchor.setTo(0.5, 0.5);
}

function setupCollectable(collectable){
	let numx = Math.floor(Math.random() * 500); // de 0 a 499
	let numy = Math.floor(Math.random() * 500); // de 0 a 499
	collectable.reset(numx, numy);
    numOfcollectable += 1;
}

function drawCollectables(){
	collectable.forEach(setupCollectable, this);
}


function DrawSomeFigures(){
	const corXsafeArea = 500;
    const corYsafeArea = 500;
    const radiusSafeArea = 100;
    circle = game.add.graphics(0,0);
    circle.beginFill("0xfff");
    circle.drawCircle(corXsafeArea,corYsafeArea,radiusSafeArea);
    circle.endFill();
    square = game.add.graphics(0,0);
    square.beginFill("0xac4");
    square.drawRect(300, 200, 200, 200);
    square.endFill();

}
// Bool en update para que no llame a las funciones de move
// Animacion un tween
// onComplete para acabar el tween