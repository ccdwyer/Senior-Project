ig.module(
	'game.director.portal-controller'
)
.requires(
	'impact.impact'
)
.defines(function(){

ig.PortalController = ig.Class.extend({

	destination: {x: 200, y: 200},
	currentLevel: -1,	


	init: function(){
	  
	},

	setDestination: function(level, destinationx, destinationy){
		if(level > this.currentLevel) {
			this.destination.x = destinationx;
			this.destination.y = destinationy;
			this.currentLevel = level;
		}
	},

	teleportPlayer: function() {
		ig.game.playerController.playerCharacter.updateController();
		ig.game.playerController.storeSettings();
		ig.game.playerController.setPosition(this.destination);
		ig.music.play('title');
		ig.game.myDirector.loadLevel(this.currentLevel);
	},

  
});

});