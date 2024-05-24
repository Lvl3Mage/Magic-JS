class Enemy extends Component {
	constructor(eventSystem, enemyType, spawnPosition) {
		super(eventSystem);
		//Subscribing to event systems here so that the enemy functions properly
		eventSystem.Subscribe("scene-update", this.Update, this);
		this.enemyType = enemyType;

		this.spriteScale = new Vector2(1, 1);
		this.spriteAnchor = new Vector2(0.5, 0.5);
		this.shadowAnchor = new Vector2(0.5, 0.5);

		//Jump Settings
		Object.defineProperty(this, 'jumpFrequency', { 
			get: () =>  gameConfig.enemies[this.enemyType].stats.jumpFrequency
		});
		this.jumpHeightFactor = 0.7;

		this.jumpSqueeze = 0.2;
		this.jumpSqueezeSharpness = 0.5;

		//shadow
		this.shadowJumpAlpha = 0.4;
		this.shadowAlpha = 0.1;

		this.shadowScale = 0.5;
		this.shadowJumpScale = 0.7;

		//Behaviour settings
		//
		this.health = gameConfig.enemies[this.enemyType].stats.maxHealth;


		Object.defineProperty(this, 'roamVelocity', { 
			get: () =>  gameConfig.enemies[this.enemyType].stats.roamVelocity
		});
		Object.defineProperty(this, 'damage', { 
			get: () =>  gameConfig.enemies[this.enemyType].stats.damage
		});

		Object.defineProperty(this, 'attackVelocity', { 
			get: () =>  gameConfig.enemies[this.enemyType].stats.attackVelocity
		});
		this.accelerationFactor = 0.1;

		Object.defineProperty(this, 'attackRange', { 
			get: () =>  gameConfig.enemies[this.enemyType].stats.attackRange
		});
		this.moveDelay = 1000; //At least 1 second delay, remembering this is in milliseconds
		this.moveTimer = Math.random()*this.moveDelay;

		this.sprite = game.add.sprite(spawnPosition.x, spawnPosition.y, 'enemySprite');
		this.sprite.anchor.setTo(0.5, 0);
		this.sprite.scale.setTo(this.spriteScale.x, this.spriteScale.y);
		this.sprite.getParentComponent = () => this;

		this.shadow = game.add.sprite(spawnPosition.x, spawnPosition.y, 'shadow');
		this.shadow.anchor.setTo(this.shadowAnchor.x, this.shadowAnchor.y);
		this.shadow.scale.setTo(this.shadowScale, this.shadowScale);


		game.physics.p2.enable(this.sprite,false);
		this.body = this.sprite.body;
		this.body.setCollisionGroup(sceneData.collisionGroups.enemies);
		this.body.collides(sceneData.collisionGroups.player, this.onPlayerCollision, this);
		this.body.collides([
			sceneData.collisionGroups.safeZones,
			sceneData.collisionGroups.walls,
			sceneData.collisionGroups.projectiles,
			sceneData.collisionGroups.enemies
		]);
		this.body.getParentComponent = () => this;



		this.sprite.body.fixedRotation = true;
		this.roamDirection = this.randomDirection();


		sceneData.layers.enemies.addChild(this.sprite);
		sceneData.layers.shadows.addChild(this.shadow);


		this.onDestroy = () => {};//destoy callback
	}

	Update() {
		//The enemy behaviour will go here
		this.UpdateRoamDirection();
		this.Move();

		this.UpdateJump();


		this.shadow.x = this.sprite.x;
		this.shadow.y = this.sprite.y;
		this.ProcessDespawn();

	}
	ProcessDespawn(){
		const playerDistance = sceneData.player.GetPosition().Sub(new Vector2(this.sprite.centerX, this.sprite.centerY)).Length();

		if(playerDistance > gameConfig.enemyDespawnDistance){
			this.Destroy();
		}
	}
	Move(){
		let targetVelocity;
		if (!this.isAggressive()) {
			targetVelocity = this.roamDirection.Scale(this.roamVelocity);
		}
		else {
			targetVelocity = this.GetAttackDirection().Scale(this.attackVelocity);
		}
		this.AccelerateTo(targetVelocity);

	}
	AccelerateTo(targetVelocity){
		const jumpEnergyFactor = Mathf.TransformRange(0,Math.PI, 1, 0, this.GetJumpPhase() % Math.PI); //starts at 1 when jump begins and ends at 0 when jump ends
		targetVelocity = targetVelocity.Scale(jumpEnergyFactor);
		let curVelocity = this.GetVelocity();

		let accelerationFactor = this.accelerationFactor * (1-this.GetJumpFactor()); // 0 out the acceleration when at jump peak
		curVelocity = Vector2.Lerp(curVelocity, targetVelocity, accelerationFactor);

		this.sprite.body.velocity.x = curVelocity.x;
		this.sprite.body.velocity.y = curVelocity.y;
	}
	UpdateRoamDirection(){
		this.moveTimer += game.time.elapsed; //This is in milliseconds
		if(this.moveTimer >= this.moveDelay){
			this.roamDirection = this.randomDirection();
			//Once it has moved to the new position, we reset the timer
			this.moveTimer = 0;
		}
	}
	GetAttackDirection(){
		let playerPos = sceneData.player.GetPosition();
		let enemyPos = new Vector2(this.sprite.centerX, this.sprite.centerY);
		let delta = playerPos.Sub(enemyPos);
		delta = delta.Normalized();
		return delta;
	}

	UpdateJump(){
		let bop = this.GetJumpFactor();

		let shadowScale = Mathf.TransformRange(0, 1, this.shadowScale, this.shadowJumpScale, bop);
		this.shadow.scale.setTo(shadowScale,shadowScale);
		this.shadow.alpha = Mathf.TransformRange(0, 1, this.shadowAlpha, this.shadowJumpAlpha, bop);

		let squeeze = Math.pow(this.GetJumpFactor(Math.PI),this.jumpSqueezeSharpness);
		squeeze = Mathf.TransformRange(0, 1, -this.jumpSqueeze, this.jumpSqueeze, squeeze);
		this.sprite.scale.setTo(this.spriteScale.x-squeeze,this.spriteScale.y+squeeze)
		this.sprite.anchor.setTo(this.spriteAnchor.x, Mathf.TransformRange(0,1 , this.spriteAnchor.y , this.spriteAnchor.y + this.jumpHeightFactor, bop));

	}
	GetJumpPhase(){
		return game.time.totalElapsedSeconds() * this.jumpFrequency/ 2;
	}
	GetJumpFactor(offset = 0){ // 0-1
		const x = this.GetJumpPhase() + offset;
		let bopA = Math.sin(x);
		let bopB = Math.sin(x+Math.PI);
		return Mathf.SmoothMax(bopA, bopB, 300);

	}
	GetVelocity(){
		return new Vector2(this.sprite.body.velocity.x, this.sprite.body.velocity.y);
	}

	randomDirection() {
		const randomAngle = Math.random() * Math.PI * 2; //Selects a random number between 0 and 1 and multiplies by 2PI to get an angle
		const dir = new Vector2(Math.cos(randomAngle), Math.sin(randomAngle));
		return dir;
	}

	isAggressive(){
		//Retrieve the position of the player and enemy to compare
		let playerPos = sceneData.player.GetPosition();
		let enemyPos = new Vector2(this.sprite.centerX, this.sprite.centerY);

		//Calculate the distance between the player and the enemy
		let delta = enemyPos.Sub(playerPos);
		let distance = delta.Length();

		if (distance < this.attackRange){
			return true;
		}
		return false;

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
	Damage(amount){
		if(this.health <= 0){
			return;
		}
		this.health -= amount;
		this.health = Mathf.Clamp(this.health, 0, gameConfig.enemies[this.enemyType].stats.maxHealth);
		// console.log(`Enemy health: ${this.health}`);
		if(this.health <= 0){
			this.Die();
		}
		else{
			this.FlashTint(0xf94449, 50, 150, 0xffffff);
		}
	}
	Die(){
		this.SpawnCollectable();
		this.Destroy();
	}

	onPlayerCollision(selfBody, playerBody){
		let player = playerBody.getParentComponent();
		player.takeDamage(this.damage);
	}
	SpawnCollectable(){
		sceneData.collectables =
		new Collectible(eventSystem, this.sprite.body.x, this.sprite.body.y,
			{
				spriteName: `xp`,
				onPlayerCollision: function(){
        			sceneData.HUD.addScore(5);
				}
			});
	}
	BeforeDestroy(){
		this.onDestroy();
		this.sprite.destroy();
		this.shadow.destroy();
	}
}