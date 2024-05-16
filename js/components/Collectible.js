class Collectible {
    constructor(eventSystem, posX, posY, sprite) {
        eventSystem.Subscribe("scene-update", this.Update,this);

        this.sprite = game.add.sprite(posX, posY, sprite);
        this.sprite.scale.setTo(0.3, 0.3);
        this.sprite.getParentComponent = () => this;

        game.physics.p2.enable(this.sprite, false);
        this.body = this.sprite.body;
        this.body.setCollisionGroup(sceneData.collisionGroups.collectables);
        this.body.collides(sceneData.collisionGroups.player, this.onPlayerCollision, this);
        this.body.getParentComponent = () => this;
        this.bopPhaseOffset = Math.random();


        this.attractionDistance = 200;
        this.maxAttractionVelocity = 1000;
    }

    Update() {
        const x = game.time.totalElapsedSeconds() + Mathf.TransformRange(0,1 , 0,Math.PI, this.bopPhaseOffset) ;
        let bop = Math.sin(x);
        this.sprite.anchor.setTo(0.5, Mathf.TransformRange(-1,1 , 0.5,1, bop));

        this.MoveToPlayer();
    }
    MoveToPlayer(){
        const delta = sceneData.player.GetPosition().Sub(new Vector2(this.sprite.centerX, this.sprite.centerY));
        const distance = delta.Length();
        let velocityMagnitude = Mathf.TransformRange(0,this.attractionDistance, this.maxAttractionVelocity, 0, distance);
        velocityMagnitude = Mathf.Clamp(velocityMagnitude,0, this.maxAttractionVelocity);
        const dir = delta.Normalized();
        let currentVel = new Vector2(this.body.velocity.x, this.body.velocity.y);
        currentVel = Vector2.Lerp(currentVel, dir.Scale(velocityMagnitude), 0.1);
        console.log(dir.Scale(velocityMagnitude));
        this.body.velocity.x = currentVel.x;
        this.body.velocity.y = currentVel.y;

    }

    // fun que se ejecuta cuando el collecteble es tocado por el jugador
    onPlayerCollision(selfBody, playerBody){
        let player = playerBody.getParentComponent();
        this.sprite.destroy();
        sceneData.HUD.addScore(5);
        console.log(sceneData.HUD);
    }
}