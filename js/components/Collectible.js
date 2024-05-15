class Collectible {
    constructor(eventSystem, posX, posY, sprite) {
        eventSystem.Subscribe("scene-update", this.Update,this);

        this.sprite = game.add.sprite(posX, posY, sprite);
        this.sprite.scale.setTo(0.3, 0.3);
        this.sprite.getParentComponent = () => this;

        game.physics.p2.enable(this.sprite, true);
        this.body = this.sprite.body;
        this.body.setCollisionGroup(sceneData.collisionGroups.collectables);
        this.body.collides(sceneData.collisionGroups.player, this.onPlayerCollision, this);
        this.body.getParentComponent = () => this;
        this.bopPhaseOffset = Math.random();
    }

    Update() {
        const x = game.time.totalElapsedSeconds() + Mathf.TransformRange(0,1 , 0,Math.PI, this.bopPhaseOffset) ;
        let bop = Math.sin(x);
        this.sprite.anchor.setTo(0.5, Mathf.TransformRange(-1,1 , 0,1, bop));
    }

    // fun que se ejecuta cuando el collecteble es tocado por el jugador
    onPlayerCollision(selfBody, playerBody){
        let player = playerBody.getParentComponent();
        this.sprite.destroy();
        sceneData.HUD.setScore(5);
        console.log(sceneData.HUD);
    }
}