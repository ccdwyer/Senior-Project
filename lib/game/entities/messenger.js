ig.module(
	'game.entities.messenger'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityMessenger = ig.Entity.extend({

	size: {x:16, y:16},
	target: {},
	checkAgainst: ig.Entity.TYPE.A,
	destination: {x:1, y:1},
	message: '',

	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 255, 0, 0.7)',

	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.inGame = true;
	},

	check: function(other) {
		if(other instanceof EntityPlayer) {
			ig.game.addMessage(this.message);
			this.kill();
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