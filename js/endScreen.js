let endState = {
    preload: loadAssets,
    create: display
};

function loadAssets() {
    game.load.image('winbg', 'assets/imgs/Titles/winscreen.png');
    game.load.image('endbg', 'assets/imgs/Titles/losescreen.png');
}

let btnReturnStart;

function display() {
    game.camera.flash(0x000000, 1000); //Game fades in
    game.input.enabled = true;

    if (!gameWin) {
         gameOver();
     } else {
         win();
     }

    //Buttons
    let posX = game.camera.width / 2;
    let posY = game.camera.height / 2;
    let style = {font: '25px Merriweather', fill: '#FFFFFF'};
    let btnHome = createBtn(posX - 450 , posY - 100, `Return from whence you came...`, onHomeBtnPressed, style);
    let btnRestart = createBtn(posX - 450, posY , `Restart`, onStartBtnPressed, style);

    const scoreText = game.add.text(posX - 450, posY + 200 , 'Your score is: ' + totalScore, {font: '35px Merriweather', fill: '#FFFFFF', align: 'center'});
    scoreText.anchor.setTo(0.5, 0.5);
}

function win(){
    imagebg('winbg');
}

function gameOver(){
    imagebg('endbg');
}

function imagebg(image){
    background = game.add.image(0, 0, image);
    background.width = game.width;
    background.height = game.height;
    background.anchor.setTo(0.5, 0.5);
    background.x = game.width / 2;
    background.y = game.height / 2;
}

function createBtn(posX, posY, text, func){
    let btn = game.add.text(posX, posY, text, {font: '30px Merriweather', fill: '#FFFFFF', align: 'center'});
    btn.anchor.setTo(0.5, 0.5);
    btn.inputEnabled = true;
    btn.events.onInputDown.add(func, this); // Add click event listener
    btn.events.onInputOver.add(onBtnHover, this); // Add hover event listener
    btn.events.onInputOut.add(onBtnOut, this); // Add hover out event listener
    return btn;
}

function createText(posX, posY, text, style){
    let scoreText;
    scoreText = game.add.text(posX, posY, text, style);
    scoreText.anchor.setTo(0.5, 0.5);
    scoreText.fixedToCamera = true;
    scoreText.cameraOffset = new Phaser.Point(posX, posY);
}

function onStartBtnPressed() {
    game.camera.fade(0x000000, 2000); // Fade out to black
    game.camera.onFadeComplete.add(function() {
        game.state.start('play');
    }, this);
}

function onHomeBtnPressed() {
    game.camera.fade(0x000000, 2000); // Fade out to black
    game.camera.onFadeComplete.add(function() {
        game.state.start('welcomescreen');
    }, this);
}

function onBtnHover(button) {
    button.text = '~' + button.text + '~';
    game.add.tween(button.scale).to({ x: 1.1, y: 1.1 }, 1000, Phaser.Easing.Quartic.Out, true, 0, 0, false);
}

function onBtnOut(button) {
    button.text = button.text.replaceAll('~', ''); // Replace all occurrences of '~' with an empty string
    game.tweens.removeFrom(button.scale);
    game.add.tween(button.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Quartic.Out, true, 0, 0, false);
}