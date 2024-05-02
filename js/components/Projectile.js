class Projectile {
	constructor(eventSystem, spriteName, velocity) {
		eventSystem.Subscribe("scene-update", this.Update.bind(this));
		this.sprite = game.add.sprite(0, 0, spriteName);
		game.physics.p2.enable(this.sprite, true);
		this.body = this.sprite.body;
		this.body.setCollisionGroup(sceneData.collisionGroups.projectiles);
		
	}
	Update(){
	}
}