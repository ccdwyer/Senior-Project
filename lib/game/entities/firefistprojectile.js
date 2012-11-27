ig.module(
	'game.entities.firefistprojectile'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityFirefistprojectile = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B,

	size: {x: 20, y: 20},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/fireball.png', 20, 20),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.global = false;
		this.addAnim('shot', 1, [0] );
		this.currentAnim = this.anims.shot;
		this.selfDestructTimer = new ig.Timer(.3);
		this.maxVel.x = 700;
		this.maxVel.y = 700;
		this.inGame = true;
		this.damage = 180;
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.selfDestructTimer.unpause();
			this.currentAnim.angle += Math.PI * 10 * ig.system.tick;

			if(this.selfDestructTimer.delta() > 0) {
				this.kill();
			}
		} 
		else {
			this.selfDestructTimer.pause();
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	check: function(other) {
		if(!(other instanceof EntityPeg)) {
			other.receiveDamage(this.damage, this);
			this.kill();
		}
	}
});

});