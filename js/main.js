const config = {
	width: window.innerWidth,
	height: window.innerHeight,
	renderer: Phaser.WEBGL,
	antialias: true,
	multiTexture: true,
	physicsConfig:{
		p2: true,
	}
}
let game = new Phaser.Game(config);

// Entry point
window.onload = startGame;

function startGame() {
	// game.world.setBounds(0, 0, GAME_STAGE_WIDTH, GAME_STAGE_HEIGHT);
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.defaultRestitution = 2;
	
    game.state.add('welcomescreen', welcomeState);
    game.state.add('play', playState);
    game.state.add('about', aboutState);
    game.state.add('config', configState);
	game.state.add('instructions', instructionState);

    game.state.start('welcomescreen');
}