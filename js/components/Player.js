class Player {
	constructor(eventSystem) {
		eventSystem.Subscribe("scene-update", this.Update.bind(this));
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
		this.maxVelocity = 300;
		this.accelerationFactor = 0.1;
		this.maxTilt = 25;
		this.bopFreq = 15;
		this.maxTiltBopAmp = 15;
		this.bopAmp = 0.3;

		//
		this.maxHealth = 100;
		this.health = this.maxHealth;

		//Hand Parameters
		this.maxHandDistance = 36;
		this.handCursorDistance = 10;
		this.handVelocityMultiplier = 20;
		this.handMaxVelocity = 400;
		this.handVelocityLerpFactor = 0.3;
		this.handVelocity = new Vector2(0,0);
		this.handAngularFactor = 0.2;

		this.debug = false;



		this.sprite = game.add.sprite(0, 0, 'main-character');
		this.sprite.getParentComponent = () => this;
		game.physics.p2.enable(this.sprite, this.debug);
		this.body = this.sprite.body;
		this.body.fixedRotation = true;
		
		this.body.clearShapes();
		this.body.addCapsule(this.sprite.height-this.sprite.width, this.sprite.width/2, 0, -this.sprite.height*0.5, Mathf.Deg2Rad(90));


		this.body.setCollisionGroup(sceneData.collisionGroups.player);
		this.body.collides([sceneData.collisionGroups.enemies, sceneData.collisionGroups.collectables]);
		this.body.getParentComponent = () => this;

		this.sprite.anchor.setTo(0.5, 1);
		// this.sprite.scale.setTo(0.7, 0.7);x

		this.handSprite = game.add.sprite(0, 0, 'hand');
		this.handSprite.anchor.setTo(0.5, 0.5);
		this.handSprite.scale.setTo(2, 2);

		this.sprite.addChild(this.handSprite);

		this.canFire = true;
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
		if(game.input.mousePointer.leftButton.isDown && this.canFire){
			this.canFire = false;
			let handRight = CoordUtils.TransformPoint(Vector2.right, Vector2.zero, Mathf.Deg2Rad(this.handSprite.angle));
			this.handVelocity = this.handVelocity.Sub(handRight.Scale(1000));
			this.handSprite.angle -= 90*(Math.random()*2 - 1);
			let velocity = this.GetVelocity().Sub(handRight.Scale(500));
			this.SetVelocity(velocity);

			game.camera.shake(0.01,100);

			game.time.events.add(300, () => this.canFire = true);

			new Projectile(eventSystem, "hand", this.GetHandPosition(), handRight.Scale(1000));
		}
		




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
		let camCenterPos = new Vector2(game.camera.centerX, game.camera.centerY);
		let playerPos = new Vector2(this.sprite.centerX, this.sprite.centerY);
		let dif = Vector2.Lerp(camCenterPos, playerPos, 0.1).Sub(camCenterPos);
		game.camera.x += dif.x;
		game.camera.y += dif.y;
	}
	HandMovement(){
		const bop = this.GetPlayerBop();

		let worldCursor = CoordUtils.ScreenSpaceToWorldSpace(new Vector2(game.input.mousePointer.x, game.input.mousePointer.y));
		let localCursor = CoordUtils.InverseTransformPoint(worldCursor, this.GetSpriteCenter(), Mathf.Deg2Rad(this.sprite.angle));

		const cursorDistance = localCursor.Length();
		const handOutwardsVector = localCursor.Normalized().Scale(Math.min(cursorDistance-this.handCursorDistance, this.maxHandDistance)); // local coordinate centered around sprite center



		//transforming outwards vector to world space
		const worldTargetHandPos =  CoordUtils.TransformPoint(handOutwardsVector, this.GetSpriteCenter(), Mathf.Deg2Rad(this.sprite.angle));
		const localHandPos = CoordUtils.InverseTransformPoint(worldTargetHandPos, this.GetRootPosition(), Mathf.Deg2Rad(this.sprite.angle));

		if(this.debug){
		}

		let currentHandPos = new Vector2(this.handSprite.x, this.handSprite.y);
		let targetHandVelocity = localHandPos.Sub(currentHandPos).Scale(this.handVelocityMultiplier).ClampLength(0,this.handMaxVelocity);
		this.handVelocity = Vector2.Lerp(this.handVelocity, targetHandVelocity, this.handVelocityLerpFactor);
		currentHandPos = Vector2.Add(currentHandPos, this.handVelocity.Scale(game.time.delta*0.001));
		this.handSprite.x = currentHandPos.x;
		this.handSprite.y = currentHandPos.y;

	}
	HandRotation(){
		let worldHandPos = this.GetHandPosition();

		let worldCursor = CoordUtils.ScreenSpaceToWorldSpace(new Vector2(game.input.mousePointer.x, game.input.mousePointer.y));
		let handToMouse = worldCursor.Sub(worldHandPos);

		let currentHandAngle = this.handSprite.angle;
		let handAngle = Mathf.Rad2Deg(Math.atan2(handToMouse.y, handToMouse.x)) - this.sprite.angle;

		let deltaAngle = Mathf.DeltaAngle(currentHandAngle,handAngle);
		this.handSprite.angle += deltaAngle*this.handAngularFactor;
		if(this.debug){
			const fwd = CoordUtils.TransformPoint(Vector2.right.Scale(handToMouse.Length()), worldHandPos, Mathf.Deg2Rad(this.handSprite.angle + this.sprite.angle));
			game.debug.geom(new Phaser.Line(worldHandPos.x, worldHandPos.y, fwd.x,fwd.y), '#F00');
		}
	}
	GetHandPosition(){
		const localHandPos = new Vector2(this.handSprite.x, this.handSprite.y);
		const worldHandPos = CoordUtils.TransformPoint(localHandPos, this.GetRootPosition(), Mathf.Deg2Rad(this.sprite.angle));
		return worldHandPos;
	}
	GetRootPosition(){
		return new Vector2(this.sprite.x, this.sprite.y);
	}
	GetBodyCenter(){
		return new Vector2(this.sprite.centerX, this.sprite.centerY);
	}
	GetSpriteCenter(){
		const bop = this.GetPlayerBop();
		return CoordUtils.TransformPoint(new Vector2(0, -this.sprite.height*(0.5 + bop - 1)), this.GetRootPosition(), Mathf.Deg2Rad(this.sprite.angle));
			
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
}