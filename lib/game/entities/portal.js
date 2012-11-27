ig.module(
	'game.entities.portal'
)
.requires(
	'impact.entity',
	'plugins.director.director'
)
.defines(function(){

EntityPortal = ig.Entity.extend({

	size: {x: 48, y: 48},
	animSheet: new ig.AnimationSheet( 'media/portal.png', 48, 48),
	target: {},
	checkAgainst: ig.Entity.TYPE.A,
	destination: {x:1, y:1},

	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.addAnim('placed', 0.25, [0,1,2,3,4] );
		this.currentAnim = this.anims.placed;
		this.inGame = true;
	},

	ready: function() {
		if(ig.game.portalController.currentLevel < 2) {
			this.kill();
		}
	},

	check: function(other) {
		if(other instanceof EntityPlayer) {
			ig.game.portalController.teleportPlayer();
		}
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.currentAnim.angle += Math.PI * .5 * ig.system.tick;
		}
	},

});

});