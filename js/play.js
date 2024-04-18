
//  3. HUDin-play screens (both for part A & B if done):
let score;
let scoreText;
let level;
let levelText;
let lives;
let livesBar;
let livesScore;
//! 3.b, 3.c


let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {

}

function createPlay() {
    score = 0;
    level = 1;
    lives = 3;

    createHUD();
}

function updatePlay() {

}



function createHUD() {
    let scoreX = 1;
    let levelX = game.world.width / 2; //Ya veremos como escala
    let allY = game.world.height - 25;
    let styleHUD = {fontSize: '18px', fill: '#FFFFFF'};
    scoreText = game.add.text(scoreX,allY,'Score: '+score,styleHUD);
    levelText = game.add.text(levelX,allY,'Level: '+level,styleHUD);
    levelText.anchor.setTo(0.5, 0);
}

//NOT IMPLEMENTED
function updateLife(num){
    let livesBar = document.getElementById("livesScore");
    livesScore += num;
    console.log(livesScore);
    let porcentajeVida = (livesScore / lives) * 100; // 3 vidas en total
    livesBar.style.width = porcentajeVida + "%";
    // livesBar.anchor.setTo(1, 0);
}