ig.module(
	'game.entities.peg'
)
.requires(
	'impact.entity',
	'plugins.director.director'

)
.defines(function(){

EntityPeg = ig.Entity.extend({

	size: {x:32, y:32},
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	animSheet: new ig.AnimationSheet( 'media/peg.png', 32, 32),


	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.addAnim('idle', 1, [0] );
		this.currentAnim = this.anims.idle;
		this.inGame = true;
	},

	check: function(other) {
		//if(other instanceof EntityGrapplinghook) {
//
		//	other.kill();
		//	ig.game.playerController.playerCharacter.setPosition(this.pos.x, this.pos.y);
		//}
		if(other instanceof EntityPlayer) {
			other.stopGrappling();
		}
	},

	update: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	}

});

});