class Projectile extends Component {
	constructor(eventSystem, position, velocity, projectileConfig){
		super(eventSystem);
		eventSystem.Subscribe("scene-update", this.Update, this);
		eventSystem.Subscribe("on-physics-overlap", this.onOverlap, this);
		this.sprite = game.add.sprite(position.x, position.y, projectileConfig.spriteName);
		this.baseScale = Vector2.one;
		this.wobbleFrequency = projectileConfig.wobbleFrequency || 1;
		this.wobbleMagnitude = projectileConfig.wobbleMagnitude || 0;
		if(projectileConfig.spriteScale){
			this.baseScale = projectileConfig.spriteScale;
		}
		this.sprite.scale.setTo(this.baseScale.x, this.baseScale.y);
		game.physics.p2.enable(this.sprite, false);


		this.body = this.sprite.body;
		if(projectileConfig.collisionGroup){
			this.body.setCollisionGroup(collisionGroup);
		}
		else{
			this.body.setCollisionGroup(sceneData.collisionGroups.projectiles);
		}
		if(projectileConfig.layer){
			projectileConfig.layer.addChild(this.sprite);
		}
		else{
			sceneData.layers.projectiles.addChild(this.sprite);
		}
		this.collisionConfigs = projectileConfig.collisionConfigs;
		// if(projectileConfig.collisionConfigs){
		// 	for(let collisionConfig of projectileConfig.collisionConfigs){
				
		// 		this.body.collides(collisionConfig.collisionGroup, collisionConfig.callback.bind(collisionConfig.context), collisionConfig.context);
		// 	}
		// }


		this.body.velocity.x = velocity.x;
		this.body.velocity.y = velocity.y;
		this.body.collideWorldBounds = false;
		if(projectileConfig.mass){
			this.body.data.mass = projectileConfig.mass;
		}
		this.body.getParentComponent = () => this;

		sceneData.sounds.fire.play();
	}
	Update(){
		let scaleWobble = Math.sin(game.time.totalElapsedSeconds()*this.wobbleFrequency)*this.wobbleMagnitude;
		this.sprite.scale.setTo(this.baseScale.x + scaleWobble, this.baseScale.y + scaleWobble);

		this.body.angle = Mathf.Rad2Deg(Math.atan2(this.body.velocity.y, this.body.velocity.x));
		if(!this.sprite.inWorld){
			this.Destroy();
		}
	}
	BeforeDestroy(){
		this.sprite.destroy();
	}
	GetVelocity(){
		return new Vector2(this.body.velocity.x, this.body.velocity.y);
	}
	onOverlap(body1, body2){
		if(!body1.data.shapes){return;}
		if(body1.data.shapes.length == 0){return;}
		if(!body2.data.shapes){return;}
		if(body2.data.shapes.length == 0){return;}


		let groups = [body1.data.shapes[0].collisionGroup, body2.data.shapes[0].collisionGroup];
		let bodies = [body1, body2];
		if(!bodies.some(body => body == this.body)){return;}
		for(let config of this.collisionConfigs){
			if(groups.some(group => group === config.collisionGroup.mask)){
				let context = config.context || this;
				let enemyIndex = groups.findIndex(group => group === config.collisionGroup.mask);
				config.callback.call(context, bodies[1-enemyIndex], bodies[enemyIndex]);
			}
		}
	}
}