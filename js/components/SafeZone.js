class SafeZone extends Component {
	constructor(eventSystem, position, dimensions) {
		super(eventSystem);
		eventSystem.Subscribe("scene-update", this.Update, this);
		eventSystem.Subscribe("on-physics-overlap", this.onOverlap, this);

		this.sprite = game.add.sprite(position.x, position.y, 'safeZoneArea');
		this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.getParentComponent = () => this;
		sceneData.layers.safezone.addChild(this.sprite);

        game.physics.p2.enable(this.sprite,false);

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

		this.safeZoneText = game.add.text(this.sprite.centerX, this.sprite.centerY+150, '', { font: '50px Merryweather', fill: '#000000' });
		this.safeZoneText.anchor.setTo(0.5, 0.5);


		this.createCrystals();

		this.setUpStore()
	}

	createCrystals() {
		const centerX = this.sprite.x;
        const centerY = this.sprite.y;
		const crystalHeight = 150;

		//Now I create super cool crystals
		this.createCrystal(centerX + 30, centerY - (crystalHeight + 50), 'crystal1', 20);
        this.createCrystal(centerX + 50, centerY - (crystalHeight + 20), 'crystal2', 15);
        this.createCrystal(centerX, centerY - crystalHeight, 'crystal3', 10);
    }

    createCrystal(x, y, spriteName, offset) {
        const crystal = game.add.sprite(x, y, spriteName);
        crystal.anchor.setTo(0.5, 0.5);
        sceneData.layers.decor.addChild(crystal);
        const tween = game.add.tween(crystal).to({ y: y - offset }, 1000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
        return { crystal, tween };
    }

	Update(){
		const playerBounds = sceneData.player.sprite.getBounds();
		const safeZoneBounds = this.sprite.getBounds();

		this.ProcessPlayerOverlap()
		this.updateTimer();
	}
	ProcessPlayerOverlap(){
		if(this.playerOverlap){
			const lastTimer = this.safeZoneTimer;
			this.safeZoneTimer -= game.time.elapsed * 0.001;
			let t = 1 - this.safeZoneTimer/this.safeZoneTimerMax;
			let intensity = Mathf.Lerp(0.0001, 0.01, t);
			// game.camera.shake(intensity,50,true);
			if(this.safeZoneTimer <= 0){
				console.log("AWOOGA")
				game.state.start('endScreen');
			}
		}
		else{
			this.safeZoneTimer += game.time.elapsed * 0.001;
		}
		this.safeZoneTimer = Mathf.Clamp(this.safeZoneTimer, 0, this.safeZoneTimerMax);
		this.playerOverlap = false;
	}

	onOverlap(body1, body2){
		// console.log(other.data.shapes);
		if(!body1.data.shapes){return;}
		if(body1.data.shapes.length == 0){return;}
		if(!body2.data.shapes){return;}
		if(body2.data.shapes.length == 0){return;}
		let groups = [body1.data.shapes[0].collisionGroup, body2.data.shapes[0].collisionGroup];
		if(groups.some(group => group === sceneData.collisionGroups.player.mask) &&
			groups.some(group => group === sceneData.collisionGroups.safeZones.mask)){
			this.playerOverlap = true;
		}
	}

	updateTimer(){
		this.safeZoneText.text = Math.round(this.safeZoneTimer)
	}

	setUpStore(){
		const upgradeTypes = Object.keys(gameConfig.upgrades);
		const separation = 200;
		const centerPos = new Vector2(this.sprite.centerX, this.sprite.centerY);
		const startPos = centerPos.Sub(new Vector2(separation*Math.floor(upgradeTypes.length/2), 0));
		console.log(startPos);
		let currentPos = startPos;
		for(let upgrade of upgradeTypes){
			console.log(currentPos);
			new Store(eventSystem, currentPos, gameConfig.upgrades[upgrade]);
			currentPos = currentPos.Add(new Vector2(separation, 0));
		}
	}
}