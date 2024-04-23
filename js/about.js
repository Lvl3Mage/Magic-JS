let aboutState = {
    preload: loadAboutAssets,
    create: showInstructions
};

function loadAboutAssets() {
    game.load.image('backButton', 'assets/imgs/TEMPORARY IMAGES/configButton.png'); //TEMPORARY IMAGE, will be created later on
    game.load.image('aboutTitle', 'assets/imgs/Titles/ABOUT.png');
}

function showInstructions() {
    title = game.add.image(GAME_STAGE_WIDTH / 2, 100, 'aboutTitle');
    title.anchor.setTo(0.5, 0);
    title.scale.setTo(0.8, 0.8);

    const text = game.add.text(GAME_STAGE_WIDTH / 2, 350, 'A game created by group 1: Karl Marx', {
        font: '24px Arial',
        fill: '#ffffff',
        align: 'center'
    });
    text.anchor.setTo(0.5, 0);
}