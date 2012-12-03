ig.module(
	'game.entities.energybombardment'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityEnergybombardment = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 60, y: 60},
	health: 100,
	damage: 100,

	animSheet: new ig.AnimationSheet( 'media/energybombardment.png', 60, 60),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.addAnim('first', 1, [0] );
		this.addAnim('second', 1, [1] );
		this.addAnim('third', 1, [2] );
		this.addAnim('fourth', 1, [3] );
		this.addAnim('fifth', 1, [4] );
		var rand = Math.floor(Math.random()*5);
		if(rand == 0) this.currentAnim = this.anims.first;
		else if(rand == 1) this.currentAnim = this.anims.second;
		else if(rand == 2) this.currentAnim = this.anims.third;
		else if(rand == 3) this.currentAnim = this.anims.fourth;
		else if(rand == 4) this.currentAnim = this.anims.fifth;
		this.inGame = true;
	},

	check: function(other) {
		other.receiveDamage(this.damage, this);
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.currentAnim.alpha -= .015;
			if(this.currentAnim.alpha < .1)
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