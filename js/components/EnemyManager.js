class EnemyManager extends Component {
	constructor(eventSystem, spawnPoints) {
		super(eventSystem);
		eventSystem.Subscribe("scene-update", this.Update, this);
		this.spawnData = {};
		for(let enemyType of Object.keys(spawnPoints)){
			this.spawnData[enemyType] = {
				spawnTimer: 0,
				enemyCount: 0,
				spawnPoints: spawnPoints[enemyType],
				get maxEnemyCount(){
					return gameConfig.enemies[enemyType].maxAmount;
				},
				get spawnDelay(){
					return gameConfig.enemies[enemyType].spawnDelay;
				}
			}
		}
	}
	Update(){
		for(let type of Object.keys(this.spawnData)){
			this.HandleSpawnType(type);
		}
	}
	HandleSpawnType(type){
		if(this.spawnData[type].enemyCount >= this.spawnData[type].maxEnemyCount){
			return;
		}
		this.spawnData[type].spawnTimer += game.time.elapsed*0.001;
		if(this.spawnData[type].spawnTimer >= this.spawnData[type].spawnDelay){
			this.spawnData[type].spawnTimer = 0;
			this.SpawnEnemy(type);
		}
	}
	SpawnEnemy(type){
		this.spawnData[type].enemyCount++;
		const playerPosition = sceneData.player.GetPosition();
		const spawnPoints = this.spawnData[type].spawnPoints.filter((point) => point.Sub(playerPosition).Length() <= gameConfig.maxEnemySpawnDistance);
		if (spawnPoints.length == 0){
			console.warn('No spawn points found for enemy type:', type);
			return;
		}
		const selectedSpawnPoint = spawnPoints[Math.floor(Math.random()*spawnPoints.length)];

		const enemy = new Enemy(eventSystem, type, new Vector2(selectedSpawnPoint.x, selectedSpawnPoint.y));
		enemy.onDestroy = function(){
			this.spawnData[type].enemyCount --;
		}.bind(this);
	}
	Destroy(){
		// destroy all sub objects
		this.OnDestroy();
	}
}