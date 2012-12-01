ig.module(
	'game.entities.arenabutton'
)
.requires(
	'impact.entity',
	'plugins.director.director'

)
.defines(function(){

EntityArenabutton = ig.Entity.extend({

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
	},

	ready: function() {
		this.thePlayer = ig.game.playerController.playerCharacter;
	},

	pushButton: function() {
		this.state = this.States.pressed;
		this.currentAnim = this.anims.pressed;
		ig.game.arenaController.startNewArenaMatch();
	},

	unpushButton: function() {
		this.currentAnim = this.anims.unpressed;
		this.state = this.States.unpressed;
	},

	update: function() {
		if(this.pressMe) {
			this.pushButton();
		}
		this.currentAnim.angle = Math.PI * this.piToTurn;
		if (this.inGame && this.state == this.States.unpressed) {
			this.parent();
			this.detectCollisions();
		}

	},

	detectCollisions: function() {
		if(this.state == this.States.unpressed) {
			this.detectCollisionsWithSword();
			this.detectCollisionsWithFist();
			this.detectCollisionsWithBoomerang();
			this.detectCollisionsWithPlayerarrow();
		}
		
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
				arrow.kill();
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