class Projectile {
	constructor(eventSystem, spriteName, position, velocity) {
		eventSystem.Subscribe("scene-update", this.Update.bind(this));
		this.sprite = game.add.sprite(position.x, position.y, spriteName);
		game.physics.p2.enable(this.sprite, true);
		this.body = this.sprite.body;
		this.body.setCollisionGroup(sceneData.collisionGroups.projectiles);
		this.body.collides(sceneData.collisionGroups.enemies, this.onEnemyCollision, this);
		this.body.velocity.x = velocity.x;
		this.body.velocity.y = velocity.y;
		this.body.collideWorldBounds = false;
		console.log(this.body);
		console.log(game.physics.p2);
		this.body.getParentComponent = () => this;
	}
	Update(){
		console.log(this.sprite);
	}
	onEnemyCollision(self, other){
		console.log(other)
		this.Destroy();
	}
	Destroy(){
		console.log("Destroy")
		eventSystem.Unsubscribe("scene-update", this.Update.bind(this));
		this.sprite.destroy();
		// delete this;
	}
}