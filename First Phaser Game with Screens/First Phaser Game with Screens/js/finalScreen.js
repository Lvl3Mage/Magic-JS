let finalState = {
    create: createFinal
};

/**
 * Initialise the final screen
 */
function createFinal() {
    let endMsg;

    game.input.enabled = true;
    game.stage.backgroundColor = "#fa0";

    // A different message if player won or lost
    if (victoryAtEnd) {
        endMsg = "YOU'VE WON!\n\n";
    } else {
        endMsg = "YOU'VE BEEN DEFEATED!\n\n";
    }
    scoreText = game.add.text(130, 200,
        endMsg + "Now, you have completed\n\nTHIS STUPID GAME!\n\n(click on text to restart)", {
            fontSize: '32px',
            fill: '#0bf'
        });
    scoreText.inputEnabled = true;
    scoreText.events.onInputDown.add(restartGame);
}

/**
 * Restart game
 */
function restartGame() {
    score = 0;
    gameOver = false;
    game.state.start('main');
}