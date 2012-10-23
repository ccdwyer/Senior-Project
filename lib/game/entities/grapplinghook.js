ig.module(
	'game.entities.grapplinghook'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityGrapplinghook = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B,

	size: {x: 10, y: 10},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/grapplinghook.png', 15, 15),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.handleAddingAnimations();
		this.selfDestructTimer = new ig.Timer(.5);
		this.maxVel.x = 600;
		this.maxVel.y = 600;
		this.inGame = true;

	},

	handleAddingAnimations: function() {
		this.addAnim('down', 1, [0] );
		this.addAnim('right', 1, [1] );
		this.addAnim('left', 1, [2] );
		this.addAnim('up', 1, [3] );
		this.offset.x = 3;
		this.offset.y = 3;
		this.currentAnim = this.anims.down;
		if (this.vel.y > 0)
			this.currentAnim = this.anims.down;
		if (this.vel.y < 0)
			this.currentAnim = this.anims.up;
		if (this.vel.x > 0)
			this.currentAnim = this.anims.right;
		if (this.vel.x < 0)
			this.currentAnim = this.anims.left;
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.selfDestructTimer.unpause();
			//this.handleCollisions();
			if(this.selfDestructTimer.delta() > 0) {
				(ig.game.getEntitiesByType(EntityPlayer)[0]).stopGrappling();
				this.kill();
			}

		} else {
			this.selfDestructTimer.pause();
		}
	},

	check: function(other) {
		if(other instanceof EntityPeg) {
			ig.game.playerController.playerCharacter.setDestination(this.pos.x, this.pos.y);
			this.kill();
			
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	getPosition: function() {
		return this.pos;
	},

	handleMovementTrace: function( res ) {
    	// This completely ignores the trace result (res) and always
    	// moves the entity according to its velocity
    	this.pos.x += this.vel.x * ig.system.tick;
    	this.pos.y += this.vel.y * ig.system.tick;
	}

});

});