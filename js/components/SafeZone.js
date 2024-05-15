class SafeZone extends Component {
	constructor(eventSystem, position, dimensions) {
		super(eventSystem);
		eventSystem.Subscribe("scene-update", this.Update, this);
		eventSystem.Subscribe("on-physics-overlap", this.onOverlap, this);
		
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
       	this.playerOverlap = false;
       	this.safeZoneTimerMax = 10;
       	this.safeZoneTimer = this.safeZoneTimerMax;
	}

	Update(){
		const playerBounds = sceneData.player.sprite.getBounds();
		const safeZoneBounds = this.sprite.getBounds();

		this.ProcessPlayerOverlap()
	}
	ProcessPlayerOverlap(){
		if(this.playerOverlap){
			const lastTimer = this.safeZoneTimer;
			this.safeZoneTimer -= game.time.elapsed * 0.001;
			let t = 1 - this.safeZoneTimer/this.safeZoneTimerMax;
			let intensity = Mathf.Lerp(0.0001, 0.01, t);
			game.camera.shake(intensity,50,true);
			if(this.safeZoneTimer <= 0){
				console.log("AWOOGA")
			}
		}
		else{
			this.safeZoneTimer += game.time.elapsed * 0.001;
		}
		this.safeZoneTimer = Mathf.Clamp(this.safeZoneTimer, 0, this.safeZoneTimerMax);
		console.log(this.playerOverlap)
		this.playerOverlap = false;
	}

	onOverlap(body1, body2){
		// console.log(other.data.shapes);
		if(!body1.data.shapes){return;}
		if(body1.data.shapes.length == 0){return;}
		if(!body2.data.shapes){return;}
		if(body2.data.shapes.length == 0){return;}
		console.log("other.data.shapes");
		if(body1.data.shapes[0].collisionGroup === sceneData.collisionGroups.player.mask ||
			body2.data.shapes[0].collisionGroup === sceneData.collisionGroups.player.mask){
			this.playerOverlap = true
		}
	}
}