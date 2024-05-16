const config = {
	width: window.innerWidth,
	height: window.innerHeight,
	renderer: Phaser.WEBGL,
	antialias: true,
	multiTexture: true,
	physicsConfig:{
		p2: true,
	},
}
let game = new Phaser.Game(config);
let gameWin = false;
let difficulty = 'easy';
// Entry point
window.onload = startGame;

function startGame() {
	// game.world.setBounds(0, 0, GAME_STAGE_WIDTH, GAME_STAGE_HEIGHT);
	configurePhysics();

	game.time.advancedTiming = true;
	game.camera.roundPx = true;

    game.state.add('welcomescreen', welcomeState);
    game.state.add('play', playState);
    game.state.add('about', aboutState);
    game.state.add('config', configState);
	game.state.add('instructions', instructionState);
	game.state.add('endScreen', endState);

	
    game.state.start('play');
}
function configurePhysics(){
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.useElapsedTime = true;
	game.physics.p2.defaultRestitution = 2;
	game.physics.p2.setImpactEvents(true);
}