class HUD {
    constructor(eventSystem) {
		eventSystem.Subscribe("scene-update", this.Update.bind(this));

        this.score = 0;
        this.scoreText;

        this.level = 1;
        this.levelText;

        this.lives = 3;
        this.livesBar;
        this.livesBarOutline;
        this.livesScore = 1; // esto solo irá de 0 a 1
        this.livesScale = 2;


        this.createHUD();
	}
	Update(){
	}




    createHUD() {
        let scoreX = game.camera.width - 10;
        let levelX = game.camera.width / 2; //Ya veremos como escala
        let healthX= 10;
        let allY = 10; //game.world.height
        let styleHUD = {font: '25px Merryweather', fill: '#FFFFFF'};

        this.scoreText = game.add.text(scoreX,allY,'Score: '+ this.score, styleHUD);
        this.scoreText.anchor.setTo(1, 0);
        this.scoreText.fixedToCamera = true;
        this.scoreText.cameraOffset = new Phaser.Point(scoreX,allY);

        this.levelText = game.add.text(levelX,allY,'Level: '+ this.level, styleHUD);
        this.levelText.anchor.setTo(0.5, 0);
        this.levelText.fixedToCamera = true;
        this.levelText.cameraOffset = new Phaser.Point(levelX,allY);

        //healthbar
        this.livesBar = game.add.sprite(healthX, allY, 'healthbar_mask_red');
        this.livesBar.fixedToCamera = true;
        this.livesBar.cameraOffset = new Phaser.Point(healthX,allY);
        let barMask = game.add.graphics(0,0);
        barMask.beginFill(0xfff);
        barMask.drawRect(healthX, allY, this.livesBar.width * this.livesScale * this.livesScore, this.livesBar.height * this.livesScale);
        barMask.endFill();
        barMask.fixedToCamera = true;
        this.livesBar.mask = barMask;

        this.livesBarOutline = game.add.sprite(healthX, allY, 'healthbar_outline');
        this.livesBarOutline.fixedToCamera = true;
        this.livesBarOutline.cameraOffset = new Phaser.Point(healthX,allY);

        this.livesBar.scale.setTo(this.livesScale, this.livesScale);
        this.livesBarOutline.scale.setTo(this.livesScale, this.livesScale);
    }

    // faltan funciones para actualizar el HUD
    // la idea es quitar las variables y hacer metodos que se utilizaran para modofiocar el estado del hud

    // Hud tenga metodos para modificar todas sus cosas
    // setters
    getScore(){
        return this.score;
    }

    getlives(){
        return this.lives;
    }

    getLevel(){
        return this.level;
    }
}