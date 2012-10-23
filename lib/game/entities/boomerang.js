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

	size: {x: 23, y: 20},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/boomerang.png', 23, 20),

	init: function(x, y, settings, level) {
		// idle animation
		this.parent( x, y, settings );
		this.global = false;
		this.addAnim('thrown', 1, [0] );
		this.currentAnim = this.anims.thrown;
		this.returnTime = settings.boomerangReturnTime;
		this.returnTimer = new ig.Timer(this.returnTime);
		this.maxVel.x = 400;
		this.maxVel.y = 400;

		this.States = { "thrown" : 0,
						"returning" : 1 };
		this.state = this.States.thrown;
		this.boomerangLevel = settings.boomerangLevel;
		this.damage = 50 * (1.0 + 0.2 * this.boomerangLevel);

		this.inGame = true;
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.returnTimer.unpause();
			this.currentAnim.angle += Math.PI * 2 * ig.system.tick;

			//this.detectCollisionsWithEnemies();
			this.handleReturningToPlayer();
		} else {
			this.returnTimer.pause();
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	detectCollisionsWithEnemies: function() {
		this.detectCollisionsWithMages();
		this.detectCollisionsWithArchers();
		this.detectCollisionsWithSlimers();
		this.detectCollisionsWithGoblins();
		this.detectCollisionsWithCrystals();
	},

	check: function(other) {
		if(!(other instanceof EntityPeg))
			other.receiveDamage(this.damage, this);
		this.state = this.States.returning;
	},

	//detectCollisionsWithMages: function() {
	//	var mages = ig.game.getEntitiesByType(EntityMage);
	//	for (var i=0; i < mages.length; i++) {
	//		var mage = mages[i];
	//		if(this.touches(mage))
	//		{
	//			mage.receiveDamage(this.damage, this);
	//			this.state = this.States.returning;
	//		}
	//	}
	//},
//
	//detectCollisionsWithArchers: function() {
	//	var archers = ig.game.getEntitiesByType(EntityArcher);
	//	for (var i=0; i < archers.length; i++) {
	//		var archer = archers[i];
	//		if(this.touches(archer))
	//		{
	//			archer.receiveDamage(this.damage, this);
	//			this.state = this.States.returning;
	//		}
	//	}
	//},
//
	//detectCollisionsWithSlimers: function() {
	//	var slimers = ig.game.getEntitiesByType(EntitySlimer);
	//	for (var i=0; i < slimers.length; i++) {
	//		var slimer = slimers[i];
	//		if(this.touches(slimer))
	//		{
	//			slimer.receiveDamage(this.damage, this);
	//			this.state = this.States.returning;
	//		}
	//	}
	//},
//
	//detectCollisionsWithGoblins: function() {
	//	var goblins = ig.game.getEntitiesByType(EntityGoblin);
	//	for (var i=0; i < goblins.length; i++) {
	//		var goblin = goblins[i];
	//		if(this.touches(goblin))
	//		{
	//			goblin.receiveDamage(this.damage, this);
	//			this.state = this.States.returning;
	//		}
	//	}
	//},
//
	//detectCollisionsWithCrystals: function() {
	//	var crystals = ig.game.getEntitiesByType(EntityClonercrystal);
	//	for (var i=0; i < crystals.length; i++) {
	//		var crystal = crystals[i];
	//		if(this.touches(crystal))
	//		{
	//			crystal.receiveDamage(20, this);
	//			this.state = this.States.returning;
	//		}
	//	}
	//},

	handleReturningToPlayer: function() {
		if(this.state == this.States.thrown){
			if(this.returnTimer.delta() > 0) {
				if(this.boomerangLevel < 5)
					this.state = this.States.returning;
				else {
					this.state = this.States.returning;
					if (this.vel.x == 0) {
						ig.game.spawnEntity(EntityBoomerang, this.pos.x, this.pos.y, 
							{vel: {x: 600, y: 0}, "boomerangLevel":4, "boomerangReturnTime":0.1});
						ig.game.spawnEntity(EntityBoomerang, this.pos.x, this.pos.y, 
							{vel: {x: -600, y: 0}, "boomerangLevel":4, "boomerangReturnTime":0.1});
					} else {
						ig.game.spawnEntity(EntityBoomerang, this.pos.x, this.pos.y, 
							{vel: {x: 0, y: 600}, "boomerangLevel":4, "boomerangReturnTime":0.1});
						ig.game.spawnEntity(EntityBoomerang, this.pos.x, this.pos.y, 
							{vel: {x: 0, y: -600}, "boomerangLevel":4, "boomerangReturnTime":0.1});
					}
					this.kill();
				}
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