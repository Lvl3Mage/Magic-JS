class Player {
	constructor(eventSystem) {
		eventSystem.Subscribe("preload", this.Load.bind(this));
		eventSystem.Subscribe("create", this.Create.bind(this));
		eventSystem.Subscribe("update", this.Update.bind(this));
	}
	Load(){
		game.load.image('main-character', 'assets/imgs/main-character.png');
		game.load.image('hand', 'assets/imgs/hand-placeholder.png');
		game.load.image('hat', 'assets/imgs/funnyhat.png');
	}
	Create(){
		this.sprite = game.add.sprite(0, 0, 'main-character');
		game.physics.p2.enable(this.sprite);
		this.sprite.body.fixedRotation = true;

		this.sprite.anchor.setTo(0.5, 1);
		// this.sprite.scale.setTo(0.7, 0.7);

		this.handSprite = game.add.sprite(0, 0, 'hand');
		this.handSprite.anchor.setTo(0.5, 0.5);
		this.handSprite.scale.setTo(2, 2);


		this.hatSprite = game.add.sprite(0, 0, 'hat');
		this.hatSprite.anchor.setTo(0.5, 1);
		this.sprite.addChild(this.hatSprite);
		// this.hatSprite.scale.setTo(0.2, 0.2);

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

		//Hand Parameters
		this.handDistance = 36;

		this.hatAngularSpeed = 0;
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
		let handPos = CoordUtils.TransformPoint(localCursor.Normalized().Scale(this.handDistance), playerSpriteCenter, Mathf.Deg2Rad(this.sprite.angle));
		this.handSprite.x = handPos.x;
		this.handSprite.y = handPos.y;


		let handToMouse = worldCursor.Sub(handPos);
		let handAngle = Mathf.Rad2Deg(Math.atan2(handToMouse.y, handToMouse.x));
		this.handSprite.angle = handAngle;

		let hatPosition = Vector2.down.Scale(this.sprite.height*bop - this.hatSprite.height*0.3);
		// this.hatSprite.angle = this.sprite.angle;
		this.hatSprite.x = hatPosition.x;
		this.hatSprite.y = hatPosition.y;
		// console.log(localCursor.Normalized());
		// console.log(game.input.mousePointer.x.toString() + " " + game.input.mousePointer.y.toString());
	}
}