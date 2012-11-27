ig.module(
	'game.entities.portal'
)
.requires(
	'impact.entity',
	'plugins.director.director'
)
.defines(function(){

EntityPortal = ig.Entity.extend({

	size: {x:16, y:16},
	target: {},
	checkAgainst: ig.Entity.TYPE.A,
	destination: {x:1, y:1},

	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 255, 0, 0.7)',

	init: function(x, y, settings) {
		this.parent(x, y, settings);
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
		}
	},

});

});