ig.module(
	'game.entities.swordLR'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntitySwordLR = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B,

	size: {x: 15, y: 40},
	health: 100,

	animSheet: new ig.AnimationSheet( 'media/swordHitBoxLR.png', 60, 60),

	init: function(x, y, settings) {
		this.parent( x, y, settings );
		this.global = false;
		this.inGame = true;
		// will show hit box, should be commented
		//this.addAnim('attack', 1, [0]);
		this.offset.x = 40;
		this.offset.y = 10;
		this.swingTimer = new ig.Timer(.4);
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.swingTimer.unpause();
			if(this.swingTimer.delta() > 0) {
				this.kill();
			}
			this.handleHittingEnemies();
		}
		else {
			this.swingTimer.pause();
		}
	},

	draw: function() {
		this.parent();
	},

	handleHittingEnemies: function() {
		this.detectCollisionsWithMages();
		this.detectCollisionsWithArchers();
		this.detectCollisionsWithSlimers();
		this.detectCollisionsWithGoblins();
		this.detectCollisionsWithCrystals();
	},

	detectCollisionsWithMages: function() {
		var mages = ig.game.getEntitiesByType(EntityMage);
		for (var i=0; i < mages.length; i++) {
			var mage = mages[i];
			if(this.touches(mage))
			{
				mage.receiveDamage(20, this);
				this.kill();
			}
		}
	},

	detectCollisionsWithArchers: function() {
		var archers = ig.game.getEntitiesByType(EntityArcher);
		for (var i=0; i < archers.length; i++) {
			var archer = archers[i];
			if(this.touches(archer))
			{
				archer.receiveDamage(20, this);
				this.kill();
			}
		}
	},

	detectCollisionsWithGoblins: function() {
		var goblins = ig.game.getEntitiesByType(EntityGoblin);
		for (var i=0; i < goblins.length; i++) {
			var goblin = goblins[i];
			if(this.touches(goblin))
			{
				goblin.receiveDamage(20, this);
				this.kill();
			}
		}
	},

	detectCollisionsWithCrystals: function() {
		var crystals = ig.game.getEntitiesByType(EntityClonercrystal);
		for (var i=0; i < crystals.length; i++) {
			var crystal = crystals[i];
			if(this.touches(crystal))
			{
				crystal.receiveDamage(20, this);
				this.kill();
			}
		}
	},

	detectCollisionsWithSlimers: function() {
		var slimers = ig.game.getEntitiesByType(EntitySlimer);
		for (var i=0; i < slimers.length; i++) {
			var slimer = slimers[i];
			if(this.touches(slimer))
			{
				slimer.receiveDamage(20, this);
				this.kill();
			}
		}
	}


});

});