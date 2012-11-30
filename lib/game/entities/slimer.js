ig.module(
	'game.entities.slimer'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntitySlimer = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 32, y: 28},
	health: 100,
	arenaMode: false,
	multiplier: 1.0,

	animSheet: new ig.AnimationSheet( 'media/slimer.png', 48, 48),

	init: function(x, y, settings) {
		this.addAnimations();
		this.parent(x, y, settings);
		this.inGame = true;

		this.offset.x = 8;
		this.offset.y = 12;
		this.invulnerableTimer = new ig.Timer(0);
		this.knockbackTimer = new ig.Timer(0);
		this.knockbackAngle = 0;
		this.applyFloorMultiplier = !settings.multiplier;
	},

	ready: function() {
		if(this.applyFloorMultiplier) {
			this.multiplier += 0.075 * ig.game.myDirector.currentLevel;
		}
		this.health = Math.floor(this.health * this.multiplier);
	},

	addAnimations: function() {
		// idle animations
		this.addAnim('idle', 1, [2]);
		this.addAnim('idleUp', 1, [5]);
		this.addAnim('idleLeft', 1, [9]);
		this.addAnim('idleRight', 1, [6]);
		// walking animations
		this.addAnim('down', 0.2, [0,2,1,2]);
		this.addAnim('up', 0.2, [4,5,3,5]);
		this.addAnim('left', 0.2, [10,11,9]);
		this.addAnim('right', 0.2, [7,8,6]);
		//diagonal animations
		this.addAnim('upLeft', 0.2, [10,11,9]);
		this.addAnim('upRight', 0.2, [7,8,6]);
		this.addAnim('downLeft', 0.2, [10,11,9]);
		this.addAnim('downRight', 0.2, [7,8,6]);
		// attack animation
		this.addAnim('attack', 3, [12]);

	},

	update: function() {
		if (this.inGame) {
			this.parent();
			if(ig.game.getEntitiesByType(EntityPlayer).length > 0) {
				var player = ig.game.getEntitiesByType(EntityPlayer)[0];
			
				this.handleMovement(player);
				
			}
			else {
				this.vel.x = 0;
				this.vel.y = 0;
			}
		} 
	},

	receiveDamage: function(amount, from) {
		if(this.invulnerableTimer.delta() > 0) {
			this.parent(amount, from);
			this.invulnerableTimer.set(0.2);
			this.knockbackTimer.set(0.2);
			this.knockbackAngle = this.angleTo(ig.game.playerController.playerCharacter) + Math.PI;
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	handleMovement: function(player) {
		if (this.knockbackTimer.delta() < 0) {
			this.vel.x = Math.cos(this.knockbackAngle) * 200;
			this.vel.y = Math.sin(this.knockbackAngle) * 200;
		} else {
			if(this.distanceTo(player) < 20) {
					this.currentAnim = this.anims.attack;
				}
			else if(this.distanceTo(player) < 100 || this.arenaMode) {
					this.vel.x = 1 * Math.cos(this.angleTo(player)) * 50;
					this.vel.y = 1 * Math.sin(this.angleTo(player)) * 50;
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
		}
	},

	kill: function() {
		ig.game.normalEnemyItemDrop(this.pos.x, this.pos.y);
		this.parent();
	}

});

});
