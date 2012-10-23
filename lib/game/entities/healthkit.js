ig.module(
	'game.entities.healthkit'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityHealthkit = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 14, y: 14},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/healthkit.png', 14, 14),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.addAnim('dropped', 1, [0] );
		this.currentAnim = this.anims.dropped;
		this.inGame = true;
		this.checkedIfPickedUp = false;
	},

	update: function() {
		if(this.inGame)
			this.parent();
	},

	check: function(other) {
		if(other instanceof EntityPlayer) {
			other.healBy(Math.floor(Math.random()*76) + 25);
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