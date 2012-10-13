ig.module(
	'game.director.key-controller'
)
.requires(
	'impact.impact'
)
.defines(function(){

ig.KeyController = ig.Class.extend({

	init: function(){
		this.pickedUpKeys = {};
		this.pickedUpKeysList = [];
	},

	addKeyEntityToPickedUpList: function(keyName){
		this.pickedUpKeys[keyName] = true;
		this.pickedUpKeysList.push(keyName);
	},

	isKeyInPickedUpList: function(keyName){
		if(this.pickedUpKeys[keyName])
			return true;
		else
			return false;
	}
  
});

});