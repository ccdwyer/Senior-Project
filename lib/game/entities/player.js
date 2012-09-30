ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityPlayer = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.ACTIVE,
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.B,

	size: {x: 36, y: 36},
	health: 1000,

	animSheet: new ig.AnimationSheet( 'media/player.png', 36, 36),

	init: function(x, y, settings) {
		// idle animation
		this.addAnim('idle', 1, [0] );
		this.addAnim('idleUp', 1, [12]);
		this.addAnim('idleLeft', 1, [6]);
		this.addAnim('idleRight', 1, [18]);
		// four way directional animation
		this.addAnim('down', 0.2, [1,0,2,0] );
		this.addAnim('up', 0.2, [13,12,14,12] );
		this.addAnim('left', 0.2, [7,6,8,6] );
		this.addAnim('right', 0.2, [19,18,20,18] );
		// diagonal direction animation
		this.addAnim('downRight', 0.2, [22,21,23,21]);
		this.addAnim('downLeft', 0.2, [4,3,5,3]);
		this.addAnim('upRight', 0.2, [16,15,17,15]);
		this.addAnim('upLeft', 0.2, [10,9,11,9]);

		this.parent( x, y, settings );
	},

	update: function() {

		// move up or down
		// move up
		if (ig.input.state('up')) {
			this.vel.y = -100;
			this.currentAnim = this.anims.up;
			if (ig.input.released('up')) {
				this.vel.y = 0
				this.currentAnim = this.anims.idleUp;
			}
		}
		// move down
		else if (ig.input.state('down')) {
			this.vel.y = 100;
			this.currentAnim = this.anims.down;
			if (ig.input.released('down')) {
				this.vel.y = 0;
				this.currentAnim = this.anims.idle;
			}
		}
		else {
			this.vel.y = 0;
		}

		// move left or right
		// move left
		if (ig.input.state('left')) {
			this.vel.x = -100;
			this.currentAnim = this.anims.left;
			if (ig.input.released('left')) {
				this.vel.x = 0;
				this.currentAnim = this.anims.idleLeft;
			}
		}
		// move right
		else if (ig.input.state('right')) {
			this.vel.x = 100;
			this.currentAnim = this.anims.right;
			if(ig.input.released('right')) {
				this.vel.x = 0;
				this.currentAnim = this.anims.idleRight;
			}
		}
		else {
			this.vel.x = 0;
		}
		// animate diagonally
		// animate up left
		if ((this.vel.x < 0) && (this.vel.y < 0)) {
			this.currentAnim = this.anims.upLeft;
		}
		// animate up right
		else if ((this.vel.x > 0) && (this.vel.y < 0)) {
			this.currentAnim = this.anims.upRight;
		}
		// animate down left
		else if ((this.vel.x < 0) && (this.vel.y > 0)) {
			this.currentAnim = this.anims.downLeft;
		}
		// animate down right
		else if((this.vel.x > 0) && (this.vel.y > 0)) {
			this.currentAnim = this.anims.downRight;
		}
		
		this.parent();

	}

});

});