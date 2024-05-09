class Component {
	constructor(eventSystem) {
	}

    BeforeDestroy(){//override this method to destroy all sub objects
    }
	Destroy(){
		this.BeforeDestroy();
		this.destroyed = true;
	}
}
/*
EXAMPLE COMPONENT
class Component extends BaseComponent 
	constructor(eventSystem) {
		super(eventSystem);
		eventSystem.Subscribe("scene-update", this.Update, this);
	}
	Update(){
	}
	Destroy(){
		// destroy all sub objects
		this.OnDestroy();
	}
}

*/