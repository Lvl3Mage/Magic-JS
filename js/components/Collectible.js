class Collectible {
    constructor(eventSystem, posX, posY, collectibleConfig) {
        eventSystem.Subscribe("scene-update", this.Update,this);

        this.sprite = game.add.sprite(posX, posY, collectibleConfig.spriteName);
        this.sprite.scale.setTo(0.3, 0.3);
        this.sprite.getParentComponent = () => this;
        this.config = collectibleConfig;
        this.collectDistance = 50;
        this.bopPhaseOffset = Math.random();


        this.attractionDistance = 200;
        this.maxAttractionVelocity = 2000;
        this.velocity = new Vector2(0,0);
    }

    Update() {
        const x = game.time.totalElapsedSeconds() + Mathf.TransformRange(0,1 , 0,Math.PI, this.bopPhaseOffset) ;
        let bop = Math.sin(x);
        this.sprite.anchor.setTo(0.5, Mathf.TransformRange(-1,1 , 0.5,1, bop));

        this.MoveToPlayer();
        
        const distanceToPLayer = sceneData.player.GetPosition().Sub(new Vector2(this.sprite.centerX, this.sprite.centerY)).Length();
        if(distanceToPLayer < 50){
            this.config.onPlayerCollision.call(this);
        }
    }
    MoveToPlayer(){
        const delta = sceneData.player.GetPosition().Sub(new Vector2(this.sprite.centerX, this.sprite.centerY));
        const distance = delta.Length();
        let velocityMagnitude = Mathf.TransformRange(0,this.attractionDistance, this.maxAttractionVelocity, 0, distance);
        velocityMagnitude = Mathf.Clamp(velocityMagnitude,0, this.maxAttractionVelocity);
        const dir = delta.Normalized();
        this.velocity = Vector2.Lerp(this.velocity, dir.Scale(velocityMagnitude), 0.1);
        this.sprite.x += this.velocity.x * game.time.elapsed * 0.001;
        this.sprite.y += this.velocity.y * game.time.elapsed * 0.001;

    }
}

/* Construccion
new Collectible(eventSystem, this.sprite.body.x, this.sprite.body.y,
			{
				spriteName: `xp`,
				onPlayerCollision: function(){
					this.sprite.destroy();
        			sceneData.HUD.addScore(5);
				}
			});
*/