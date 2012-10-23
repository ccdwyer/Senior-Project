ig.module(
	'game.entities.energybombardmenttarget'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityEnergybombardmenttarget = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	hasAimed: false,

	size: {x: 30, y: 30},
	health: 100,

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.selfDestructTimer = new ig.Timer(10);
		this.maxVel.x = 1000;
		this.maxVel.y = 1000;
		this.damageAmount = 100;
		this.inGame = true;
		this.pos.x = (this.pos.x + ig.game.playerController.playerCharacter.pos.x)/2;
		this.pos.y = (this.pos.y + ig.game.playerController.playerCharacter.pos.y)/2;
		this.bombardmentSpread = 18;
		this.bombardmentCounter = 0;
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.selfDestructTimer.unpause();
			if(this.selfDestructTimer.delta() > 0) {
				this.kill();
			}
			this.vel.x = 1 * Math.cos(this.angleTo(ig.game.playerController.playerCharacter)) * 150;
			this.vel.y = 1 * Math.sin(this.angleTo(ig.game.playerController.playerCharacter)) * 150;
			if(this.bombardmentCounter%this.bombardmentSpread == 0) {
				this.bombardmentCounter = 0;
				ig.game.spawnEntity(EntityEnergybombardment, this.pos.x+4, this.pos.y+4);
			}
			this.bombardmentCounter++;
		} else {
			this.selfDestructTimer.pause();
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	handleMovementTrace: function( res ) {
    	// This completely ignores the trace result (res) and always
    	// moves the entity according to its velocity
    	this.pos.x += this.vel.x * ig.system.tick;
    	this.pos.y += this.vel.y * ig.system.tick;
	}

});

});