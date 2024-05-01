const ENEMY_VELOCITY = 75;
const ENEMY_STEP_LIMIT = 300;
const ENEMY_DISTANCE_ATTACK = 150;
const ENEMY_Y_OFFSET = 27;
const ENEMY_X_OFFSET = 28;

class Enemy {
    constructor(eventSystem) {
        //Subscribing to event systems here so that the enemy functions properly
        eventSystem.Subscribe("preload", this.Load.bind(this));
        eventSystem.Subscribe("create", this.Create.bind(this));
        eventSystem.Subscribe("update", this.Update.bind(this));
    }

    Load() {
        //Loading the enemy assets here
        //This is a placeholder image
        game.load.image('enemySprite', 'assets/imgs/PLACEHOLDERS/default_cube.png');
    }

    Create() {
        //Creating the enemy here
        const spawnX = Math.random() * (game.world.width - ENEMY_X_OFFSET) + ENEMY_X_OFFSET;
        const spawnY = Math.random() * (game.world.height - ENEMY_Y_OFFSET) + ENEMY_Y_OFFSET;
        
        const enemy = game.add.sprite(spawnX, spawnY, 'enemySprite');
        enemy.anchor.setTo(0.5, 0.5);
    }

    Update() {
        //The enemy behaviour will go here
    }
}