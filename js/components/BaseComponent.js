class BaseComponent {
	constructor(eventSystem) {
		eventSystem.Subscribe("preload", this.Load.bind(this));
		eventSystem.Subscribe("create", this.Create.bind(this));
		eventSystem.Subscribe("update", this.Update.bind(this));
	}
	Load(){
	}
	Create(){
	}
	Update(){
	}
}