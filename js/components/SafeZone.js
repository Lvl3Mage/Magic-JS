class SafeZone extends Component {
	constructor(eventSystem, position, dimensions) {
		super(eventSystem);
		eventSystem.Subscribe("scene-update", this.Update, this);
		this.sprite = game.add.sprite(position.x,position.y);
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
	}
	onPlayerCollision(){
		sceneData.HUD.createText(0.5, 1, sceneData.HUD.centerScreen, sceneData.HUD.allY, `Tiempo: ` + 0);
		console.log("Player entered safe zone");
	}
}