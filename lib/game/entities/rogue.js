ig.module(
	'game.entities.rogue'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityRogue = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 28, y: 28},
	health: 50,

	animSheet: new ig.AnimationSheet( 'media/rogue.png', 32, 35),

	init: function(x, y, settings) {
		this.parent( x, y, settings );
		this.addAnimations();
		this.maxVel.x = 800;
		this.maxVel.y = 800;
		this.offset.y = 2;
		this.offset.x = 3;
		this.chargeTimer = new ig.Timer(0);
		this.chargeDurationRemainingTimer = new ig.Timer(0);
		this.isCharging = false;
		this.keyCount = 0;
		this.inGame = true;
		this.keyList = [];
		this.invulnerableTimer = new ig.Timer(0);
	},

	addAnimations: function() {
		// idle animation
		this.addAnim('idle', 1, [1] );
		this.addAnim('idleUp', 1, [10]);
		this.addAnim('idleLeft', 1, [4]);
		this.addAnim('idleRight', 1, [7]);

		// four way directional animation
		this.addAnim('down', 0.2, [0,1,2,1] );
		this.addAnim('up', 0.2, [9,10,11,10] );
		this.addAnim('left', 0.2, [3,4,5,4] );
		this.addAnim('right', 0.2, [6,7,8,7] );

		// diagonal direction animation
		this.addAnim('downRight', 0.2, [6,7,8,7]);
		this.addAnim('downLeft', 0.2, [3,4,5,4]);
		this.addAnim('upRight', 0.2, [6,7,8,7]);
		this.addAnim('upLeft', 0.2, [3,4,5,4]);
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.invulnerableTimer.unpause();
			if(ig.game.getEntitiesByType(EntityPlayer).length > 0) {
				var player = ig.game.getEntitiesByType(EntityPlayer)[0];
				this.handleCloaking(player);
				//Handles movement
				this.handleMovement(player);
			}
			else {
				this.vel.x = 0;
				this.vel.y = 0;
				this.currentAnim = this.anims.idle;
			}
			this.detectCollisionsWithKeys();
		} else {
			this.invulnerableTimer.pause();
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

	receiveDamage: function(amount, from) {
		if(this.invulnerableTimer.delta() > 0) {
			this.parent(amount, from);
			this.invulnerableTimer.set(0.2);
		}
	},

	handleMovement: function(player) {
		
		if(this.distanceTo(player) < 400) {
			this.vel.x = 1 * Math.cos(this.angleTo(player)) * 80;
			this.vel.y = 1 * Math.sin(this.angleTo(player)) * 80;

			if(this.vel.y < 0 && this.vel.x < 0)
				this.currentAnim = this.anims.upLeft;
			else if(this.vel.y < 0 && this.vel.x > 0)
				this.currentAnim = this.anims.upRight;
			else if(this.vel.y > 0 && this.vel.x < 0)
				this.currentAnim = this.anims.downLeft;
			else if(this.vel.y > 0 && this.vel.x > 0)
				this.currentAnim = this.anims.downRight;
			else if(this.vel.y < 0 && this.vel.x == 0)
				this.currentAnim = this.anims.up;
			else if(this.vel.y > 0 && this.vel.x == 0)
				this.currentAnim = this.anims.down;
			else if(this.vel.y == 0 && this.vel.x < 0)
				this.currentAnim = this.anims.left;
			else if(this.vel.y == 0 && this.vel.x > 0)
				this.currentAnim = this.anims.right;
		}
		else {
			this.vel.x = 0;
			this.vel.y = 0;
			this.currentAnim = this.anims.idle;
		}
	},

	handleCloaking: function(player) {
		var distanceToPlayer = this.distanceTo(player);
		if(distanceToPlayer < 60)
			this.currentAnim.alpha = 1;
		else if(distanceToPlayer > 120)
			this.currentAnim.alpha = 0;
		else
			this.currentAnim.alpha = 1 - (distanceToPlayer - 60) / 60;
	},

	kill: function() {
		this.parent();
		for(i = 0; i < this.keyCount; i++)
			ig.game.spawnEntity(EntityKey, this.pos.x + 10, this.pos.y + 10, {'name': this.keyList[i]});
	}

});

});