ig.module(
	'game.entities.shadowSpawn'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityShadowSpawn = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.BOTH,

	size: {x: 32, y: 40},
	health: 50,

	animSheet: new ig.AnimationSheet( 'media/shadowSpawn.png', 32, 40),

	init: function(x, y, settings) {
		this.parent( x, y, settings );
		this.global = false;
		this.addAnimations();
		this.maxVel.x = 800;
		this.maxVel.y = 800;
		this.offset.y = 2;
		this.offset.x = 3;
		this.attackTimer = new ig.Timer(1);
		this.chargeTimer = new ig.Timer(0);
		this.chargeDurationRemainingTimer = new ig.Timer(0);
		this.isCharging = false;
		this.keyCount = 0;
		this.inGame = true;
		this.keyList = [];
		this.hitTimer = new ig.Timer(0);
		this.hitBossTimer = new ig.Timer(5);
	},

	addAnimations: function() {
		// idle animation
		this.addAnim('idle', 1, [0] );
	},
	check: function(other) {
		if(other instanceof EntityPlayer && this.hitTimer.delta() > 0) {
			other.receivePureDamage(5, this);
			this.hitTimer.set(1);
		} else if(other instanceof EntityBossShadow && this.hitBossTimer.delta() > 0) {
			other.weaken();
			this.kill();
		}
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
			else {
				this.vel.x = 0;
				this.vel.y = 0;
				this.currentAnim = this.anims.idle;
			}
			this.detectCollisionsWithKeys();
		} else {
			this.chargeTimer.pause();
			this.chargeDurationRemainingTimer.pause();
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
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
		if(this.distanceTo(player) > 20) {
			this.attackTimer.unpause();
			this.vel.x = 1 * Math.cos(this.angleTo(player)) * 200;
			this.vel.y = 1 * Math.sin(this.angleTo(player)) * 200;
			
		}
		else{
			if(this.attackTimer.delta()>0){
				this.attackTimer.reset();
				this.attackTimer.unpause();
			}
			this.vel.x = 0;
			this.vel.y = 0;
		}
	},

	kill: function() {
		this.parent();
		for(i = 0; i < this.keyCount; i++)
			ig.game.spawnEntity(EntityKey, this.pos.x + 10, this.pos.y + 10, {'name': this.keyList[i]});
	}

});

});