class Collectible {
    constructor(eventSystem, posX, posY, sprite) {
        eventSystem.Subscribe("scene-update", this.Update.bind(this));

        this.sprite = game.add.sprite(posX, posY, sprite);
        this.sprite.getParentComponent = () => this;
        // this.sprite.scale.setTo(0.1,0.1);
        // this.sprite.reset(posX, posY);

        game.physics.p2.enable(this.sprite,true);
        this.body = this.sprite.body;
        this.body.setCollisionGroup(sceneData.collisionGroups.player);
        this.body.collides(sceneData.collisionGroups.collectables, this.onPlayerCollision, this);
        this.body.getParentComponent = () => this;

        this.createCollectables();
    }

    // tedra una funcion que se oasara como paraentro en el contructor
    // una fun que se ejecuta cuando el collecteble es tocado por el jugador
    // le pasamos un string que sea el sprite

    Update() {
    }

    onPlayerCollision(selfBody, playerBody){
        let player = playerBody.getParentComponent();
        console.log(player);
    }
}