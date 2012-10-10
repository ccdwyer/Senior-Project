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
	},

	addKeyEntityToPickedUpList: function(keyName){
		this.pickedUpKeys[keyName] = true;
	},

	isKeyInPickedUpList: function(keyName){
		if(this.pickedUpKeys[keyName])
			return true;
		else
			return false;
	}
  
});

});