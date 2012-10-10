ig.module(
	'game.director.door-controller'
)
.requires(
	'impact.impact'
)
.defines(function(){

ig.DoorController = ig.Class.extend({

	init: function(){
		this.unlockedDoors = {};
	},

	addDoorEntityToUnlockedList: function(doorName){
		this.unlockedDoors[doorName] = true;
	},

	isDoorInUnlockedList: function(doorName){
		if(this.unlockedDoors[doorName])
			return true;
		else
			return false;
	}
  
});

});