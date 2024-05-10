class HUD extends Component {
    constructor(eventSystem) {
        super(eventSystem);
        eventSystem.Subscribe("scene-update", this.Update, this);

        this.score = 0;
        this.scoreText;

        this.level = 1;
        this.levelText;

        this.lives = 3;
        this.livesBar;
        this.livesBarOutline;
        this.livesCurrent = this.lives;
        this.livesScale = 2;

        this.scoreX = game.camera.width - 10;
        this.levelX = game.camera.width / 2; //Ya veremos como escala
        this.healthX= 10;
        this.allY = 10; //game.world.height
        this.styleHUD = {font: '25px Merryweather', fill: '#FFFFFF'};

        this.scoreTotal; //score que aparecera en la pantalla final
        this.collectibleTotal; //Total de collectibles recogidos
        this.createHUD();
	}
	Update(){
	}




    createHUD() {
        this.createScoreText();
        this.createLevelText();
        this.createLiveBar();
    }

    createScoreText(){
        if (this.scoreText)
            this.scoreText.destroy();

        this.scoreText = game.add.text(this.scoreX, this.allY,'Intelligence: '+ this.score, this.styleHUD);
        this.scoreText.anchor.setTo(1, 0);
        this.scoreText.fixedToCamera = true;
        this.scoreText.cameraOffset = new Phaser.Point(this.scoreX, this.allY);
    }

    createLevelText(){
        if (this.levelText)
            this.levelText.destroy();

        this.levelText = game.add.text(this.levelX, this.allY,'Level: '+ this.level, this.styleHUD);
        this.levelText.anchor.setTo(0.5, 0);
        this.levelText.fixedToCamera = true;
        this.levelText.cameraOffset = new Phaser.Point(this.levelX, this.allY);
    }

    createLiveBar(){
        this.livesBar = game.add.sprite(this.healthX, this.allY, 'healthbar_mask_red');
        this.livesBar.fixedToCamera = true;
        this.livesBar.cameraOffset = new Phaser.Point(this.healthX, this.allY);

        if(this.barMask)
            this.barMask.destroy();

        let barMask = game.add.graphics(0,0);
        this.barMask = barMask;
        barMask.beginFill(0xfff);
        barMask.drawRect(this.healthX, this.allY, this.livesBar.width * this.livesScale * (this.livesCurrent/this.lives), this.livesBar.height * this.livesScale);
        barMask.endFill();
        barMask.fixedToCamera = true;
        this.livesBar.mask = barMask;

        this.livesBarOutline = game.add.sprite(this.healthX, this.allY, 'healthbar_outline');
        this.livesBarOutline.fixedToCamera = true;
        this.livesBarOutline.cameraOffset = new Phaser.Point(this.healthX, this.allY);

        this.livesBar.scale.setTo(this.livesScale, this.livesScale);
        this.livesBarOutline.scale.setTo(this.livesScale, this.livesScale);
    }

    setScore(score){
        this.score += score;
        this.scoreTotal += score;
        this.createScoreText();
    }

    setLevel(level){
        this.level += level;
        this.createLevelText();
    }

    setlives(lives){
        this.lives += lives;
    }

    getScoreTotal(){
        return this.scoreTotal;
    }
}