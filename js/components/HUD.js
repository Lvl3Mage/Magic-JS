class HUD extends Component {
	constructor(eventSystem) {
		super(eventSystem);
		eventSystem.Subscribe("scene-update", this.Update, this);

		this.score = 0;
		this.scoreText;

		this.level = 1;
		this.levelText;


		Object.defineProperty(this, 'maxHealth', { get: () =>  gameConfig.playerStats.maxHealth});
		this.smoothHealth = sceneData.player.health;

		this.smoothFactor = 0.1;

		
		Object.defineProperty(this, 'maxMana', { get: () =>  gameConfig.playerStats.maxMana});
		this.smoothMana = sceneData.player.mana;

		this.maskPaddingLeft = 20;
		this.maskPaddingRight = 30;

		this.livesBar;
		this.livesBarOutline;
		this.livesScale = 1.5;

		this.manaBar;
		this.manaBarOutline;
		this.manaScale = 1.5;

		this.padding = new Vector2(10,10);
		this.rightScreen = game.camera.width - 10;
		this.centerScreen = game.camera.width / 2;
		this.leftScreen = 10;
		this.styleHUD = {font: '26px Merryweather', fill: '#FFFFFF'};

		this.scoreTotal; //score que aparecera en la pantalla final
		this.collectibleTotal; //Total de collectibles recogidos
		this.createHUD();
	}
	Update(){
		this.updateHealthbarMask();
		this.updateManabarMask();
	}

	updateHealthbarMask(){
		const health = sceneData.player.health;
		this.smoothHealth = Mathf.Lerp(this.smoothHealth, health, this.smoothFactor);
		this.healthBarMask.clear();
		this.healthBarMask.beginFill(0xfff);
		let t = (this.smoothHealth/this.maxHealth);
		const width = this.healthBar.width - this.maskPaddingLeft - this.maskPaddingRight;
		this.healthBarMask.drawRect(this.healthBar.cameraOffset.x + this.maskPaddingLeft, this.healthBar.cameraOffset.y, width * t, this.healthBar.height);
		this.healthBarMask.endFill();
	}
	updateManabarMask(){
		const mana = sceneData.player.mana;
		this.smoothMana = Mathf.Lerp(this.smoothMana, mana, this.smoothFactor);
		this.manaBarMask.clear();
		this.manaBarMask.beginFill(0xfff);
		let t = (this.smoothMana/this.maxMana);
		const width = this.manaBar.width - this.maskPaddingLeft - this.maskPaddingRight;
		this.manaBarMask.drawRect(this.manaBar.cameraOffset.x + this.maskPaddingLeft, this.manaBar.cameraOffset.y, width * t, this.manaBar.height);
		this.manaBarMask.endFill();
	}



	createHUD() {
		// this.bg = game.add.tileSprite(0, 0, game.camera.width, 150, 'hudWall');
		// this.bg.fixedToCamera = true;
		// this.bg.tint = 0xAAAAAA;
		this.createScoreText();
		this.createLevelText();
		this.createHealthbar();
		this.createManaBar();
	}

	createText(posSreenX, posSreenY, posX, posY, text){
		let btn;
		btn = game.add.text(posX, posY, text, this.styleHUD);
		btn.anchor.setTo(posSreenX, posSreenY);
		btn.fixedToCamera = true;
		btn.cameraOffset = new Phaser.Point(posX, posY);
		sceneData.layers.UI.addChild(btn);
		return btn;
	}

	createScoreText(){
		this.scoreText = this.createText(1, 0, this.rightScreen, this.padding.y);
		this.updateScoreText();
	}
	updateScoreText(){
		this.scoreText.text = 'Intelligence: ' + this.score;
	}

	createLevelText(){
		this.levelText = this.createText(0.5, 0, this.centerScreen, this.padding.y);
		this.updateLevelText()
	}
	updateLevelText(){
		this.levelText.text = 'Level: ' + this.level;
	}

	createHealthbar(){

		this.healthBarFill = game.add.sprite(this.padding.x, this.padding.y, 'healthbar_mask_red');
		this.healthBarFill.scale.setTo(this.livesScale, this.livesScale);
		this.healthBarFill.fixedToCamera = true;
		sceneData.layers.UI.addChild(this.healthBarFill);

		this.healthBar = game.add.sprite(this.padding.x, this.padding.y, 'healthbar_outline');
		this.healthBar.scale.setTo(this.livesScale, this.livesScale);
		this.healthBar.fixedToCamera = true;
		sceneData.layers.UI.addChild(this.healthBar);

		this.healthBarMask = game.add.graphics(0,0);
		this.healthBarMask.fixedToCamera = true;
		
		sceneData.layers.UI.addChild(this.healthBarMask);

		this.healthBarFill.mask = this.healthBarMask;
		this.updateHealthbarMask();
	}

	createManaBar(){
		this.manaBarFill = game.add.sprite(this.padding.x, this.padding.y + 110, 'manabar_mask');
		this.manaBarFill.scale.setTo(this.manaScale, this.manaScale);
		this.manaBarFill.fixedToCamera = true;
		sceneData.layers.UI.addChild(this.manaBarFill);

		this.manaBar = game.add.sprite(this.padding.x, this.padding.y + 110, 'manabar_outline');
		this.manaBar.scale.setTo(this.manaScale, this.manaScale);
		this.manaBar.fixedToCamera = true;
		sceneData.layers.UI.addChild(this.manaBar);
		
		this.manaBarMask = game.add.graphics(0,0);
		this.manaBarMask.fixedToCamera = true;

		sceneData.layers.UI.addChild(this.manaBarMask);

		this.manaBarFill.mask = this.manaBarMask;
		this.updateManabarMask();
	
	}

	addScore(score){
		this.score += score;
		if(score>0){
			this.scoreTotal += score;
		}
		this.updateScoreText();
	}

	setLevel(level){
		this.level = level;
		this.updateLevelText();
	}

	setHealthInstant(health){
		this.smoothHealth = health;
	}
	setManaInstant(mana){
		this.smoothMana = mana;
	}

	getScoreTotal(){
		return this.scoreTotal;
	}
}