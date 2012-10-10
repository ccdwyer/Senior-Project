ig.module(
	'game.entities.door'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityDoor = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.FIXED,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 64, y: 64},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/door.png', 64, 64),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.global = false;
		this.addAnim('dropped', 1, [0] );
		this.currentAnim = this.anims.dropped;
		this.inGame = true;
		this.checkedIfUnlocked = false;
	},

	update: function() {
		if(!this.checkedIfUnlocked) {
			this.wasUnlocked = ig.game.doorController.isDoorInUnlockedList(this.name);
			if(this.wasUnlocked) {
				this.kill();
			}
			this.checkedIfUnlocked = true;
		} else {
			if(this.inGame) {
				this.parent();
				if(ig.game.getEntitiesByType(EntityPlayer).length > 0) {
					var player = ig.game.getEntitiesByType(EntityPlayer)[0];
					if(player.getKeyCount() >= 1)
					{
						if (this.distanceTo(player) < 45)
						{
							player.useKeyToRemoveDoor();
							ig.game.doorController.addDoorEntityToUnlockedList(this.name);
							this.kill();
						}
					}
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