ig.module(
	'game.entities.energybeam'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityEnergybeam = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	hasAimed: false,

	size: {x: 15, y: 15},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/energybeam.png', 15, 15),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.global = false;
		this.addAnim('shot', 1, [0] );
		this.currentAnim = this.anims.shot;
		this.selfDestructTimer = new ig.Timer(10);
		this.maxVel.x = 1000;
		this.maxVel.y = 1000;
		this.damageAmount = 100;
		this.inGame = true;
		this.reAimTimer = new ig.Timer(1);
	},

	check: function(other) {
		other.receiveDamage(this.damageAmount, this);
		this.kill();
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.selfDestructTimer.unpause();
			this.reAimTimer.unpause();
			if(this.selfDestructTimer.delta() > 0) {
				this.kill();
			}
			if(this.reAimTimer.delta() > 0 && !this.hasAimed) {
				this.vel.x = 1 * Math.cos(this.angleTo(ig.game.playerController.playerCharacter)) * 500;
				this.vel.y = 1 * Math.sin(this.angleTo(ig.game.playerController.playerCharacter)) * 500;
				this.hasAimed = true;
			}
			ig.game.spawnEntity(EntityEnergytrace, this.pos.x+4, this.pos.y+4);
		} else {
			this.selfDestructTimer.pause();
			this.reAimTimer.pause();
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	handleMovementTrace: function( res ) {
    	// This completely ignores the trace result (res) and always
    	// moves the entity according to its velocity
    	this.pos.x += this.vel.x * ig.system.tick;
    	this.pos.y += this.vel.y * ig.system.tick;
	}

});

});