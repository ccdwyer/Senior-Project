ig.module(
	'game.entities.arcanebutton'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityArcanebutton = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 48, y: 48},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/arcanebutton.png', 48, 48),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.addAnim('exists', 1, [0] );
		this.currentAnim = this.anims.exists;
		this.inGame = true;

		this.zIndex = -1000;
	},

	update: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	check: function(other) {
		if (other instanceof EntityArcaneblock) {
			var arcanedoors = ig.game.getEntitiesByType(EntityArcanedoor);
			for (var i=0; i < arcanedoors.length; i++) {
				if (arcanedoors[i].name == this.name) {
					arcanedoors[i].openDoor();
				}
			}
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	}

});

});