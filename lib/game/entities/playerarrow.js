ig.module(
	'game.entities.playerarrow'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityPlayerarrow = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B,

	size: {x: 20, y: 4},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/arrow.png', 20, 7),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.addAnim('shot', 1, [0] );
		this.currentAnim = this.anims.shot;
		this.selfDestructTimer = new ig.Timer(15);
		this.maxVel.x = 600;
		this.maxVel.y = 600;
		this.offset.y = 2;
		this.bowLevel = settings.bowLevel; 
		this.baseDamage = 34;
		this.damageScalingRate = .3;
		this.isTracking = false;
		this.entityTracking = null;
		this.inGame = true;
	},

	update: function() {

		if (this.inGame) {
			this.parent();
			//if(this.bowLevel == 5 && !this.isTracking) {
			//	var closestEntity = this.findClosestEntity();
			//	if(this.distanceTo(closestEntity) < 100) {
			//		this.isTracking = true;
			//		this.entityTracking = closestEntity;
			//	}
			//} else {
			//	var angleToEntityTracking = this.angleTo(this.entityTracking);
			//	this.vel.x = Math.cos(angleToEntityTracking) * this.speed; 
			//	this.vel.y = Math.sin(angleToEntityTracking) * this.speed;
			//}
			this.currentAnim.angle = Math.atan2(this.vel.y, this.vel.x);

			this.selfDestructTimer.unpause();
			if(this.selfDestructTimer.delta() > 0) {
				this.kill();
			}
			if(this.pos.x == this.last.x && this.pos.y == this.last.y) {
				this.kill();
			}
		} else {
			this.selfDestructTimer.pause();
		}
	},

	check: function(other) {
		if(!(other instanceof EntityPlayer)) {
			other.receiveDamage(Math.floor(this.baseDamage * (1+this.bowLevel*this.damageScalingRate)), this);
			if(this.bowLevel < 5) this.kill();
			
		}
	},

	findClosestEntity: function() {
		var closestEntity = this.findClosestArcher();
		var closestMage = this.findClosestMage();
		if (this.distanceTo(closestEntity) > this.distanceTo(closestMage)) {
			closestEntity = closestMage;
		}
		var closestGoblin = this.findClosestGoblin();
		if (this.distanceTo(closestEntity) > this.distanceTo(closestGoblin)) {
			closestEntity = closestGoblin;
		}
		var closestSlimer = this.findClosestSlimer();
		if (this.distanceTo(closestEntity) > this.distanceTo(closestSlimer)) {
			closestEntity = closestSlimer;
		}
		var closestCloningCrystal = this.findClosestCloningCrystal();
		if (this.distanceTo(closestEntity) > this.distanceTo(closestCloningCrystal)) {
			closestEntity = closestCloningCrystal;
		}
	},

	findClosestArcher: function() {

	},



	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	handleMovementTrace: function( res ) {
	    if( res.collision.y || res.collision.x ) {
	        this.kill();
	    }

	    // Continue resolving the collision as normal
	    this.parent(res); 
	}

});

});