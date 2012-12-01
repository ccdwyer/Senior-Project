ig.module(
	'game.entities.arenadoor'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityArenadoor = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.FIXED,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	size: {x: 64, y: 64},
	loc: {x: 768, y: 1344},
	health: 100000,

	animSheet: new ig.AnimationSheet( 'media/door.png', 64, 64),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.addAnim('dropped', 1, [0] );
		this.currentAnim = this.anims.dropped;
		this.inGame = true;
		this.checkedIfUnlocked = false;
		this.waveCount = 0;
		this.maxWaveTime = 60;
		this.waveTimer = new ig.Timer(0);
		this.miniWaveCount = 0;
		this.miniWaveTime = 12;
		this.miniWaveTimer = new ig.Timer(0);
	},

	update: function() {
		if(this.inGame == 1) {
			this.parent();
			this.waveTimer.unpause();
			this.miniWaveTimer.unpause();
			if(this.waveTimer.delta() > 0) {
				//spawn wave
				this.spawnWave();
				this.waveCount++;
				var minTime = this.maxWaveTime - Math.random()*this.waveCount*0.5;
				if(minTime < 1) minTime = 1;
				var waveDuration = minTime + Math.random()*(this.maxWaveTime-minTime)
				this.waveTimer.set(waveDuration);
				this.miniWaveTime = waveDuration / 5;
				this.miniWaveTimer.set(this.miniWaveTime);
				this.miniWaveCount = 2;
			} else if(this.waveTimer.delta() < 0 && this.miniWaveTimer.delta() > 0 && this.miniWaveCount > 0) {
				//spawn wave
				this.spawnWave();
				this.miniWaveTimer.set(this.miniWaveTime);
				this.miniWaveCount--;
			}
		} else {
			this.waveTimer.pause();
			this.miniWaveTimer.pause();
		}


	},

	spawnWave: function() {
		this.spawnEnemy(448, 1400);
		this.spawnEnemy(256, 1208);
		this.spawnEnemy(256, 792);
		this.spawnEnemy(448, 600);
		this.spawnEnemy(720, 600);
		this.spawnEnemy(784, 600);
		this.spawnEnemy(848, 600);
		this.spawnEnemy(1120, 600);
		this.spawnEnemy(1312, 792);
		this.spawnEnemy(1312, 1208);
		this.spawnEnemy(1120, 1400);
	},

	spawnEnemy: function(posx, posy) {
		var enemyType = Math.floor(Math.random() * 8);
		var multiplier = 1.0 + 0.02 * this.waveCount;
		switch(enemyType)
		{
		case 0:
			ig.game.spawnEntity(EntityArcher, posx, posy, {"multiplier": multiplier, "arenaMode": true});
			break;
		case 1:
			ig.game.spawnEntity(EntityMage, posx, posy, {"multiplier": multiplier, "arenaMode": true});
			break;
		case 2:
			ig.game.spawnEntity(EntitySlimer, posx, posy, {"multiplier": multiplier, "arenaMode": true});
			break;
		case 3:
			ig.game.spawnEntity(EntityGoblin, posx, posy, {"multiplier": multiplier, "arenaMode": true});
			break;
		case 4:
			ig.game.spawnEntity(EntityRogue, posx, posy, {"multiplier": multiplier, "arenaMode": true});
			break;
		case 5:
			if(Math.floor(Math.random() * 10) == 9) {
				ig.game.spawnEntity(EntityExplodercrystal, posx, posy, {"multiplier": multiplier, "arenaMode": true});
			} else {
				this.spawnEnemy(posx, posy);
			}
			break;
		case 6:
			if(Math.floor(Math.random() * 10) == 9) {
				ig.game.spawnEntity(EntityClonercrystal, posx, posy, {"multiplier": multiplier, "arenaMode": true});
			} else {
				this.spawnEnemy(posx, posy);
			}
			break;
		default:
			break;
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	}

});

});