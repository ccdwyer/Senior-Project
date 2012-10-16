ig.module(
	'game.entities.mage'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityMage = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 32, y: 32},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/darkMage.png', 32, 32),

	init: function(x, y, settings) {
		this.addAnimations();
		this.addSpellTimers();
		this.parent( x, y, settings );
		this.global = false;
		this.inGame = true;
	},

	addAnimations: function() {
		// idle animation
		this.addAnim('idle', 1, [0] );
		this.addAnim('idleUp', 1, [9]);
		this.addAnim('idleLeft', 1, [3]);
		this.addAnim('idleRight', 1, [6]);

		// four way directional animation
		this.addAnim('down', 0.2, [0,1,2] );
		this.addAnim('up', 0.2, [9,10,11] );
		this.addAnim('left', 0.2, [3,4,5] );
		this.addAnim('right', 0.2, [6,7,8] );

		// diagonal direction animation
		this.addAnim('downRight', 0.2, [6,7,8]);
		this.addAnim('downLeft', 0.2, [3,4,5]);
		this.addAnim('upRight', 0.2, [6,7,8]);
		this.addAnim('upLeft', 0.2, [3,4,5]);
	},

	addSpellTimers: function() {
		this.fireballTimer = new ig.Timer(10);
		this.teleportTimer = new ig.Timer(0);
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.fireballTimer.unpause();
			this.teleportTimer.unpause();
			if(ig.game.getEntitiesByType(EntityPlayer).length > 0) {
				var player = ig.game.getEntitiesByType(EntityPlayer)[0];
			
				this.handleMovement(player);
				this.handleSpellCasting(player);
				
			}
			else {
				this.vel.x = 0;
				this.vel.y = 0;
				this.currentAnim = this.anims.idle;
			}
		} else {
			this.fireballTimer.pause();
			this.teleportTimer.pause();
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	handleMovement: function(player) {
		if(this.distanceTo(player) < 100) {
				this.vel.x = -1 * Math.cos(this.angleTo(player)) * 50;
				this.vel.y = -1 * Math.sin(this.angleTo(player)) * 50;
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

	handleSpellCasting: function(player) {
		this.handleFireballCasting(player);
		this.handleTeleportCasting(player);
	},

	handleFireballCasting: function(player) {
		if(this.fireballTimer.delta() > 0) {
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
				{vel: {x: Math.cos(this.angleTo(player)) * 70, 
					   y: Math.sin(this.angleTo(player)) * 70}});
			this.fireballTimer.set(3 + Math.random()*8);
		}
	},

	handleTeleportCasting: function(player) {
		if(this.distanceTo(player) < 100 && this.teleportTimer.delta() > 0) {
			this.pos.x += 50 - Math.random()*100; 
			this.pos.y += 50 - Math.random()*100;
			this.teleportTimer.set(10);
		}
	},

	kill: function() {
		ig.game.normalEnemyItemDrop(this.pos.x, this.pos.y);
		this.parent();
	}

});

});