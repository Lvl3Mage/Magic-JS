class Projectile extends Component {
	constructor(eventSystem, position, velocity, projectileConfig){
		super(eventSystem);
		eventSystem.Subscribe("scene-update", this.Update, this);
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

		if(projectileConfig.collisionConfigs){
			for(let collisionConfig of projectileConfig.collisionConfigs){
				if(!collisionConfig.context){
					collisionConfig.context = this;
				}
				this.body.collides(collisionConfig.collisionGroup, collisionConfig.callback.bind(collisionConfig.context), collisionConfig.context);
			}
		}


		this.body.velocity.x = velocity.x;
		this.body.velocity.y = velocity.y;
		this.body.collideWorldBounds = false;
		if(projectileConfig.mass){
			this.body.data.mass = projectileConfig.mass;
		}
		this.body.getParentComponent = () => this;
	}
	Update(){
		let scaleWobble = Math.sin(game.time.totalElapsedSeconds()*this.wobbleFrequency)*this.wobbleMagnitude;
		this.sprite.scale.setTo(this.baseScale.x + scaleWobble, this.baseScale.y + scaleWobble);

		// console.log(this.sprite);
		this.body.angle = Mathf.Rad2Deg(Math.atan2(this.body.velocity.y, this.body.velocity.x));
		if(!this.sprite.inWorld){
			this.Destroy();
		}
	}
	onEnemyCollision(self, other){
		this.Destroy();
	}
	BeforeDestroy(){
		this.sprite.destroy();
	}
}