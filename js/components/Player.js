class Player {
	constructor(eventSystem) {
		eventSystem.Subscribe("preload", this.Load.bind(this));
		eventSystem.Subscribe("create", this.Create.bind(this));
		eventSystem.Subscribe("update", this.Update.bind(this));
	}
	Load(){
		game.load.image('main-character', 'assets/imgs/main-character.png');
	}
	Create(){
		this.sprite = game.add.sprite(0, 0, 'main-character');
		this.sprite.anchor.setTo(0.5, 0.5);
		game.physics.p2.enable(this.sprite);
		this.sprite.body.fixedRotation = true;
		game.camera.roundPx = false;

		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

		this.maxVelocity = 300;
		this.accelerationFactor = 0.1;
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

		let rotation = Mathf.TransformRange(-1*this.maxVelocity,1*this.maxVelocity, -15, 15, velocity.x);
		this.sprite.angle = rotation;



		let camCenterPos = new Vector2(game.camera.centerX, game.camera.centerY);
		let playerPos = new Vector2(this.sprite.centerX, this.sprite.centerY);
		let dif = Vector2.Lerp(camCenterPos, playerPos, 0.1).Sub(camCenterPos);
		game.camera.x += dif.x;
		game.camera.y += dif.y;
	}
}