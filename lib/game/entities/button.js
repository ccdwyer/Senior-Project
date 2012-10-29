ig.module(
	'game.entities.button'
)
.requires(
	'impact.entity',
	'plugins.director.director'

)
.defines(function(){

EntityButton = ig.Entity.extend({

	size: {x:32, y:32},
	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	animSheet: new ig.AnimationSheet( 'media/button.png', 32, 32),


	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.addAnim('unpressed', 1, [0] );
		this.addAnim('pressed', 1, [1] );
		this.States = {"unpressed"  : 0,
						"pressed" : 1};
		this.state = this.States.unpressed;
		this.currentAnim = this.anims.unpressed;
		this.inGame = true;
		this.firstUpdate = true;
		this.pressMe = false;
	},

	

	pushButton: function() {
		this.state = this.States.pressed;
		this.currentAnim = this.anims.pressed;
		ig.game.doorController.addDoorEntityToUnlockedList(this.name);
		var doors = ig.game.getEntitiesByType(EntityDoor);
		for (i=0; i < doors.length; i++) {
			doors[i].checkedIfUnlocked = false;
		}
	},

	update: function() {
		if(this.firstUpdate) {
			this.thePlayer = ig.game.playerController.playerCharacter;
			this.checkIfPressed();
			this.firstUpdate = false;
		}
		if(this.pressMe) {
			this.pushButton();
		}
		this.currentAnim.angle = Math.PI * this.piToTurn;
		if (this.inGame && this.state == this.States.unpressed) {
			this.parent();
			this.detectCollisions();
		}

	},

	checkIfPressed: function() {
		if(ig.game.doorController.isDoorInUnlockedList(this.name)) {
			this.state = this.States.pressed;
			this.currentAnim = this.anims.pressed;
		}
	},

	detectCollisions: function() {
		this.detectCollisionsWithSword();
		this.detectCollisionsWithFist();
		this.detectCollisionsWithBoomerang();
		this.detectCollisionsWithPlayerarrow();
	},

	detectCollisionsWithSword: function() {
		var swords = ig.game.getEntitiesByType(EntitySword);
		for (var i=0; i < swords.length; i++) {
			var sword = swords[i];
			if(this.touches(sword))
			{
				this.pushButton();
			}
		}
	},

	detectCollisionsWithFist: function() {
		var fists = ig.game.getEntitiesByType(EntityFist);
		for (var i=0; i < fists.length; i++) {
			var fist = fists[i];
			if(this.touches(fist))
			{
				this.pushButton();
			}
		}
	},

	detectCollisionsWithBoomerang: function() {
		var boomerangs = ig.game.getEntitiesByType(EntityBoomerang);
		for (var i=0; i < boomerangs.length; i++) {
			var boomerang = boomerangs[i];
			if(this.touches(boomerang))
			{
				boomerang.state = boomerang.States.returning;
				this.pushButton();
			}
		}
	},

	detectCollisionsWithPlayerarrow: function() {
		var arrows = ig.game.getEntitiesByType(EntityPlayerarrow);
		for (var i=0; i < arrows.length; i++) {
			var arrow = arrows[i];
			if(this.touches(arrow))
			{
				mage.kill();
				this.pushButton();
			}
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	}

});

});