class Player {
	constructor(eventSystem) {
		eventSystem.Subscribe("update", this.Update.bind(this));
		//Input handling
		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);


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
		this.handDistance = 36;
		this.handLerpFactor = 0.2;
		this.handAngularFactor = 0.2;

		this.hatAngularSpeed = 0;

		this.debug = false;



		this.sprite = game.add.sprite(0, 0, 'main-character');
		game.physics.p2.enable(this.sprite, this.debug);
		this.sprite.body.fixedRotation = true;

		this.sprite.anchor.setTo(0.5, 1);
		// this.sprite.scale.setTo(0.7, 0.7);x

		this.handSprite = game.add.sprite(0, 0, 'hand');
		this.handSprite.anchor.setTo(0.5, 0.5);
		this.handSprite.scale.setTo(2, 2);

		this.sprite.addChild(this.handSprite);
		this.sprite.body.clearShapes();
		this.sprite.body.addCapsule(this.sprite.height-this.sprite.width, this.sprite.width/2, 0, -this.sprite.height*0.5, Mathf.Deg2Rad(90));



		console.log(this.sprite.body)
	}
	GetInputAxis(){
		let axis = new Vector2(0,0);
		if (this.upKey.isDown)
		{
			axis.y--;
		}
		else if (this.downKey.isDown)
		{
			axis.y++;
		}
		if (this.leftKey.isDown)
		{
			axis.x--;
		}
		else if (this.rightKey.isDown)
		{
			axis.x++;
		}
		return axis;
	}
	Update(){
		let axis = this.GetInputAxis();
		let velocity = new Vector2(this.sprite.body.velocity.x, this.sprite.body.velocity.y);
		let targetVel = axis.Scale(this.maxVelocity);
		let currentVel = Vector2.Lerp(velocity, targetVel, this.accelerationFactor);
		this.sprite.body.velocity.x = currentVel.x;
		this.sprite.body.velocity.y = currentVel.y;

		let curMaxTilt = this.maxTilt - Math.abs(Math.sin(game.time.totalElapsedSeconds()*this.bopFreq*0.5)*this.maxTiltBopAmp)
		let rotation = Mathf.TransformRange(-1*this.maxVelocity,1*this.maxVelocity, -curMaxTilt, curMaxTilt, velocity.x);
		this.sprite.angle = rotation;
		let bop = Mathf.TransformRange(0, this.maxVelocity, 1, 0.9 + Math.abs(Math.sin(game.time.totalElapsedSeconds()*this.bopFreq*0.5)*this.bopAmp), velocity.Length());

		this.sprite.anchor.setTo(0.5, bop);


		let camCenterPos = new Vector2(game.camera.centerX, game.camera.centerY);
		let playerPos = new Vector2(this.sprite.centerX, this.sprite.centerY);
		let dif = Vector2.Lerp(camCenterPos, playerPos, 0.1).Sub(camCenterPos);
		game.camera.x += dif.x;
		game.camera.y += dif.y;

		let playerSpriteCenter = new Vector2(this.sprite.x, this.sprite.y);
		playerSpriteCenter = playerSpriteCenter.Add(CoordUtils.InverseTransformPoint(Vector2.down.Scale(this.sprite.height*(0.5 + bop - 1)), Vector2.zero, Mathf.Deg2Rad(-this.sprite.angle)))

		let worldCursor = CoordUtils.ScreenSpaceToWorldSpace(new Vector2(game.input.mousePointer.x, game.input.mousePointer.y));
		let localCursor = CoordUtils.InverseTransformPoint(worldCursor, playerSpriteCenter, Mathf.Deg2Rad(this.sprite.angle));
		// console.log(localCursor);
		let targetLocalHandPos = localCursor.Normalized().Scale(this.handDistance);
		let handPos = CoordUtils.TransformPoint(targetLocalHandPos, playerSpriteCenter, Mathf.Deg2Rad(this.sprite.angle));
		if(this.debug){
			game.debug.geom(new Phaser.Line(playerSpriteCenter.x, playerSpriteCenter.y, worldCursor.x, worldCursor.y), '#0F0');
			game.debug.geom(new Phaser.Line(playerSpriteCenter.x, playerSpriteCenter.y, handPos.x, handPos.y), '#F00');
		}

		let currentHandPos = new Vector2(this.handSprite.x, this.handSprite.y);
		let targetHandPos = new Vector2(targetLocalHandPos.x, targetLocalHandPos.y - this.sprite.height*(0.5 + bop - 1));

		currentHandPos = Vector2.Lerp(currentHandPos, targetHandPos, this.handLerpFactor);
		this.handSprite.x = currentHandPos.x;
		this.handSprite.y = currentHandPos.y;


		let handToMouse = worldCursor.Sub(handPos);

		let currentHandAngle = this.handSprite.angle;
		let handAngle = Mathf.Rad2Deg(Math.atan2(handToMouse.y, handToMouse.x));

		let deltaAngle = Mathf.DeltaAngle(currentHandAngle,handAngle);
		this.handSprite.angle += deltaAngle*this.handAngularFactor;
	}


	//Public Methods
	GetPosition(){
		return new Vector2(this.sprite.x, this.sprite.y);
	}
}