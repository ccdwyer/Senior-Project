ig.module(
	'game.director.player-controller'
)
.requires(
	'impact.impact'
)
.defines(function(){

ig.PlayerController = ig.Class.extend({

	boomerangLevel: -1,
	swordLevel: 0,
	firefistLevel: -1,
	bowLevel: -1,
	grapplinghookLevel: -1,
	magicwandLevel: -1,
	magiccloakLevel: -1,
	keyCount: 0,
	potionCount: 5,
	score: 0,
	coinCount: 10000,
	currentLife: 1000,
	primary: 'sword',
	secondary: '',
	pos: {x: 200, y: 200},
	destination: {x: 200, y: 200},
	
	playerCharacter: null,


	init: function(){
	  
	},

	addPlayerEntity: function(playerEntity){
		this.playerCharacter = playerEntity;
		this.playerCharacter.setBoomerangLevel(this.boomerangLevel);
		this.playerCharacter.setSwordLevel(this.swordLevel);
		this.playerCharacter.setFirefistLevel(this.firefistLevel);
		this.playerCharacter.setBowLevel(this.bowLevel);
		this.playerCharacter.setGrapplinghookLevel(this.grapplinghookLevel);
		this.playerCharacter.setMagicwandLevel(this.magicwandLevel);
		this.playerCharacter.setMagiccloakLevel(this.magiccloakLevel);
		this.playerCharacter.setHealth(this.currentLife);
		this.playerCharacter.setPosition(this.pos.x, this.pos.y);
		this.playerCharacter.setKeyCount(this.keyCount);
		this.playerCharacter.setCoinCount(this.coinCount);
		this.playerCharacter.setPrimary(this.primary);
		this.playerCharacter.setSecondary(this.secondary);
		this.playerCharacter.potionCount = this.potionCount;
	},

	storeSettings: function() {
		this.currentLife = this.playerCharacter.getHealth();
		this.boomerangLevel = this.playerCharacter.getBoomerangLevel();
		this.swordLevel = this.playerCharacter.getSwordLevel();
		this.firefistLevel = this.playerCharacter.getFirefistLevel();
		this.bowLevel = this.playerCharacter.getBowLevel();
		this.grapplinghookLevel = this.playerCharacter.getGrapplinghookLevel();
		this.magicwandLevel = this.playerCharacter.getMagicwandLevel();
		this.magiccloakLevel = this.playerCharacter.getMagiccloakLevel();
		this.keyCount = this.playerCharacter.getKeyCount();
		this.coinCount = this.playerCharacter.getCoinCount();
		this.primary = this.playerCharacter.getPrimary();
		this.secondary = this.playerCharacter.getSecondary();
		this.potionCount = this.playerCharacter.potionCount;
	},

	increaseScore: function(amount) {
		this.score += amount;
	},

	setPosition: function(position) {
		this.pos.x = position.x;
		this.pos.y = position.y;
	},

	getScore: function(){
		return(this.score);
	}
  
});

});