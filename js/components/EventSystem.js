class EventSystem{
	events = {};
	constructor(){
	}
	Subscribe(event, callback, context){
		if(!(event in this.events)){
			this.events[event] = [];
		}
		this.events[event].push({
			callback: callback,
			context: context
		});
	}
	CallEvent(event, callData){
		if(event in this.events){
			for(let i = 0; i < this.events[event].length; i++){
				const context = this.events[event][i].context;
				if(context.destroyed){
					this.events[event].splice(i,1);
					i--;
					// console.log("Event callback with destroyed context removed");
					continue;
				}
				const callback = this.events[event][i].callback.bind(context);
				callback(...callData);
			}
		}
	}
}