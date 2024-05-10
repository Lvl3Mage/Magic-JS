class Store extends Component{
    constructor(eventSystem) {
        super(eventSystem);
        eventSystem.Subscribe("scene-update", this.Update, this);
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
            case 0:
                this.speedUpgradeCost = 50;
                break;
            case 1:
                this.speedUpgradeCost = 100;
                break;
            case 2:
                this.speedUpgradeCost = 150;
                break;
            default:
                this.speedUpgradeCost = 200;
                break;
        }
    }

    buyLivesMaxUpgrade() {
        if (sceneData.HUD.score >= this.speedUpgradeCost) {
            sceneData.HUD.setScore(-this.speedUpgradeCost);
            sceneData.HUD.setlivesMax(1);
            console.log(`Ha comprado una mejora.`);
        } else {
            console.log("No tienes suficientes para comprar la mejora.");
        }
    }

}
