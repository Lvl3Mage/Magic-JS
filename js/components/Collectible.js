class Collectible {
    constructor(eventSystem, posX, posY, sprite) {
        eventSystem.Subscribe("scene-update", this.Update.bind(this));

        this.sprite = game.add.sprite(posX, posY, sprite);
        this.sprite.getParentComponent = () => this;
        // this.sprite.scale.setTo(0.1,0.1);
        // this.sprite.reset(posX, posY);

        game.physics.p2.enable(this.sprite, true);
        this.body = this.sprite.body;
        this.body.setCollisionGroup(sceneData.collisionGroups.collectables);
        this.body.collides(sceneData.collisionGroups.player, this.onPlayerCollision, this);
        this.body.getParentComponent = () => this;
    }

    Update() {
    }

    // fun que se ejecuta cuando el collecteble es tocado por el jugador
    onPlayerCollision(selfBody, playerBody){
        let player = playerBody.getParentComponent();
        this.sprite.destroy();
        sceneData.HUD.setScore(5);
        console.log(sceneData.HUD);
    }
}