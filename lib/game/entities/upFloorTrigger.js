ig.module(
	'game.entities.upFloorTrigger'
)
.requires(
	'impact.entity',
	'plugins.director.director'

)
.defines(function(){

EntityUpFloorTrigger = ig.Entity.extend({

	size: {x:16, y:16},
	target: {},
	checkAgainst: ig.Entity.TYPE.A,

	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 255, 0, 0.7)',

	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.global = false;
		this.inGame = true;
	},

	check: function(other) {
		if(other instanceof EntityPlayer) {
			ig.game.playerController.storeSettings();
			ig.game.myDirector.nextLevel();
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