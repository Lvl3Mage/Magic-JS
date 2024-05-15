class SafeZone extends Component {
	constructor(eventSystem, position, dimensions) {
		super(eventSystem);
		eventSystem.Subscribe("scene-update", this.Update, this);
		
		this.sprite = game.add.sprite(game.world.width / 2, game.world.height / 2);
        this.sprite.getParentComponent = () => this;

        game.physics.p2.enable(this.sprite,true);

		this.body = this.sprite.body;
		this.body.fixedRotation = true;
		console.log(this.sprite);
		this.body.clearShapes();
		this.body.addRectangle(dimensions.x, dimensions.y);
        this.body.setCollisionGroup(sceneData.collisionGroups.safeZones);
		this.body.collides(sceneData.collisionGroups.player, this.onPlayerCollision, this);
        this.body.collides(sceneData.collisionGroups.enemies);
        this.body.kinematic = true;
        console.log(this.body);
	}

	Update(){
		const playerBounds = sceneData.player.sprite.getBounds();
		const safeZoneBounds = this.sprite.getBounds();

		if (Phaser.Rectangle.intersects(playerBounds, safeZoneBounds)){
			console.log("Player entered safe zone");
		} else {
			console.log("Player left safe zone");
		}
	}

	onPlayerCollision(){
		//sceneData.HUD.createText(0.5, 1, sceneData.HUD.centerScreen, sceneData.HUD.allY, `Tiempo: ` + 0);
		//console.log("Player entered safe zone");
	}
}