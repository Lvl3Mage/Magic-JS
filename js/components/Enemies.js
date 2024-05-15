const ENEMY_VELOCITY = 150;
const ENEMY_DISTANCE_ATTACK = 300;


class Enemy extends Component {
    constructor(eventSystem) {
        super(eventSystem);
        //Subscribing to event systems here so that the enemy functions properly
        eventSystem.Subscribe("scene-update", this.Update, this);

        this.moveDelay = 1000; //At least 1 second delay, remembering this is in milliseconds
        this.moveTimer = Math.random()*this.moveDelay;

        //Creating one enemy
        const spawnX = Math.random() * (game.world.width);
        const spawnY = Math.random() * (game.world.height);

        this.sprite = game.add.sprite(spawnX, spawnY, 'enemySprite');
        this.sprite.getParentComponent = () => this;



        game.physics.p2.enable(this.sprite,false);
        this.body = this.sprite.body;
        this.body.setCollisionGroup(sceneData.collisionGroups.enemies);
        this.body.collides(sceneData.collisionGroups.player, this.onPlayerCollision, this);
        this.body.collides(sceneData.collisionGroups.safeZones);
        this.body.collides(sceneData.collisionGroups.enemies);
        this.body.collides(sceneData.collisionGroups.projectiles);
        this.body.collides(sceneData.collisionGroups.walls);
        this.body.getParentComponent = () => this;



        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.body.fixedRotation = true;

        this.direction = this.randomDirection();

        sceneData.enemiesSpawned ++;
    }

    Update() {
        //The enemy behaviour will go here
        if (!this.isAggressive()) {
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

    isAggressive(){
        //Retrieve the position of the player and enemy to compare
        let playerPos = sceneData.player.GetPosition();
        let enemyPos = new Vector2(this.sprite.centerX, this.sprite.centerY);

        //Calculate the distance between the player and the enemy
        let delta = enemyPos.Sub(playerPos);
        let distance = delta.Length();

        if (distance < ENEMY_DISTANCE_ATTACK){
            return true;
        }
        return false;

    }

    attack(){
        let playerPos = sceneData.player.GetPosition();
        let enemyPos = new Vector2(this.sprite.centerX, this.sprite.centerY);
        let delta = enemyPos.Sub(playerPos);
        delta = delta.Normalized();

        let targetVelocity = delta.Scale(-ENEMY_VELOCITY * 1.7);
        let curVelocity = new Vector2(this.sprite.body.velocity.x, this.sprite.body.velocity.y);
        curVelocity = Vector2.Lerp(curVelocity, targetVelocity, 0.1);

        this.sprite.body.velocity.x = curVelocity.x;
        this.sprite.body.velocity.y = curVelocity.y;
    }

    onPlayerCollision(selfBody, playerBody){
        let player = playerBody.getParentComponent();
        player.takeDamage(10);
    }

    BeforeDestroy(){
        sceneData.collectables = new Collectible(new EventSystem(), this.sprite.body.x, this.sprite.body.y, `xp`);
        this.sprite.destroy();
        sceneData.enemiesSpawned --;
    }
}