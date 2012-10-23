ig.module(
	'game.entities.fireball'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityFireball = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 20, y: 20},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/fireball.png', 20, 20),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.addAnim('shot', 1, [0] );
		this.currentAnim = this.anims.shot;
		this.selfDestructTimer = new ig.Timer(15);
		this.maxVel.x = 200;
		this.maxVel.y = 200;
		this.inGame = true;
	},

	check: function(other) {
		other.receiveDamage(100, this);
		this.kill();
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.selfDestructTimer.unpause();
			this.currentAnim.angle += Math.PI * 2 * ig.system.tick;
			if(this.selfDestructTimer.delta() > 0) {
				this.kill();
			}
			if(this.pos.x == this.last.x && this.pos.y == this.last.y) {
				this.kill();
			}
		} else {
			this.selfDestructTimer.pause();
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