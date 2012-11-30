ig.module(
	'game.entities.clonercrystal'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityClonercrystal = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 32, y: 32},
	health: 150,
	arenaMode: false,
	multiplier: 1.0,

	animSheet: new ig.AnimationSheet( 'media/crystalorange.png', 32, 32),

	init: function(x, y, settings) {
		this.addAnimations();
		this.addSpellTimers();
		this.parent( x, y, settings );
		this.inGame = true;
		this.vel.x = 0;
		this.vel.y = 0;
		this.invulnerableTimer = new ig.Timer(0);

		this.applyFloorMultiplier = !settings.multiplier;
	},

	ready: function() {
		if(this.applyFloorMultiplier) {
			this.multiplier += 0.075 * ig.game.myDirector.currentLevel;
		}
		this.health = Math.floor(this.health * this.multiplier);
	},

	addAnimations: function() {
		// idle animation
		this.addAnim('idle', 0.2, [0,1,2,3,4,5,6,7] );

		this.currentAnim = this.anims.idle;
	},

	addSpellTimers: function() {
		this.fireballTimer = new ig.Timer(5);
		this.cloneTimer = new ig.Timer(15);
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.fireballTimer.unpause();
			this.cloneTimer.unpause();
			
			if(ig.game.getEntitiesByType(EntityPlayer).length > 0) {
				var player = ig.game.getEntitiesByType(EntityPlayer)[0];
			
				this.handleSpellCasting(player);
				
			}
		} else {
			this.fireballTimer.pause();
			this.cloneTimer.pause();
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	receiveDamage: function(amount, from) {
		if(this.invulnerableTimer.delta() > 0) {
			this.parent(amount, from);
			this.invulnerableTimer.set(0.2);
		}
	},

	handleSpellCasting: function(player) {
		this.handleFireballCasting(player);
		this.handleCloneCasting(player);
	},

	handleFireballCasting: function(player) {
		if(this.fireballTimer.delta() > 0 && this.distanceTo(player) < 500) {
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
				{vel: {x: Math.cos(this.angleTo(player)) * 70, 
					   y: Math.sin(this.angleTo(player)) * 70}});
			this.fireballTimer.set(1 + Math.random()*5);
		}
	},

	handleCloneCasting: function(player) {
		if(this.distanceTo(player) < 500 && this.cloneTimer.delta() > 0) {
			ig.game.spawnEntity(EntityClonercrystal, this.pos.x + 75 - Math.random()*150, this.pos.y + 75 - Math.random()*150);
			this.cloneTimer.set(30);
		}
	},

	handleMovementTrace: function( res ) {
	    if( res.collision.y || res.collision.x ) {
	        this.kill();
	    }

	    // Continue resolving the collision as normal
	    this.parent(res); 
	},

	kill: function() {
		ig.game.normalEnemyItemDrop(this.pos.x, this.pos.y);
		
		this.parent();
	}

});

});