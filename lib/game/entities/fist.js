ig.module(
	'game.entities.fist'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityFist = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B,

	size: {x: 20, y: 20},
	health: 100,
	_wmDrawBox: true,

	init: function(x, y, settings) {
		this.parent( x, y, settings );
		this.inGame = true;
		this.offset.x = 11;
		this.offset.y = 37;
		this.swingTimer = new ig.Timer(.2);
		this.firefistLevel = settings.firefistLevel;
		if(this.firefistLevel == 5) {
			this.damage = 60;
		}
		else {
			this.damage = 60 + (5 * this.firefistLevel);
		}	
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.swingTimer.unpause();
			if(this.swingTimer.delta() > 0) {
				this.kill();
			}
			this.detectCollisionsWithTreasurechests();
		}
		else {
			this.swingTimer.pause();
		}
	},

	detectCollisionsWithTreasurechests: function() {
		var treasureChests = ig.game.getEntitiesByType(EntityTreasurechest);
		for (var i=0; i < treasureChests.length; i++) {
			var treasureChest = treasureChests[i];
			if(this.touches(treasureChest))
			{
				treasureChest.receiveDamage(1, this);
			}
		}
	},

	draw: function() {
		this.parent();
	},

	check: function(other) {
		if(!(other instanceof EntityPeg)) {
			other.receiveDamage(this.damage, this);
		}
	}

});

});