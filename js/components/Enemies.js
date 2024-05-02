const ENEMY_VELOCITY = 75;
const ENEMY_DISTANCE_ATTACK = 150;


class Enemy {
    constructor(eventSystem) {
        //Subscribing to event systems here so that the enemy functions properly
        eventSystem.Subscribe("update", this.Update.bind(this));

        this.isAggressive = false;

        this.moveDelay = 1000; //At least 1 second delay, remembering this is in milliseconds
        this.moveTimer = Math.random()*this.moveDelay;
        
        //Creating one enemy
        const spawnX = Math.random() * (game.world.width);
        const spawnY = Math.random() * (game.world.height);
        
        this.sprite = game.add.sprite(spawnX, spawnY, 'enemySprite');
        this.sprite.scale.setTo(0.1,0.1);

        game.physics.p2.enable(this.sprite,true);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.body.fixedRotation = true;

        this.direction = this.randomDirection();
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
        const targetVelocity = this.direction.Scale(ENEMY_VELOCITY);
        let curVelocity = new Vector2(this.sprite.body.velocity.x, this.sprite.body.velocity.y);
        curVelocity = Vector2.Lerp(curVelocity, targetVelocity, 0.1);

        this.sprite.body.velocity.x = curVelocity.x;
        this.sprite.body.velocity.y = curVelocity.y;

        //I need a timer so that the time intervals are also randomised
        this.moveTimer += game.time.elapsed; //This is in milliseconds
        if(this.moveTimer >= this.moveDelay){
            this.direction = this.randomDirection();
            //Once it has moved to the new position, we reset the timer
            this.moveTimer = 0;
        }
    }

    randomDirection() {
        const randomAngle = Math.random() * Math.PI * 2; //Selects a random number between 0 and 1 and multiplies by 2PI to get an angle
        const dir = new Vector2(Math.cos(randomAngle), Math.sin(randomAngle));
        return dir;
    }

    attack() {
        //Check if the player is within the attack distance
        
    }
}