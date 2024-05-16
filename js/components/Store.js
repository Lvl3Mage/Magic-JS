class Store extends Component{
    constructor(eventSystem, position, storeConfig){
        super(eventSystem);
        eventSystem.Subscribe("scene-update", this.Update, this);
        eventSystem.Subscribe("on-physics-overlap", this.onOverlap, this);
        this.storeConfig = storeConfig;
        this.isUp = true;
        this.testKey = game.input.keyboard.addKey(Phaser.Keyboard.T);
        this.cheatKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
        this.statePrice = this.storeConfig.statePrice;
        this.state = this.storeConfig.state;

        this.sprite = game.add.sprite(position.x, position.y, storeConfig.spriteName);
        this.sprite.anchor.setTo(0.5,0.5);

		if(storeConfig.spriteScale){
            this.sprite.scale.setTo(storeConfig.spriteScale.x, storeConfig.spriteScale.y);
		}
        this.priceDisplay = game.add.text(this.sprite.centerX, this.sprite.centerY + this.sprite.height, this.storeConfig.state, { font: '35px Merryweather', fill: '#000000' });
        this.priceDisplay.anchor.setTo(0.5,0.5);

		game.physics.p2.enable(this.sprite, false);
		this.body = this.sprite.body;
        this.body.debug = storeConfig.debug;
        // this.body.setCollisionGroup(sceneData.collisionGroups.store);
        // this.body.collides(sceneData.collisionGroups.player, this.onPlayerCollision, this);

		this.body.getParentComponent = () => this;
	}

	Update(){
        this.ProcessPlayerOverlap();
        this.priceDisplay.text = this.statePrice[this.state];
	}

    ProcessPlayerOverlap(){
        if(this.playerOverlap){
            this.checkKey(this.storeConfig.action);
		}

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

    checkKey(func){
        if (this.isUp) {
            if (this.testKey.isDown) {
                this.isUp = false;
                this.state = func();
                console.log(`Ha pulsado la tecla T.`);
            }
            if (this.cheatKey.isDown) {
                this.isUp = false;
                sceneData.HUD.setScore(100);
            }
        }
        this.isUp = this.cheatKey.isUp && this.testKey.isUp;
    }
}