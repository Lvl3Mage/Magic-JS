class Store extends Component{
    constructor(eventSystem, posX = 150, posY = 150) {
        super(eventSystem);
        eventSystem.Subscribe("scene-update", this.Update, this);
        this.testKey = game.input.keyboard.addKey(Phaser.Keyboard.T);
        this.testCheat = game.input.keyboard.addKey(Phaser.Keyboard.X);
        this.statePrice = [50, 100, 150, 200, 250, 300, 500];
        this.state = 0;
        this.isUp = true;
        this.debug = true;

        // Crear sprites
        this.upgradeSpeed = this.createUpgradeSprite(posX, posY, 'StoreVelocity', 0.03);

    }

    createUpgradeSprite(x, y, spriteKey, scale) {
        const sprite = game.add.sprite(x, y, spriteKey);
        sprite.scale.setTo(scale, scale);
        sprite.debug = true;

        // Habilitar físicas
        game.physics.p2.enable(sprite, true);
        sprite.body.debug = true;
        sprite.body.setCollisionGroup(sceneData.collisionGroups.store);
        sprite.body.collides(sceneData.collisionGroups.player, this.onPlayerCollision, this);
        sprite.body.getParentComponent = () => this;

        return sprite;
    }

    Update() {
        this.checkKey();
    }

    onPlayerCollision(selfBody, playerBody) {
        let player = playerBody.getParentComponent();
        this.collidedSprite = selfBody.sprite;
        this.checkKey();
    }

    checkKey() {
        if (this.isUp) {
            if (this.isUp && this.testKey.isDown) {
                this.isUp = false;
                this.buy();
                console.log(`Ha pulsado la tecla T.`);
            }
            if (this.testCheat.isDown) {
                this.isUp = false;
                sceneData.HUD.setScore(50);
            }
        }
        this.isUp = this.testCheat.isUp && this.testKey.isUp;
    }

    buy(collidedSprite){
        console.log(`Ha comprado una mejora.`);
        console.log(collidedSprite);
        if (this.testKey.isDown) {
            this.isUp = false;
            console.log(`Ha pulsado la tecla T.`);
            if (collidedSprite === this.upgradeSpeed) {
                this.upgradeSpeedAction();
            } else if (collidedSprite === this.upgradeDamage) {
                this.upgradeDamageAction();
            } else if (collidedSprite === this.upgradeSpeedAttack) {
                this.upgradeSpeedAttackAction();
            } else if (collidedSprite === this.upgradeAmountProjectile) {
                this.upgradeAmountProjectileAction();
            }
        }
        this.isUp = this.testKey.isUp;
    }


    upgradeSpeed(){
        if (sceneData.HUD.score >= this.statePrice[this.state]) {
            this.state ++;
            sceneData.HUD.setScore(-this.upgradeCost);
            sceneData.player.maxVelocity += 100;
            console.log(`Mejora velocidad.`);
        }
    }

    upgradeDamage() {
        if (sceneData.HUD.score >= this.statePrice[this.state]) {
            this.state ++;
            sceneData.HUD.setScore(-this.upgradeCost);
            sceneData.player.maxVelocity += 100;
            console.log(`Mejora velocidad.`);
        }
    }

    upgradeSpeedAttack() {
        if (sceneData.HUD.score >= this.statePrice[this.state]) {
            this.state ++;
            sceneData.HUD.setScore(-this.upgradeCost);
            sceneData.player.maxVelocity += 100;
            console.log(`Mejora velocidad.`);
        }
    }

    upgradeAmountProjectile() {
        if (sceneData.HUD.score >= this.statePrice[this.state]) {
            this.state ++;
            sceneData.HUD.setScore(-this.upgradeCost);
            sceneData.player.maxVelocity += 100;
            console.log(`Mejora velocidad.`);
        }
    }

    upgradeDamage() {
        if (sceneData.HUD.score >= this.statePrice[this.state]) {
            this.state ++;
            sceneData.HUD.setScore(-this.upgradeCost);
            sceneData.player.maxHealth += 50;
            console.log(`Mejora Vida.`);
        }
    }

}
