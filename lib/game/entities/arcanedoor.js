ig.module(
	'game.entities.arcanedoor'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityArcanedoor = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.FIXED,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,

	size: {x: 64, y: 64},
	health: 5,

	animSheet: new ig.AnimationSheet( 'media/arcanedoor.png', 64, 64),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.addAnim('placed', 1, [0] );
		this.currentAnim = this.anims.placed;
		this.openTimer = new ig.Timer(0);
		this.inGame = true;
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.openTimer.unpause();
			if (this.openTimer.delta() > 0) {
				this.collides = ig.Entity.COLLIDES.FIXED;
				this.currentAnim.alpha = 1;
			} else {
				this.collides = ig.Entity.COLLIDES.NONE;
				this.currentAnim.alpha = .5;
			}
		} else {
			this.openTimer.pause();
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	openDoor: function() {
		this.openTimer.set(1);
	}
});

});