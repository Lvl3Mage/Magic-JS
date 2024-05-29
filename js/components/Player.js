class Player extends Component {
	constructor(eventSystem, position) {
		super(eventSystem);
		eventSystem.Subscribe("scene-update", this.Update, this);
		//Input handling
		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.upArrow = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.downArrow = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.leftArrow = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.rightArrow = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);


		//Player Parameters
		Object.defineProperty(this, 'maxVelocity', { get: () =>  gameConfig.playerStats.maxVelocity});
		this.accelerationFactor = 0.1;
		this.maxTilt = 25;
		this.bopFreq = 15;
		this.maxTiltBopAmp = 15;
		this.bopAmp = 0.3;

		//shadow
		this.shadowScale = 0.5;
		this.shadowJumpScale = 0.7;
		this.shadowAlpha = 0.1;
		this.shadowJumpAlpha = 0.4;
		this.shadowAnchor = new Vector2(0.5, 0.6);

		Object.defineProperty(this, 'immunityDuration', { get: () =>  gameConfig.playerStats.immunityDuration});
		this.immune = false;

		this.colliderScale = new Vector2(0.5,0.7);

		//
		//
		Object.defineProperty(this, 'maxHealth', { get: () =>  gameConfig.playerStats.maxHealth});
		this.health = this.maxHealth;
		Object.defineProperty(this, 'maxMana', { get: () =>  gameConfig.playerStats.maxMana});
		this.mana = this.maxMana;

		//Hand Parameters
		this.maxHandDistance = 36;
		this.handCursorDistance = 10;
		this.handVelocityMultiplier = 20;
		this.handMaxVelocity = 400;
		this.handVelocityLerpFactor = 0.3;
		this.handVelocity = new Vector2(0,0);
		this.handAngularFactor = 0.2;

		this.handOrbitPivotOffset = new Vector2(0,-0.15);

		this.debug = false;

		this.maxCameraDistance = 700;
		this.maxCameraLerp = 0.3;
		this.cameraCursorInfluence = 0.3;
		this.minCameraLerp = 0.001;

		this.sprite = game.add.sprite(position.x, position.y, 'main-character');
		this.sprite.getParentComponent = () => this;
		game.physics.p2.enable(this.sprite, this.debug);
		this.body = this.sprite.body;
		this.body.fixedRotation = true;

		this.body.clearShapes();
		const apparentScale = new Vector2(this.sprite.width*this.colliderScale.x, this.sprite.height*this.colliderScale.y);
		this.body.addCapsule(apparentScale.y-apparentScale.x, apparentScale.x/2, 0, -apparentScale.y*0.5, Mathf.Deg2Rad(90));

		this.body.setCollisionGroup(sceneData.collisionGroups.player);
		this.body.collides([sceneData.collisionGroups.enemies, sceneData.collisionGroups.collectables, sceneData.collisionGroups.walls, sceneData.collisionGroups.store]);
		this.body.getParentComponent = () => this;

		this.sprite.anchor.setTo(0.5, 1);
		// this.sprite.scale.setTo(0.7, 0.7);x

		this.handSprite = game.add.sprite(0, 0, 'hand');
		this.handSprite.anchor.setTo(0.5, 0.5);
		this.handSprite.scale.setTo(-0.15, 0.15);

		this.sprite.addChild(this.handSprite);
		sceneData.layers.player.addChild(this.sprite);

		this.shadow = game.add.sprite(position.x, position.y, 'shadow');
		this.shadow.anchor.setTo(this.shadowAnchor.x, this.shadowAnchor.y);
		sceneData.layers.shadows.addChild(this.shadow);

		this.canFire = true;


		game.camera.x = this.sprite.x - game.camera.width*0.5;
		game.camera.y = this.sprite.y - game.camera.height*0.5;
	}
	GetInputAxis(){
		let axis = new Vector2(0,0);
		if (this.upKey.isDown || this.upArrow.isDown)
		{
			axis.y--;
		}
		else if (this.downKey.isDown || this.downArrow.isDown)
		{
			axis.y++;
		}
		if (this.leftKey.isDown || this.leftArrow.isDown)
		{
			axis.x--;
		}
		else if (this.rightKey.isDown || this.rightArrow.isDown)
		{
			axis.x++;
		}
		return axis;
	}
	Update(){
		this.PlayerMovement();
		this.PlayerJump();

		this.TrackCamera();

		this.HandMovement();
		this.HandRotation();
		this.UpdateShadow();

		if(game.input.mousePointer.leftButton.isDown && this.canFire && this.mana > 0){
			this.mana --;

			this.canFire = false;
			let handRight = this.GetHandForward();
			this.handVelocity = this.handVelocity.Sub(handRight.Scale(1000));
			this.handSprite.angle -= 90*(Math.random()*2 - 1);
			let velocity = this.GetVelocity().Sub(handRight.Scale(500));
			this.SetVelocity(velocity);

			game.camera.shake(0.01,100);

			game.time.events.add(300, () => this.canFire = true);

			new Projectile(eventSystem, this.GetHandPosition(), handRight.Scale(1000),
			{
				spriteName: "bullet",
				spriteScale: new Vector2(0.6,0.6),
				mass: 60,
				wobbleFrequency: 20,
				wobbleMagnitude: 0.2,
				collisionConfigs: [
					{
						collisionGroup: sceneData.collisionGroups.enemies,
						callback: function(self, other){
							const enemy = other.getParentComponent();
							enemy.Damage(5);
							const knockBackFactor = gameConfig.playerStats.attacks.light.knockbackFactor
							enemy.body.velocity.x = this.GetVelocity().x*knockBackFactor;
							enemy.body.velocity.y = this.GetVelocity().y*knockBackFactor;
							this.Destroy();
						}
					},
					{
						collisionGroup: sceneData.collisionGroups.walls,
						callback: function(self, other){
							this.Destroy();
						}
					},
				]
			});
		}

	}
	UpdateShadow(){
		this.shadow.x = this.sprite.x;
		this.shadow.y = this.sprite.y;
		let bop = this.GetPlayerBop();
		let shadowScale = Mathf.TransformRange(0, 1, this.shadowScale, this.shadowJumpScale, bop);
		this.shadow.scale.setTo(shadowScale,shadowScale);
		this.shadow.alpha = Mathf.TransformRange(0, 1, this.shadowAlpha, this.shadowJumpAlpha, bop);
	}
	GetTargetVelocity(){
		const axis = this.GetInputAxis();
		const targetVel = axis.Scale(this.maxVelocity);
		return targetVel;

	}
	PlayerMovement(){
		let velocity = this.GetVelocity();
		let currentVel = Vector2.Lerp(velocity, this.GetTargetVelocity(), this.accelerationFactor);
		this.sprite.body.velocity.x = currentVel.x;
		this.sprite.body.velocity.y = currentVel.y;
	}
	GetPlayerBop(){
		const velocity = this.GetVelocity();
		return Mathf.TransformRange(0, this.maxVelocity, 1, 0.9 + Math.abs(Math.sin(game.time.totalElapsedSeconds()*this.bopFreq*0.5)*this.bopAmp), velocity.Length());

	}
	PlayerJump(){
		const velocity = this.GetVelocity();
		let curMaxTilt = this.maxTilt - Math.abs(Math.sin(game.time.totalElapsedSeconds()*this.bopFreq*0.5)*this.maxTiltBopAmp)
		let rotation = Mathf.TransformRange(-1*this.maxVelocity,1*this.maxVelocity, -curMaxTilt, curMaxTilt, velocity.x);
		this.sprite.angle = rotation;
		let bop = this.GetPlayerBop();

		this.sprite.anchor.setTo(0.5, bop);
	}
	TrackCamera(){
		const worldCursor = CoordUtils.ScreenSpaceToWorldSpace(new Vector2(game.input.mousePointer.x, game.input.mousePointer.y));
		const camCenterPos = new Vector2(game.camera.centerX, game.camera.centerY);
		const playerPos = new Vector2(this.sprite.centerX, this.sprite.centerY);
		const targetPos = Vector2.Lerp(playerPos, worldCursor, this.cameraCursorInfluence);
		const distance = targetPos.Sub(camCenterPos).Length();

		const lerpFactor = Mathf.Clamp(Mathf.TransformRange(0, this.maxCameraDistance, this.minCameraLerp, this.maxCameraLerp, distance),0,this.maxCameraLerp);

		game.debug.text(`lerpFactor: ${lerpFactor}`, 10, 10, '#00ff00');
		const dif = Vector2.Lerp(camCenterPos, targetPos, lerpFactor).Sub(camCenterPos);
		game.camera.x += dif.x;
		game.camera.y += dif.y;
	}
	HandMovement(){
		const bop = this.GetPlayerBop();

		let worldCursor = CoordUtils.ScreenSpaceToWorldSpace(new Vector2(game.input.mousePointer.x, game.input.mousePointer.y));
		let localCursor = CoordUtils.InverseTransformPoint(worldCursor, this.GetSpriteCenter(this.handOrbitPivotOffset), Mathf.Deg2Rad(this.sprite.angle));

		const cursorDistance = localCursor.Length();
		const handOutwardsVector = localCursor.Normalized().Scale(Math.min(cursorDistance-this.handCursorDistance, this.maxHandDistance)); // local coordinate centered around sprite center



		//transforming outwards vector to world space
		const worldTargetHandPos =  CoordUtils.TransformPoint(handOutwardsVector, this.GetSpriteCenter(this.handOrbitPivotOffset), Mathf.Deg2Rad(this.sprite.angle));
		const localHandPos = CoordUtils.InverseTransformPoint(worldTargetHandPos, this.GetRootPosition(), Mathf.Deg2Rad(this.sprite.angle));

		let currentHandPos = new Vector2(this.handSprite.x, this.handSprite.y);
		let targetHandVelocity = localHandPos.Sub(currentHandPos).Scale(this.handVelocityMultiplier).ClampLength(0,this.handMaxVelocity);
		this.handVelocity = Vector2.Lerp(this.handVelocity, targetHandVelocity, this.handVelocityLerpFactor);
		currentHandPos = Vector2.Add(currentHandPos, this.handVelocity.Scale(game.time.delta*0.001));
		this.handSprite.x = currentHandPos.x;
		this.handSprite.y = currentHandPos.y;

	}
	GetHandForward(){
		return CoordUtils.TransformPoint(Vector2.right, Vector2.zero, Mathf.Deg2Rad(this.handSprite.angle + this.sprite.angle));
	}
	HandRotation(){
		let worldHandPos = this.GetHandPosition();

		let worldCursor = CoordUtils.ScreenSpaceToWorldSpace(new Vector2(game.input.mousePointer.x, game.input.mousePointer.y));
		let handToMouse = worldCursor.Sub(worldHandPos);

		let currentHandAngle = this.handSprite.angle;
		let handAngle = Mathf.Rad2Deg(Math.atan2(handToMouse.y, handToMouse.x)) - this.sprite.angle;

		let deltaAngle = Mathf.DeltaAngle(currentHandAngle,handAngle);
		this.handSprite.angle += deltaAngle*this.handAngularFactor;
		let currentScale = this.handSprite.scale.y;
		currentScale = Mathf.Lerp(currentScale, Mathf.WrapAngle(this.handSprite.angle-90) < 0 ? 0.15 : -0.15, 0.3);
		this.handSprite.scale.setTo(this.handSprite.scale.x, currentScale);
		if(this.debug){
			const fwd = CoordUtils.TransformPoint(Vector2.right.Scale(handToMouse.Length()), worldHandPos, Mathf.Deg2Rad(this.handSprite.angle + this.sprite.angle));
			game.debug.geom(new Phaser.Line(worldHandPos.x, worldHandPos.y, fwd.x,fwd.y), '#F00');
		}
	}
	GetHandPosition(){
		const localHandPos = new Vector2(this.handSprite.x, this.handSprite.y);
		const worldHandPos = CoordUtils.TransformPoint(localHandPos, this.GetRootPosition(), Mathf.Deg2Rad(this.sprite.angle));
		return worldHandPos; //vector2
	}
	GetRootPosition(){
		return new Vector2(this.sprite.x, this.sprite.y);
	}
	GetBodyCenter(){
		return new Vector2(this.sprite.centerX, this.sprite.centerY);
	}
	GetSpriteCenter(offset = null){
		if(!offset){
			offset = Vector2.zero;
		}
		const bop = this.GetPlayerBop();
		return CoordUtils.TransformPoint(new Vector2(offset.x, -this.sprite.height*(0.5 + offset.y + bop - 1)), this.GetRootPosition(), Mathf.Deg2Rad(this.sprite.angle));

	}

	//Public Methods
	GetVelocity(){
		return new Vector2(this.sprite.body.velocity.x, this.sprite.body.velocity.y);
	}
	SetVelocity(velocity){
		this.sprite.body.velocity.x = velocity.x;
		this.sprite.body.velocity.y = velocity.y;
	}
	GetPosition(){
		return this.GetBodyCenter();
	}
	FlashTint(color, inDuration, outDuration, colorFrom = null){
		var colorBlend = {step: 0};
		if(!colorFrom){
			colorFrom = this.sprite.tint;
		}
		game.add.tween(colorBlend).to({step: 1}, inDuration, Phaser.Easing.Default, true)
		.onUpdateCallback(() => {
			this.sprite.tint = Phaser.Color.interpolateColor(colorFrom, color, 1, colorBlend.step, 1);
		})
		.onComplete.add(() => {
			const backTween = game.add.tween(colorBlend).to({step: 0}, outDuration, Phaser.Easing.Default, true);
			backTween.onComplete.add(() => {
				this.sprite.tint = colorFrom;
			})
			backTween.onUpdateCallback(() => {
				this.sprite.tint = Phaser.Color.interpolateColor(colorFrom, color, 1, colorBlend.step, 1);
			});
		})

	}
	takeDamage(amount){
		if(this.immune){
			return;
		}
		if(this.health <= 0){
			return;
		}
		this.FlashTint(0xf94449, 50, this.immunityDuration-50, 0xffffff);
		this.health -= amount;
		this.health = Mathf.Clamp(this.health, 0, this.maxHealth);

		sceneData.sounds.hurt.play();

		this.immune = true;
		game.time.events.add(this.immunityDuration, () => {
			this.immune = false;
		});

		console.log("OUCHING PLAYER, health: " + this.health);

		if (this.health <= 0) {
			gameWin = false;
			game.camera.fade(0x000000, 2000);
			game.state.start('endScreen');
		}
	}
	Heal(amount){
		if (this.health <= 0) {
			return;
		}
		this.health += amount;
		this.health = Mathf.Clamp(this.health, 0, this.maxHealth);
	}
	RestoreMana(amount){
		this.mana += amount;
		this.mana = Mathf.Clamp(this.mana, 0, this.maxMana);
	}
}