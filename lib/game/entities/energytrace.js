ig.module(
	'game.entities.energytrace'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityEnergytrace = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,

	size: {x: 10, y: 10},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/energytrace.png', 10, 10),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.addAnim('dropped', 1, [0] );
		this.currentAnim = this.anims.dropped;
		this.inGame = true;
		this.checkedIfPickedUp = false;
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.currentAnim.alpha -= .025;
			if(this.currentAnim.alpha < .2)
				this.kill();
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	}

});

});