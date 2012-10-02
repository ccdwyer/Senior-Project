ig.module(
	'game.entities.boomerang'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityBoomerang = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B,

	size: {x: 20, y: 20},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/boomerang.png', 20, 20),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );

		this.addAnim('thrown', 1, [0] );
		this.currentAnim = this.anims.thrown;
		this.returnTimer = new ig.Timer(.6);
		this.maxVel.x = 400;
		this.maxVel.y = 400;

		this.States = { "thrown" : 0,
						"returning" : 1 };
		this.state = this.States.thrown;

	},

	update: function() {

		this.currentAnim.angle += Math.PI * 2 * ig.system.tick;

		//Detects collisions
		var mages = ig.game.getEntitiesByType(EntityMage);
		for (i=0; i < mages.length; i++) {
			var mage = mages[i];
			if(this.touches(mage))
			{
				mage.receiveDamage(50, this);
				this.state = this.States.returning;
			}
		}

		var archers = ig.game.getEntitiesByType(EntityArcher);
		for (i=0; i < archers.length; i++) {
			var archer = archers[i];
			if(this.touches(archer))
			{
				archer.receiveDamage(50, this);
				this.state = this.States.returning;
			}
		}

		if(this.state == this.States.thrown){
			if(this.returnTimer.delta() > 0) {
				this.state = this.States.returning;
			}
			if(this.pos.x == this.last.x && this.pos.y == this.last.y) {
				this.state = this.States.returning;
			}
		}
		else {
			if(ig.game.getEntitiesByType(EntityPlayer).length > 0) {
				var player = ig.game.getEntitiesByType(EntityPlayer)[0];
				var angleToPlayer = this.angleTo(player);
				this.vel.x = Math.cos(angleToPlayer) * 400;
				this.vel.y = Math.sin(angleToPlayer) * 400;
			}
		}

		this.parent();

	},
	handleMovementTrace: function( res ) {
	    if( (this.state == this.States.returning) && (res.collision.y || res.collision.x) ) {
	        this.kill();
	    }

	    // Continue resolving the collision as normal
	    this.parent(res); 
	}

});

});