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
			}
			if(this.hasBoomerang && player.getBoomerangLevel() == -1) {
				player.setBoomerangLevel(0);
			}
			if(this.hasBow && player.getBowLevel() == -1) {
				player.setBowLevel(0);
			}
			if(this.hasGrapplinghook && player.getGrapplinghookLevel() == -1) {
				player.setGrapplinghookLevel(0);
			}
			if(this.hasMagiccloak && player.getMagiccloakLevel() == -1) {
				player.setMagiccloakLevel(0);
			}
			if(this.hasMagicwand && player.getMagicwandLevel() == -1) {
				player.setMagicwandLevel(0);
			}
			player.addCoins(Math.floor(Math.random() * 500));
		}
	},

	update: function() {
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