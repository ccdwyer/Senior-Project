ig.module(
	'game.director.chest-controller'
)
.requires(
	'impact.impact'
)
.defines(function(){

ig.ChestController = ig.Class.extend({

	init: function(){
		this.openedChests = {};
		this.openedChestsList = [];
	},

	addChestEntityToOpenedList: function(chestName){
		this.openedChests[chestName] = true;
		this.openedChestsList.push(chestName);
	},

	isChestInOpenedList: function(chestName){
		if(this.openedChests[chestName])
			return true;
		else
			return false;
	}
  
});

});