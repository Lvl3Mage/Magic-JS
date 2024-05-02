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

        this.isAggressive = false;

        this.moveTimer = 0;
        this.moveDelay = 1000; //At least 1 second delay, remembering this is in milliseconds
    }

    Load() {
        //Loading the enemy assets here
        //This is a placeholder image
        game.load.image('enemySprite', 'assets/imgs/PLACEHOLDERS/default_cube.png');
    }

    Create() {
        //Creating one enemy
        const spawnX = Math.random() * (game.world.width - ENEMY_X_OFFSET) + ENEMY_X_OFFSET;
        const spawnY = Math.random() * (game.world.height - ENEMY_Y_OFFSET) + ENEMY_Y_OFFSET;
        
        this.sprite = game.add.sprite(spawnX, spawnY, 'enemySprite');
        this.sprite.anchor.setTo(0.5, 0.5);
    }

    Update() {
        //The enemy behaviour will go here
        if (this != this.isAggressive) {
            this.moveAround();
        }
        else {
            this.attack();
        }
    }

    moveAround() {
        //I'll make the enemy follow a random path
        //I need a timer so that the time intervals are also randomised
        this.moveTimer += game.time.elapsed; //This is in milliseconds

        if(this.moveTimer >= this.moveDelay){
            const randomAngle = Math.random() * Math.PI * 2; //Selects a random number between 0 and 1 and multiplies by 2PI to get an angle

            const newX = this.sprite.x + Math.cos(randomAngle) *  ENEMY_VELOCITY;
            const newY = this.sprite.y + Math.sin(randomAngle) *  ENEMY_VELOCITY;

            game.physics.arcade.moveToObject(this.sprite, { x: newX, y: newY }, ENEMY_VELOCITY);

            //Once it has moved to the new position, we reset the timer
            this.moveTimer = 0;
        }
    }

    attack() {
        //Check if the player is within the attack distance

    }
}