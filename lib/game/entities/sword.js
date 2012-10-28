ig.module(
	'game.entities.sword'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntitySword = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B,

	size: {x: 40, y: 20},
	health: 100,
	_wmDrawBox: true,

	init: function(x, y, settings) {
		this.parent( x, y, settings );
		this.inGame = true;
		this.offset.x = 10;
		this.offset.y = 40;
		this.swingTimer = new ig.Timer(.2);
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

	draw: function() {
		this.parent();
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

	check: function(other) {
		if(!(other instanceof EntityPeg)) {
			other.receiveDamage(50, this);
		}
	}


});

});