class EventSystem{
	events = {};
	constructor(){
	}
	Subscribe(event, callback){
		if(!(event in this.events)){
			this.events[event] = [];
		}
		this.events[event].push(callback);
	}
	CallEvent(event, callData){
		if(event in this.events){
			for(let i = 0; i < this.events[event].length; i++){
				this.events[event][i](...callData);
			}
		}
	}
}