class Store extends Component{
    constructor(eventSystem) {
        super(eventSystem);
        eventSystem.Subscribe("scene-update", this.Update, this);
        this.upgradeCost = 0;
        this.speedUpgradeCost = 50;
        this.testKey = game.input.keyboard.addKey(Phaser.Keyboard.T);
        this.statePrice = [50, 100, 150];
    }
    //velocidad
    //daño
    //velocidad ataque
    //velocidad mov
    //cantidad de balas

    Update() {
        if (this.testKey.isDown) {
            this.buyLivesMaxUpgrade();
            console.log(`Ha pulsado la tecla T.`);
        }
    }

    buyLivesMaxUpgrade() {
        if (sceneData.HUD.score >= this.upgradeCost) {
            sceneData.HUD.setScore(-this.upgradeCost);
            sceneData.HUD.setlivesMax(1);
            console.log(`Ha comprado una mejora.`);
        } else {
            console.log("No tienes suficientes para comprar la mejora.");
        }
    }

}
