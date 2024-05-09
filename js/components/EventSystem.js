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
	Unsubscribe(event, callback){
		if(!(event in this.events)){
			return;
		}
		const index = this.events[event].indexOf(callback);
		console.log(index)
		console.log(this.events[event]);
		if(index != -1){
			this.events[event].splice(index,1);
		}
	}
	CallEvent(event, callData){
		if(event in this.events){
			for(let i = 0; i < this.events[event].length; i++){
				this.events[event][i](...callData);
			}
		}
	}
}