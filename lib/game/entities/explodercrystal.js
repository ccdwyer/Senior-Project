ig.module(
	'game.entities.explodercrystal'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityExplodercrystal = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 32, y: 32},
	health: 500,
	arenaMode: false,
	multiplier: 1.0,

	animSheet: new ig.AnimationSheet( 'media/crystalpink.png', 32, 32),

	init: function(x, y, settings) {
		this.addAnimations();
		this.addSpellTimers();
		this.parent( x, y, settings );
		this.inGame = true;
		this.vel.x = 0;
		this.vel.y = 0;
		this.isActivated = false;
		this.invulnerableTimer = new ig.Timer(0);

		if(!settings.multiplier) {
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
		this.fireballTimer = new ig.Timer(8);
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			var player = ig.game.playerController.playerCharacter;
			if(this.distanceTo(player) < 300)
				this.isActivated = true;

			if(this.isActivated) {
				this.fireballTimer.unpause();
				this.handleSpellCasting(player);
				this.handleMovement(player);
			} else {
				this.fireballTimer.pause();
			}
		} else {
			this.fireballTimer.pause();
		}
	},

	handleMovement: function(player) {
		
		if(this.distanceTo(player) < 400) {
			this.vel.x = 1 * Math.cos(this.angleTo(player)) * 70;
			this.vel.y = 1 * Math.sin(this.angleTo(player)) * 70;
		}
		else {
			this.vel.x = 0;
			this.vel.y = 0;
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
	},

	handleFireballCasting: function(player) {
		if(this.fireballTimer.delta() > 0 && this.distanceTo(player) < 500) {
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
				{vel: {x: Math.cos(this.angleTo(player)) * 140, 
					   y: Math.sin(this.angleTo(player)) * 140}});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
				{vel: {x: 70, 
					   y: 0}});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
				{vel: {x: -70, 
					   y: 0}});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
				{vel: {x: 0, 
					   y: 70}});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
				{vel: {x: 0, 
					   y: -70}});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
				{vel: {x: 35, 
					   y: 35}});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
				{vel: {x: -35, 
					   y: 35}});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
				{vel: {x: 35, 
					   y: -35}});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
				{vel: {x: -35, 
					   y: -35}});
			this.fireballTimer.set(1 + Math.random()*7);

		}
	},

	handleMovementTrace: function( res ) {

	    // Continue resolving the collision as normal
	    this.parent(res); 
	},

	kill: function() {
		ig.game.normalEnemyItemDrop(this.pos.x, this.pos.y);
		
		this.parent();
	}

});

});