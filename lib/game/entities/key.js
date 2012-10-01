ig.module(
	'game.entities.key'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityKey = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 11, y: 14},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/key.png', 11, 14),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );

		this.addAnim('dropped', 1, [0] );
		this.currentAnim = this.anims.dropped;

	},

	update: function() {

		this.parent();

	}

});

});