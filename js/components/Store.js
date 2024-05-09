class Store {
    constructor(eventSystem) {
        eventSystem.Subscribe("scene-update", this.Update.bind(this));
    }

}