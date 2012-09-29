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

	size: {x: 32, y: 48},
	health: 1000,

	animSheet: new ig.AnimationSheet( 'media/player.png', 32, 48),

	init: function(x, y, settings) {
		this.addAnim('idle', 1, [1] );
		this.addAnim('idleUp', 1, [10]);
		this.addAnim('idleLeft', 1, [4]);
		this.addAnim('idleRight', 1, [7]);

		this.addAnim('down', 0.2, [0,1,2,1] );
		this.addAnim('left', 0.2, [3,4,5,4] );
		this.addAnim('right', 0.2, [6,7,8,7] );
		this.addAnim('up', 0.2, [9,10,11,10] );

		this.parent( x, y, settings );
	},

	update: function() {

		//this.currentAnim = this.anims.idle;
		// move up or down
		if (ig.input.state('up')) {
			this.vel.y = -100;
			this.currentAnim = this.anims.up;
			if (ig.input.released('up')) {
				this.vel.y = 0
				this.currentAnim = this.anims.idleUp;
			}
		}
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
		if (ig.input.state('left')) {
			this.vel.x = -100;
			this.currentAnim = this.anims.left;
			if (ig.input.released('left')) {
				this.vel.x = 0;
				this.currentAnim = this.anims.idleLeft;
			}
		}
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
		
		this.parent();

	}
	/*update: function() {

		// move up
		if (ig.input.state('up')) {
			this.vel.y = -100;
			this.currentAnim = this.anims.up;
		}
		else {
			this.vel.y = 0;
			this.currentAnim = this.anims.idleUp;
		}
		// move down
		if (ig.input.state('down')) {
			this.vel.y = 100;
			this.currentAnim = this.anims.down;
		}
		else {
			this.vel.y = 0;
			this.currentAnim = this.anims.idle;
		}
		// move left
		if (ig.input.state('left')) {
			this.vel.x = -100;
			this.currentAnim = this.anims.left;
		}
		else {
			this.vel.x = 0;
			this.currentAnim = this.anims.idleLeft;
		}
		// move right
		if (ig.input.state('right')) {
			this.vel.x = 100;
			this.currentAnim = this.anims.right;
		}
		else {
			this.vel.x = 0;
			this.currentAnim = this.anims.idleRight;
		}
		this.currentAnim = this.anims.idle;
		this.parent();

	}*/

});

});