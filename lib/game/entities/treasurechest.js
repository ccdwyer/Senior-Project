ig.module(
	'game.entities.treasurechest'
)
.requires(
	'impact.entity',
	'plugins.director.director'

)
.defines(function(){

EntityTreasurechest = ig.Entity.extend({

	size: {x:32, y:32},
	collides: ig.Entity.COLLIDES.FIXED,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	animSheet: new ig.AnimationSheet( 'media/chest.png', 32, 32),
	hasFirefist: false,
	hasBoomerang: false,
	hasBow: false,
	hasGrapplinghook: false,
	hasMagiccloak: false,
	hasMagicwand: false,


	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.addAnim('closed', 1, [0] );
		this.addAnim('opened', 1, [1] );
		this.States = {"closed"  : 0,
						"opened" : 1};
		this.state = this.States.closed;
		this.currentAnim = this.anims.closed;
		this.inGame = true;
		this.checkedIfOpened = false;
	},

	check: function(other) {

	},

	receiveDamage: function(amount, from) {
		if(((from instanceof EntitySword) || (from instanceof EntityFist)) && this.state == this.States.closed) {
			this.state = this.States.opened;
			this.currentAnim = this.anims.opened;
			var player = ig.game.playerController.playerCharacter;
			if(this.hasFirefist && player.getFirefistLevel() == -1) {
				player.setFirefistLevel(0);
				ig.game.addMessage("YOU GOT THE FIREFIST!");
			}
			if(this.hasBoomerang && player.getBoomerangLevel() == -1) {
				player.setBoomerangLevel(0);
				ig.game.addMessage("YOU GOT THE BOOMERANG!");
				ig.game.addMessage("Use your secondary weapons with the F key.");
			}
			if(this.hasBow && player.getBowLevel() == -1) {
				player.setBowLevel(0);
				ig.game.addMessage("YOU GOT THE BOW!");
			}
			if(this.hasGrapplinghook && player.getGrapplinghookLevel() == -1) {
				player.setGrapplinghookLevel(0);
				ig.game.addMessage("YOU GOT THE GRAPPLING HOOK!");
			}
			if(this.hasMagiccloak && player.getMagiccloakLevel() == -1) {
				player.setMagiccloakLevel(0);
				ig.game.addMessage("YOU GOT THE MAGIC CLOAK!");
			}
			if(this.hasMagicwand && player.getMagicwandLevel() == -1) {
				player.setMagicwandLevel(0);
				ig.game.addMessage("YOU GOT THE MAGIC WAND!");
			}
			var coinCount = Math.floor(Math.random() * 500);
			var potionCount = 0;
			if (player.potionCount < 10)
				potionCount = Math.floor(Math.random() * 3);
			player.addCoins(coinCount);
			player.potionCount += potionCount;

			if (coinCount > 0 && potionCount > 0) {
				ig.game.addMessage("You found some coins and potions.");
			} else if (coinCount > 0) {
				ig.game.addMessage("You found some coins.");
			} else if (potionCount > 0) {
				ig.game.addMessage("You got some potions.");
			} else {
				ig.game.addMessage("You found nothing, unlucky bastard. 1/2500 chance");
			}
			ig.game.chestController.addChestEntityToOpenedList(this.name);
		}
	},

	update: function() {
		if(!this.checkedIfOpened)
		{
			if(ig.game.chestController.isChestInOpenedList(this.name)) {
				this.state = this.States.opened;
				this.currentAnim = this.anims.opened;
				this.checkedIfOpened = true;
			}
		}
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