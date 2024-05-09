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

        this.scoreX = game.camera.width - 10;
        this.levelX = game.camera.width / 2; //Ya veremos como escala
        this.healthX= 10;
        this.allY = 10; //game.world.height
        this.styleHUD = {font: '25px Merryweather', fill: '#FFFFFF'};

        this.createHUD();
	}
	Update(){
	}




    createHUD() {

        this.scoreText = game.add.text(this.scoreX, allY,'Score: '+ this.score, this.styleHUD);
        this.scoreText.anchor.setTo(1, 0);
        this.scoreText.fixedToCamera = true;
        this.scoreText.cameraOffset = new Phaser.Point(this.scoreX, this.allY);

        this.levelText = game.add.text(this.levelX, this.allY,'Level: '+ this.level, this.styleHUD);
        this.levelText.anchor.setTo(0.5, 0);
        this.levelText.fixedToCamera = true;
        this.levelText.cameraOffset = new Phaser.Point(this.levelX, this.allY);

        //healthbar
        this.livesBar = game.add.sprite(healthX, allY, 'healthbar_mask_red');
        this.livesBar.fixedToCamera = true;
        this.livesBar.cameraOffset = new Phaser.Point(this.healthX, this.allY);
        this.createLiveBar();

        this.livesBarOutline = game.add.sprite(this.healthX, this.allY, 'healthbar_outline');
        this.livesBarOutline.fixedToCamera = true;
        this.livesBarOutline.cameraOffset = new Phaser.Point(this.healthX, this.allY);

        this.livesBar.scale.setTo(this.livesScale, this.livesScale);
        this.livesBarOutline.scale.setTo(this.livesScale, this.livesScale);
    }

    createLiveBar(){
        let barMask = game.add.graphics(0,0);
        barMask.beginFill(0xfff);
        barMask.drawRect(this.healthX, this.allY, this.livesBar.width * this.livesScale * (this.livesScore/this.lives), this.livesBar.height * this.livesScale);
        barMask.endFill();
        barMask.fixedToCamera = true;
        this.livesBar.mask = barMask;
    }

    // faltan funciones para actualizar el HUD
    // la idea es quitar las variables y hacer metodos que se utilizaran para modofiocar el estado del hud

    // Hud tenga metodos para modificar todas sus cosas
    // setters
    setScore(score){
        this.score = score;
        this.scoreText = game.add.text(this.scoreX, this.allY,'Score: '+ this.score, this.styleHUD);
    }

    setlives(lives){
        this.lives = lives;
        this.createLiveBar();
    }

    setLevel(level){
        this.level = level;
        this.levelText = game.add.text(this.levelX, this.allY,'Level: '+ this.level, this.styleHUD);
    }
}