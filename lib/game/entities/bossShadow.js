ig.module(
	'game.entities.bossShadow'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityBossShadow = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 112, y: 117},
	health: 1000,

	animSheet: new ig.AnimationSheet( 'media/bossShadow.png', 112, 117),
	
	bossState: 0,
	distanceCheck: false,
	corner:0,
	
	
	
	init: function(x, y, settings) {
		this.parent( x, y, settings );
		this.global = false;
		this.addAnimations();
		this.maxVel.x = 800;
		this.maxVel.y = 800;
		//this.offset.y = 53;
		//this.offset.x = 88;
		this.attackTimer = new ig.Timer(0.5);
		this.retreatTimer = new ig.Timer((Math.random()*3.5)+0.5);
		this.transitionTimer = new ig.Timer(3);
		this.vanishTimer =  new ig.Timer(0.1);
		this.chargeTimer = new ig.Timer(0);
		this.chargeDurationRemainingTimer = new ig.Timer(0);
		this.isCharging = false;
		this.keyCount = 0;
		this.inGame = true;
		this.keyList = [];
		this.font = new ig.Font( 'media/plainfont.png' );
		
	},
	
	addAnimations: function() {
		// boss modes
		this.addAnim('idleEyes', 1, [8]);
		this.addAnim('idleFace', 1, [4]);
		this.addAnim('dormit', 1, [0]);
		
		// transitions
		this.addAnim('eyesStart', 0.1, [0,5,6,7,8],true );
		this.addAnim('faceStart', 0.1, [0,1,2,3,4],true );
		this.addAnim('eyesEnd', 0.1, [8,7,6,5,0],true );
		
		// death
		this.addAnim('death', 0.1, [0,9,10,11,12,13,14,15,16,18],true );
		
		// attack
		this.addAnim('melee', 0.01, [21,23] );
		
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.chargeTimer.unpause();
			this.chargeDurationRemainingTimer.unpause();
			if(ig.game.getEntitiesByType(EntityPlayer).length > 0) {
				var player = ig.game.getEntitiesByType(EntityPlayer)[0];
				this.handleMovement(player);	
			}
			this.detectCollisionsWithKeys();
		}
	},
	
	draw: function() {
		if (this.inGame) {
			this.parent();
			var bossHealthString = "Boss Health: " + this.health;
			this.font.draw(bossHealthString, 610, 10, ig.Font.ALIGN.LEFT);
			
			//for debugging
			//this.font.draw(this.bossState, 10, 79, ig.Font.ALIGN.LEFT);
			//this.font.draw(this.transitionTimer.delta(), 10, 56, ig.Font.ALIGN.LEFT);
			//this.font.draw(this.attackTimer.delta(), 10, 126, ig.Font.ALIGN.LEFT);
			//this.font.draw(this.retreatTimer.delta(), 10, 149, ig.Font.ALIGN.LEFT);
			//this.font.draw(this.attackTimer.delta(), 30, 56, ig.Font.ALIGN.LEFT);
			//this.font.draw(this.vel.x, 10, 79, ig.Font.ALIGN.LEFT);
			//this.font.draw(this.vel.y, 10, 103, ig.Font.ALIGN.LEFT);
			//this.font.draw(this.currentAnim.frame, 10, 103, ig.Font.ALIGN.LEFT);
			//this.font.draw(this.vanishTimer.delta(), 10, 126, ig.Font.ALIGN.LEFT);
			//this.font.draw(this.currentAnim.alpha, 10, 149, ig.Font.ALIGN.LEFT);
		}
	},

	detectCollisionsWithKeys: function() {
		var keys = ig.game.getEntitiesByType(EntityKey);
		for (i=0; i < keys.length; i++) {
			var key = keys[i];
			if(this.touches(key))
			{
				this.keyList.push(key.name);
				key.kill();
				this.keyCount++;
			}
		}
	},
	
	handleMovement: function(player) {
		if(this.bossState == 0){
			this.transitionTimer.pause();
			this.attackTimer.pause();
			this.retreatTimer.pause();
			this.vanishTimer.pause();	
			this.currentAnim = this.anims.dormit;
			
			if(this.distanceTo(player) < 200){
				this.bossState = 1;
				this.anims.eyesStart.rewind();
				this.currentAnim = this.anims.eyesStart;
			}
		}
		
		if(this.currentAnim.frame == 4 && this.bossState == 1){
			this.isCharging = true;
			this.retreatTimer.set((Math.random()*3.5)+0.5);
			this.retreatTimer.pause();
			this.bossState = 2;
		}
		
		if(this.isCharging) {
				this.vel.x = 1 * Math.cos(this.angleTo(player)) * 210;
				this.vel.y = 1 * Math.sin(this.angleTo(player)) * 210;
		}
		
		if(this.distanceTo(player) < 50 && this.bossState == 2){
			this.vel.x = 0;
			this.vel.y = 0;
			this.isCharging = false;
			this.currentAnim = this.anims.melee;
			player.receiveDamage(1, this);
			this.bossState = 3;
			this.attackTimer.unpause();
		}
		
		if(this.attackTimer.delta()>0 && this.bossState == 3){
			this.bossState = 4;
			this.attackTimer.reset();
			this.attackTimer.pause();
			this.retreatTimer.unpause();
			this.currentAnim = this.anims.eyesStart;
			this.vel.x = -1 * Math.cos(this.angleTo(player)) * 210;
			this.vel.y = -1 * Math.sin(this.angleTo(player)) * 210;
		}
		
		if(this.retreatTimer.delta()>0 && this.bossState == 4){
			this.bossState = 1;
		}
		
		if(this.distanceTo(player) > 200 && this.bossState == 4){
			this.vel.x = 0;
			this.vel.y = 0;	
		}
		
		if(this.health <= 500 && this.bossState < 5){
			this.vel.x = 0;
			this.vel.y = 0;
			this.anims.eyesEnd.rewind();
			this.currentAnim = this.anims.eyesEnd;
			this.attackTimer.reset();
			this.attackTimer.pause();
			this.retreatTimer.reset();
			this.retreatTimer.pause();
			this.attackTimer.set(5);
			this.retreatTimer.set((Math.random()*5)+1);
			this.transitionTimer.unpause();
			this.bossState=5;
		}
		
		if(this.transitionTimer.delta()>0 && this.bossState == 5){
			this.bossState = 6;
			this.attackTimer.unpause();
			this.anims.faceStart.rewind();
			this.currentAnim = this.anims.faceStart;
			this.health = 500;
		}
		
		if(this.bossState == 6){
			if(this.distanceTo(player) < 300){
				this.retreatTimer.unpause();
				this.vel.x = -1 * Math.cos(this.angleTo(player)) * 210;
				this.vel.y = -1 * Math.sin(this.angleTo(player)) * 210;
			}
			else{
				this.retreatTimer.set((Math.random()*5)+1);
				this.retreatTimer.pause();
				this.vel.x = 0;
				this.vel.y = 0;
			}
			if(this.attackTimer.delta()>0){
				ig.game.spawnEntity( EntityShadowSpawn, this.pos.x+35, this.pos.y+50);
				this.attackTimer.reset();
				this.attackTimer.unpause();
			}
			if(this.retreatTimer.delta()>0){
				
			}
		}
		/*if(this.health <= 0)
			this.bossState = 7;*/
		
	},
	
	kill: function() {
		//ig.game.normalEnemyItemDrop(this.pos.x, this.pos.y);
		/*this.vel.x = 0;
		this.vel.y = 0;
		this.anims.death.rewind();
		this.currentAnim = this.anims.death;*/
		var shadowSpawns = ig.game.getEntitiesByType(EntityShadowSpawn);
		for (var i=0; i < shadowSpawns.length; i++) {
			shadowSpawns[i].kill();
		}
		//if(this.currentAnim.frame == 9){
			this.parent();
		//}
		
			
		for(i = 0; i < this.keyCount; i++)
				ig.game.spawnEntity(EntityKey, this.pos.x + 10, this.pos.y + 10, {'name': this.keyList[i]});
	}

});

});