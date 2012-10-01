ig.module(
	'game.entities.arrow'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityArrow = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 20, y: 4},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/arrow.png', 20, 7),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );

		this.addAnim('shot', 1, [0] );
		this.currentAnim = this.anims.shot;
		this.selfDestructTimer = new ig.Timer(15);
		this.maxVel.x = 300;
		this.maxVel.y = 300;
		this.offset.y = 2;

		if(ig.game.getEntitiesByType(EntityPlayer).length > 0) {
			var player = ig.game.getEntitiesByType(EntityPlayer)[0];

			this.currentAnim.angle = this.angleTo(player);
		}

	},

	update: function() {
		this.parent();

		if(this.selfDestructTimer.delta() > 0) {
			this.kill();
		}
		if(this.pos.x == this.last.x && this.pos.y == this.last.y) {
			this.kill();
		}


	}

});

});