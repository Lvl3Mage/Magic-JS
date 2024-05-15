class Store extends Component{
    constructor(eventSystem) {
        super(eventSystem);
        eventSystem.Subscribe("scene-update", this.Update, this);
        this.upgradeCost = 0;
        this.speedUpgradeCost = 50;
        this.testKey = game.input.keyboard.addKey(Phaser.Keyboard.T);
    }

    Update() {
        if (this.testKey.isDown) {
            this.buyLivesMaxUpgrade();
            console.log(`Ha pulsado la tecla T.`);
        }
    }

    changeState(state){
        switch (state) {
            case 1:
                this.upgradeCost = this.speedUpgradeCost * state;
                break;
            case 2:
                this.upgradeCost = this.speedUpgradeCost * state;
                break;
            case 3:
                this.upgradeCost = this.speedUpgradeCost * state;
                break;
            default:
                this.upgradeCost = this.speedUpgradeCost;
                break;
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
