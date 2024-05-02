class BaseComponent {
	constructor(eventSystem) {
		eventSystem.Subscribe("scene-update", this.Update.bind(this));
	}
	Update(){
	}
}