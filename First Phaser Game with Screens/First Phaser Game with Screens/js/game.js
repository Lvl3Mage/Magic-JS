const VICTORY_POINTS = 500;
const TOTAL_STARS = 12;

let game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

let mainState = {
    preload: loadAssets,
    create: initialiseGame,
    update: gameUpdate
};

let platforms;
let player;
let cursors;
let stars;
let bombs;
let score = 0;
let scoreText;
let numStars;
let gameOver = false;
let victoryAtEnd;
let soundVictory;
let soundDefeat;

game.state.add('main', mainState);
game.state.add('final', finalState);

game.state.start('main');

// methods
/**
 * Load the assets
 */
function loadAssets() {
    game.load.image('sky', 'assets/imgs/sky.png');
    game.load.image('ground', 'assets/imgs/platform.png');
    game.load.image('star', 'assets/imgs/star.png');
    game.load.image('bomb', 'assets/imgs/bomb.png');
    game.load.spritesheet('dude', 'assets/imgs/dude.png', 32, 48);
    game.load.audio('victory', 'assets/snds/victoryCry.wav');
    game.load.audio('defeat', 'assets/snds/defeated.wav');
}

/**
 * Initialise the stage
 */
function initialiseGame() {
    // initial value for numStars
    numStars = TOTAL_STARS;

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    let ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    let ledge = platforms.create(400, 384, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 234, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(550, 204, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    // Same with bombs
    bombs = game.add.group();
    bombs.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (let i = 0; i < numStars; i++) {
        //  Create a star inside of the 'stars' group
        let star = stars.create(i * 70, 0, 'star');
        //  Let gravity do its thing
        star.body.gravity.y = 300;
        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    // The score
    scoreText = game.add.text(16, 16, 'Score: ' + score, {
        fontSize: '32px',
        fill: '#000'
    });

    // Sounds
    soundVictory = game.add.audio('victory');
    soundDefeat = game.add.audio('defeat');

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
}

/**
 * Game loop: update elements and check events
 */
function gameUpdate() {
    //  If game is already over do nothing
    if (gameOver) {
        return;
    }
    //  Collide the player, the stars and the bombs with the platforms
    let hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the
    //  collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    // Same with bombs
    game.physics.arcade.overlap(player, bombs, hitBomb, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -150;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 150;
        player.animations.play('right');
    } else {
        //  Stand still
        player.animations.stop();
        player.frame = 4;
    }

    // Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
        player.body.velocity.y = -325;
    }
}

function collectStar(player, star) {
    // Removes the star from the screen
    star.kill();
    numStars--;
    // Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

    // If there are no more stars, reset them and drop a bomb
    if (numStars === 0) {
        stars.forEachDead(function (s) {
            s.revive();
            s.y = 0;
        });
        numStars = TOTAL_STARS;
        let x = (player.x < 400) ? Phaser.Math.between(400, 800) : Phaser.Math.between(0, 400);
        let bomb = bombs.create(x, 16, 'bomb');
        bomb.body.bounce.x = bomb.body.bounce.y = 1;
        bomb.body.collideWorldBounds = true;
        bomb.body.velocity.x = Phaser.Math.between(-200, 200);
        bomb.body.velocity.y = 200;
        bomb.body.allowGravity = false;
    }

    // check if the player wins
    if (score > VICTORY_POINTS) {
        victoryAtEnd = true;
        endGame();
    }
}

function hitBomb(player, bomb) {
    player.tint = 0xff0000;
    victoryAtEnd = false;
    endGame();
}

function endGame() {
    // Game Over
    gameOver = true;

    // Stop and reset input
    game.input.enabled = false;
    cursors.left.reset(true);
    cursors.right.reset(true);
    cursors.up.reset(true);
    cursors.down.reset(true);

    // Stop player
    player.animations.stop();
    player.frame = 4;
    player.body.velocity.x = player.body.velocity.y = 0;
    player.body.bounce.y = 0;
    player.body.gravity.y = 0;

    // Cleaning...
    stars.removeAll(true);
    bombs.removeAll(true);

    // Final animation (a tween)
    let finalTween = game.add.tween(player.scale).to({
            x: 2,
            y: 2
        }, 1000,
        Phaser.Easing.Cubic.Out, true, 0, 2, true);

    finalTween.onComplete.add(function () {
        player.destroy();
        platforms.removeAll(true);
        game.state.start('final');
    });

    if (victoryAtEnd) {
        soundVictory.play();
    } else {
        soundDefeat.play();
    }
}