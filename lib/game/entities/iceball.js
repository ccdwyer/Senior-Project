ig.module(
	'game.entities.iceball'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityIceball = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.FIXED,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,

	size: {x: 32, y: 32},
	health: 1,

	animSheet: new ig.AnimationSheet( 'media/iceball.png', 32, 32),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.addAnim('placed', 1, [0] );
		this.currentAnim = this.anims.placed;

		this.inGame = true;
	},

	update: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	receiveDamage: function(amount, from) {
		if(from instanceof EntityFist || from instanceof EntityFirefistprojectile) {
			this.kill();
		}
	}

});

});