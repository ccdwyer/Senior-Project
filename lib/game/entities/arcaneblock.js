ig.module(
	'game.entities.arcaneblock'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityArcaneblock = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.NONE,

	size: {x: 40, y: 40},
	health: 5,

	animSheet: new ig.AnimationSheet( 'media/arcaneblock.png', 40, 40),

	init: function(x, y, settings) {
		// idle animation
		this.parent( x, y, settings );
		this.addAnim('placed', 1, [0] );
		if(settings.level) {
			this.health += 3 * settings.level;
		}
		this.maximumHealth = this.health;
		this.currentAnim = this.anims.placed;
		this.selfdestructTimer = new ig.Timer(10);
		this.invulnerableTimer = new ig.Timer(0);
		this.invulnerableDuration = .2;
		if(settings.level == 5) {
			this.invulnerableTimer = .5;
		}
		this.currentAnim.alpha = .6;
		this.inGame = true;
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.selfdestructTimer.unpause();
			if (this.selfdestructTimer.delta() > 0) {
				this.kill();
			}
		} else {
			this.selfdestructTimer.pause();
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	isAtMaximumHealth: function() {
		return this.health == this.maximumHealth;
	},

	receiveDamage: function(amount, from) {
		if(this.invulnerableTimer.delta() > 0) {
			this.parent(1, from);
			this.invulnerableTimer.set(this.invulnerableDuration);
		}
	}

});

});