ig.module(
	'game.director.arena-controller'
)
.requires(
	'impact.impact'
)
.defines(function(){

ig.ArenaController = ig.Class.extend({

	currentScore: 0,
	arenaIsActive: false,	


	init: function(){
	  
	},

	startNewArenaMatch: function(){
		this.currentScore = 0;
		this.arenaIsActive = true;
	},

	endArenaMatch: function() {
		//Set top score
		var enemies = [];
		this.arenaIsActive = false;
		enemies = enemies.concat(ig.game.getEntitiesByType(EntityGoblin));
		enemies = enemies.concat(ig.game.getEntitiesByType(EntityMage));
		enemies = enemies.concat(ig.game.getEntitiesByType(EntityArcher));
		enemies = enemies.concat(ig.game.getEntitiesByType(EntityExplodercrystal));
		enemies = enemies.concat(ig.game.getEntitiesByType(EntityClonercrystal));
		enemies = enemies.concat(ig.game.getEntitiesByType(EntityRogue));
		enemies = enemies.concat(ig.game.getEntitiesByType(EntitySlimer));

		for (var i=0; i < enemies.length; i++) {
			enemies[i].kill();
		}

		ig.game.playerController.playerCharacter.healBy(2000);
	},

	addKill: function () {
		this.currentScore++;
	},

  
});

});