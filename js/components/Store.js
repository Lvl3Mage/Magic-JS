class Store extends Component{
	constructor(eventSystem, position, storeConfig, textStyle = {font: '18px Merryweather', fill: '#fff', align: 'center'},  priceStyle = {font: '20px Merryweather', fill: '#fff', align: 'center'}){
		super(eventSystem);
		eventSystem.Subscribe("scene-update", this.Update, this);
		eventSystem.Subscribe("on-physics-overlap", this.onOverlap, this);

		this.storeConfig = storeConfig;
		if(!this.storeConfig.getBalance){
			this.storeConfig.getBalance = () => sceneData.HUD.score;
		}
		if(!this.storeConfig.setBalance){
			this.storeConfig.setBalance = (value) => sceneData.HUD.setScore(value);
		}
		this.currentState = 0;

		this.purchaseKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
		// this.cheatKey = game.input.keyboard.addKey(Phaser.Keyboard.X);


		// this.statePrice = this.storeConfig.statePrice;
		// this.state = this.storeConfig.state;
		this.sprite = game.add.sprite(position.x, position.y, storeConfig.spriteName);
		this.sprite.anchor.setTo(0.5,0.5);
		sceneData.layers.world.add(this.sprite);

		if(storeConfig.spriteScale){
			this.sprite.scale.setTo(storeConfig.spriteScale, storeConfig.spriteScale);
		}
		game.physics.p2.enable(this.sprite, false);
		this.body = this.sprite.body;
		this.body.kinematic = true;
		const spritePos = new Vector2(this.sprite.centerX, this.sprite.centerY);
		this.upgradeDescription = game.add.text(spritePos.x, spritePos.y + this.sprite.height/2 + 25, this.storeConfig.upgradeText, textStyle);
		this.upgradeDescription.anchor.setTo(0.5,0.5);
		sceneData.layers.world.add(this.upgradeDescription);

		this.upgradePriceDisplay = game.add.text(spritePos.x, spritePos.y - this.sprite.height/2 - 25, "", priceStyle);
		this.upgradePriceDisplay.anchor.setTo(0.5,0.5);
		sceneData.layers.world.add(this.upgradePriceDisplay);
		// this.body.debug = true;

		this.isDown = true;
		this.disabled = false;
		this.body.getParentComponent = () => this;
	}

	Update(){
		this.UpdateText();
		if(this.playerOverlap){
			if(this.GetPurchaseKey()){
				this.AttemptPurchase();
			}
		}
		this.ProcessPlayerOverlap();
		this.ProcessPurchaseKey();
	}
	UpdateText(){
		if(this.disabled){
			return;
		}
		//TODO
		if(!this.storeConfig.priceHidden){
			this.upgradePriceDisplay.setText(`${this.storeConfig.stages[this.currentState].cost} ${this.storeConfig.priceUnits || "INT"}`);
		}
		else{
			this.upgradePriceDisplay.setText('');
		}
		if(this.CanPurchase()){
			this.upgradePriceDisplay.alpha = 1;
			this.upgradeDescription.alpha = 1;
			this.sprite.alpha = 1;
		}
		else{
			this.upgradePriceDisplay.alpha = 0.7;
			this.upgradeDescription.alpha = 0.7;
			this.sprite.alpha = 0.7;
		}


	}
	CanPurchase(){
		if(this.currentState > this.storeConfig.stages.length - 1){
			return false;
		}
		const currentStage = this.storeConfig.stages[this.currentState];
		return currentStage.cost <= this.storeConfig.getBalance();
	}
	AttemptPurchase(){
		if(this.disabled){
			return;
		}
		if(this.currentState > this.storeConfig.stages.length - 1){
			return;
		}
		if(this.CanPurchase()){
			const currentStage = this.storeConfig.stages[this.currentState];

			this.storeConfig.setBalance(this.storeConfig.getBalance() - currentStage.cost);

			for(let change of currentStage.changes){
				this.CompleteChange(change);
			}
			if(this.storeConfig.purchaseSound){
				if(typeof this.storeConfig.purchaseSound == 'string'){
					sceneData.sounds[this.storeConfig.purchaseSound].play();
				}
				else{
					this.storeConfig.purchaseSound.play();
				}
			}
			let tween = game.add.tween(this.sprite.scale).to({x: this.storeConfig.spriteScale+0.1, y: this.storeConfig.spriteScale+0.1}, 100, Phaser.Easing.Quadratic.InOut, true)
			console.log("tween", tween);
			tween.onComplete.add(function(){
				let tween = game.add.tween(this.sprite.scale).to({x: this.storeConfig.spriteScale, y: this.storeConfig.spriteScale}, 100, Phaser.Easing.Quadratic.InOut, true)
			},this)

			if(currentStage.repeat){
				if(currentStage.repeat == 0){
					//repeat end
					this.currentState++;
				}
				if(currentStage.repeat > 0){
					//finite repeat
					currentStage.repeat--;
				}
			}
			else{
				//no repeat
				this.currentState++;
			}
			if(this.currentState > this.storeConfig.stages.length - 1){
				this.Disable();
			}
		}
	}
	CompleteChange(change){
		const actionType = change.actionType;
		switch(actionType){
			case 'mutate':
				const changePath = change.property.split('.');
				const changeValue = change.value;
				const changeType = change.changeType;
				this.MutateAtPath(changePath, (value) => {
					if(changeType == 'add'){
						return value + changeValue;
					}
					else if(changeType == 'set'){
						return changeValue;
					}
					console.error('Invalid change type: ', changeType);
				});
				break;
			case 'heal':
				sceneData.player.Heal(gameConfig.playerStats.maxHealth*change.factor);
				break;
			case 'reload':
				sceneData.player.RestoreMana(gameConfig.playerStats.maxMana*change.factor);
				break;
			case 'custom':
				change.action();
				break;
		}
	}
	MutateAtPath(path, action){
		let obj = gameConfig;
		for(let i = 0; i < path.length - 1; i++){
			console.log(obj, path[i]);
			obj = obj[path[i]];
		}
		obj[path[path.length - 1]] = action(obj[path[path.length - 1]]);

	}
	Disable(){
		this.disabled = true;
		this.sprite.alpha = 0.5;
		this.upgradeDescription.destroy();
		this.upgradePriceDisplay.destroy();

	}
	ProcessPlayerOverlap(){
		this.playerOverlap = false;
	}

	onOverlap(body1, body2){
		if(!body1.data.shapes){return;}
		if(body1.data.shapes.length == 0){return;}
		if(!body2.data.shapes){return;}
		if(body2.data.shapes.length == 0){return;}


		let groups = [body1.data.shapes[0].collisionGroup, body2.data.shapes[0].collisionGroup];
		let bodies = [body1, body2];
		if(groups.some(group => group === sceneData.collisionGroups.player.mask) && bodies.some(body => body == this.body)){
			this.playerOverlap = true;
		}
	}
	GetPurchaseKey(){
		if (!this.isDown) {
			if (this.purchaseKey.isDown) {
				return true;
			}
		}
	}
	ProcessPurchaseKey(){
		this.isDown = this.purchaseKey.isDown;
	}
}