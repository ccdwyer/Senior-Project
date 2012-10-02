ig.module(
	'game.entities.mage'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityMage = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 32, y: 32},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/darkMage.png', 32, 32),

	init: function(x, y, settings) {
		// idle animation
		this.addAnim('idle', 1, [0] );
		this.addAnim('idleUp', 1, [9]);
		this.addAnim('idleLeft', 1, [3]);
		this.addAnim('idleRight', 1, [6]);

		// four way directional animation
		this.addAnim('down', 0.2, [0,1,2] );
		this.addAnim('up', 0.2, [9,10,11] );
		this.addAnim('left', 0.2, [3,4,5] );
		this.addAnim('right', 0.2, [6,7,8] );

		// diagonal direction animation
		this.addAnim('downRight', 0.2, [6,7,8]);
		this.addAnim('downLeft', 0.2, [3,4,5]);
		this.addAnim('upRight', 0.2, [6,7,8]);
		this.addAnim('upLeft', 0.2, [3,4,5]);

		this.fireballTimer = new ig.Timer(10);
		this.teleportTimer = new ig.Timer(0);

		this.parent( x, y, settings );
	},

	update: function() {
		this.parent();

		if(ig.game.getEntitiesByType(EntityPlayer).length > 0) {
			var player = ig.game.getEntitiesByType(EntityPlayer)[0];
		
			//Handles movement
			if(this.distanceTo(player) < 300) {
				this.vel.x = -1 * Math.cos(this.angleTo(player)) * 50;
				this.vel.y = -1 * Math.sin(this.angleTo(player)) * 50;
				if(this.vel.y < 0 && this.vel.x < 0)
					this.currentAnim = this.anims.upLeft;
				else if(this.vel.y < 0 && this.vel.x > 0)
					this.currentAnim = this.anims.upRight;
				else if(this.vel.y > 0 && this.vel.x < 0)
					this.currentAnim = this.anims.downLeft;
				else if(this.vel.y > 0 && this.vel.x > 0)
					this.currentAnim = this.anims.downRight;
				else if(this.vel.y < 0 && this.vel.x == 0)
					this.currentAnim = this.anims.up;
				else if(this.vel.y > 0 && this.vel.x == 0)
					this.currentAnim = this.anims.down;
				else if(this.vel.y == 0 && this.vel.x < 0)
					this.currentAnim = this.anims.left;
				else if(this.vel.y == 0 && this.vel.x > 0)
					this.currentAnim = this.anims.right;
			}
			else {
				this.vel.x = 0;
				this.vel.y = 0;
				this.currentAnim = this.anims.idle;
			}


			//Handles Fireball casting
			if(this.fireballTimer.delta() > 0) {
				ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y, 
					{vel: {x: Math.cos(this.angleTo(player)) * 70, 
						   y: Math.sin(this.angleTo(player)) * 70}});
				this.fireballTimer.set(7);
			}

			//Handles teleportation casting
			if(this.distanceTo(player) < 100 && this.teleportTimer.delta() > 0) {
				this.pos.x += 300 - Math.random()*600; 
				this.pos.y += 300 - Math.random()*600;
				this.teleportTimer.set(10);
			}
		}
		else {
			this.vel.x = 0;
			this.vel.y = 0;
		}
		
	}

});

});