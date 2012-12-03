ig.module(
	'game.entities.timebomb'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityTimebomb = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,

	size: {x: 48, y: 48},
	health: 1,
	maxTime: 12,

	animSheet: new ig.AnimationSheet( 'media/timebomb.png', 48, 48),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.addAnim('green', 1, [0] );
		this.addAnim('greenyellow', 1, [1] );
		this.addAnim('yellow', 1, [2] );
		this.addAnim('orange', 1, [3] );
		this.addAnim('red', 1, [4] );
		this.currentAnim = this.anims.green;
		this.explodeTimer = new ig.Timer(this.maxTime);
		this.inGame = true;
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			if (-1 * this.explodeTimer.delta() > this.maxTime * 0.8) {
				this.currentAnim = this.anims.green;
			} else if (-1 * this.explodeTimer.delta() > this.maxTime * 0.6) {
				this.currentAnim = this.anims.greenyellow;
			} else if (-1 * this.explodeTimer.delta() > this.maxTime * 0.4) {
				this.currentAnim = this.anims.yellow;
			} else if (-1 * this.explodeTimer.delta() > this.maxTime * 0.2) {
				this.currentAnim = this.anims.orange;
			} else {
				this.currentAnim = this.anims.red;
			}
			if (this.explodeTimer.delta() > 0) {
				this.kill();
				//spawn explosion
				ig.game.spawnEntity(EntityEnergybombardmenttarget, this.pos.x, this.pos.y, {"alternateMode":true});
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