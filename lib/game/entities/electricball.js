ig.module(
	'game.entities.electricball'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityElectricball = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 48, y: 48},
	health: 1,

	animSheet: new ig.AnimationSheet( 'media/electricball.png', 48, 48),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.addAnim('placed', 0.25, [0,1,2,3,4] );
		this.currentAnim = this.anims.placed;

		this.inGame = true;
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.currentAnim.angle += Math.PI * .5 * ig.system.tick;
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	check: function(other) {
		other.receiveDamage(25, this);
	},

	receiveDamage: function(amount, from) {
		if(from instanceof EntityFist || from instanceof EntityFirefistprojectile) {
			this.kill();
		}
	}

});

});