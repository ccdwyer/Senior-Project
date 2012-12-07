ig.module(
	'game.entities.energybombardmenttarget'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityEnergybombardmenttarget = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	hasAimed: false,
	alternateMode: false,

	size: {x: 15, y: 15},
	health: 100,

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		if(!this.alternateMode)
			this.selfDestructTimer = new ig.Timer(10);
		else
			this.selfDestructTimer = new ig.Timer(5)
		this.maxVel.x = 1000;
		this.maxVel.y = 1000;
		this.damageAmount = 50;
		this.inGame = true;
		if(!this.alternateMode) {
			this.pos.x = (this.pos.x + ig.game.playerController.playerCharacter.pos.x)/2;
			this.pos.y = (this.pos.y + ig.game.playerController.playerCharacter.pos.y)/2;
		}
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
				ig.game.explosionSound.play();
				if(!this.alternateMode)
					ig.game.spawnEntity(EntityEnergybombardment, this.pos.x+4, this.pos.y+4);
				else
					ig.game.spawnEntity(EntityEnergybombardment, this.pos.x+4, this.pos.y+4, {"damage":200});
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
	}

});

});