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
		ig.game.spawnEntity(EntityArenadoor, 768, 1344);
	},

	endArenaMatch: function() {
		//Set top score
		if(this.currentScore > ig.game.playerController.score) ig.game.playerController.score = this.currentScore;
		var enemies = [];
		this.arenaIsActive = false;
		enemies = enemies.concat(ig.game.getEntitiesByType(EntityGoblin));
		enemies = enemies.concat(ig.game.getEntitiesByType(EntityMage));
		enemies = enemies.concat(ig.game.getEntitiesByType(EntityArcher));
		enemies = enemies.concat(ig.game.getEntitiesByType(EntityExplodercrystal));
		enemies = enemies.concat(ig.game.getEntitiesByType(EntityClonercrystal));
		enemies = enemies.concat(ig.game.getEntitiesByType(EntityRogue));
		enemies = enemies.concat(ig.game.getEntitiesByType(EntitySlimer));
		enemies = enemies.concat(ig.game.getEntitiesByType(EntityArenadoor));

		for (var i=0; i < enemies.length; i++) {
			enemies[i].kill();
		}

		var drops = [];
		drops = drops.concat(ig.game.getEntitiesByType(EntityCoin));
		drops = drops.concat(ig.game.getEntitiesByType(EntityHealthkit));

		for (var i=0; i < drops.length; i++) {
			drops[i].kill();
		}

		ig.game.getEntitiesByType(EntityArenabutton)[0].unpushButton();

		ig.game.playerController.playerCharacter.healBy(2000);

		ig.game.addMessage("You earned " + this.currentScore + " points in the arena");
	},

	addKill: function () {
		this.currentScore++;
	},

  
});

});