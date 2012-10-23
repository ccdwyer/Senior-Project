ig.module(
	'game.entities.energyball'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityEnergyball = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 15, y: 15},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/energyball.png', 30, 30),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.global = false;
		this.addAnim('shot', .1, [0,1,2,3,4,5] );
		this.currentAnim = this.anims.shot;
		this.maxVel.x = 300;
		this.maxVel.y = 300;
		this.offset.x = 7;
		this.offset.y = 7;
		this.bounciness = 1;
		this.damageAmount = 200;
		this.hasSetVelocity = false;
		this.inGame = true;
	},

	check: function(other) {
		other.receiveDamage(this.damageAmount, this)
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			if(!this.hasSetVelocity) {
				var angleToPlayer = this.angleTo(ig.game.playerController.playerCharacter);
				this.vel.x = Math.cos(angleToPlayer) * 300; 
				this.vel.y = Math.sin(angleToPlayer) * 300;
				this.hasSetVelocity = true;
			}

		} else {

		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

});

});