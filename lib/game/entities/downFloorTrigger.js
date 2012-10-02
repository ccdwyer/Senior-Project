ig.module(
	'game.entities.downFloorTrigger'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityDownFloorTrigger = ig.Entity.extend({

	size: {x:16, y:16},
	target: {},
	checkAgainst: ig.Entity.TYPE.A,

	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 255, 0, 0.7)',

	check: function(other) {
		if(other instanceof EntityPlayer) {
			ig.game.myDirector.previousLevel();
		}
	}


});

});