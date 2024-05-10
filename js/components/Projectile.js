class Projectile extends Component {
	constructor(eventSystem, position, velocity, projectileConfig){
		super(eventSystem);
		eventSystem.Subscribe("scene-update", this.Update, this);
		this.sprite = game.add.sprite(position.x, position.y, projectileConfig.spriteName);
		if(projectileConfig.spriteScale){
			this.sprite.scale.setTo(projectileConfig.spriteScale.x, projectileConfig.spriteScale.y);
		}
		game.physics.p2.enable(this.sprite, true);


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

		this.body.getParentComponent = () => this;
	}
	Update(){
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