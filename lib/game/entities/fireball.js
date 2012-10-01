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
		this.addAnim('shot', 1, [0] );
		this.currentAnim = this.anims.shot;
		this.parent( x, y, settings );
		this.selfDestructTimer = new ig.Timer(15);
	},

	update: function() {

		this.currentAnim.angle += Math.PI * 2 * ig.system.tick;
		if(this.selfDestructTimer.delta() > 0) {
			this.kill();
		}
		if(this.pos.x == this.last.x && this.pos.y == this.last.y) {
			this.kill();
		}

		this.parent();

	}

});

});