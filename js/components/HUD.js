class HUD extends Component {
    constructor(eventSystem) {
        super(eventSystem);
        eventSystem.Subscribe("scene-update", this.Update, this);

        this.score = 0;
        this.scoreText;

        this.level = 1;
        this.levelText;

        this.livesMax = 3;
        this.livesBar;
        this.livesBarOutline;
        this.livesCurrent = this.livesMax;
        this.livesScale = 1.5;

        this.rightScreen = game.camera.width - 10;
        this.centerScreen = game.camera.width / 2;  // Ya veremos como escala
        this.leftScreen = 10;
        this.allY = 10; //game.world.height
        this.styleHUD = {font: '26px Merryweather', fill: '#FFFFFF'};

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

    createText(posSreenX, posSreenY, posX, posY, text){
        let btn;
        btn = game.add.text(posX, posY, text, this.styleHUD);
        btn.anchor.setTo(posSreenX, posSreenY);
        btn.fixedToCamera = true;
        btn.cameraOffset = new Phaser.Point(posX, posY);
        return btn;
    }

    createScoreText(){
        //Si estan creados destruimos los textos porque las variables no se sobreescriben
        if (this.scoreText)
            this.scoreText.destroy();

        this.scoreText = this.createText(1, 0, this.rightScreen, this.allY, 'Intelligence: ' + this.score);
    }

    createLevelText(){
        if (this.levelText)
            this.levelText.destroy();

        this.levelText = this.createText(0.5, 0, this.centerScreen, this.allY, 'Level: ' + this.level);
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
        barMask.drawRect(this.healthX, this.allY, this.livesBar.width * this.livesScale * (this.livesCurrent/this.livesMax), this.livesBar.height * this.livesScale);
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
        this.scoreTotal += Math.abs(score);
        this.createScoreText();
    }

    setLevel(level){
        this.level += level;
        this.createLevelText();
    }

    setlives(lives){
        this.livesCurrent += lives;
    }

    setlivesMax(lives){
        this.livesMax += lives;
    }

    getScoreTotal(){
        return this.scoreTotal;
    }
}