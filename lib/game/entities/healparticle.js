ig.module(
	'game.entities.healparticle'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityHealparticle = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,

	size: {x: 25, y: 25},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/healparticle.png', 25, 25),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		var rand = Math.floor(Math.random() * 5);
		this.addAnim('heal', 1, [rand] );
		this.vel.x = 0;
		this.vel.y = -20;
		this.inGame = true;
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