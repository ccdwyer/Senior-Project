ig.module(
	'game.entities.downFloorTrigger'
)
.requires(
	'impact.entity',
	'plugins.director.director'
)
.defines(function(){

EntityDownFloorTrigger = ig.Entity.extend({

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
		this.destination.x = settings.destx || this.pos.x + 10;
		this.destination.y = settings.desty || this.pos.y + 50; 
	},

	check: function(other) {
		if(other instanceof EntityPlayer) {
			other.updateController();
			ig.game.playerController.storeSettings();
			ig.game.playerController.setPosition(this.destination);
			ig.game.myDirector.previousLevel();
			ig.music.play('title');
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