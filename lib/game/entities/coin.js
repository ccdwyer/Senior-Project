ig.module(
	'game.entities.coin'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityCoin = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 15, y: 15},
	offset: {x: 5, y: 5},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/coin.png', 25, 25),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.addAnim('small', 1, [0] );
		this.addAnim('medium', 1, [1] );
		this.addAnim('large', 1, [2] );
		this.addAnim('pile', 1, [3] );
		this.amount = settings.amount;
		if(this.amount >= 125) {
			this.currentAnim = this.anims.pile;
		} else if(this.amount >= 50) {
			this.currentAnim = this.anims.large;
		} else if(this.amount >= 10) { 
			this.currentAnim = this.anims.medium;
		} else {
			this.currentAnim = this.anims.small;
		}
		this.inGame = true;
	},

	update: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	check: function(other) {
		if(other instanceof EntityPlayer) {
			other.addCoins(this.amount);
			this.kill();
			ig.game.coinSound.play();
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	}

});

});