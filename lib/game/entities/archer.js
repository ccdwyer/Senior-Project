ig.module(
	'game.entities.archer'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityArcher = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 32, y: 48},
	health: 100,
	arenaMode: false,
	multiplier: 1.0,

	animSheet: new ig.AnimationSheet( 'media/archer.png', 32, 48),

	init: function(x, y, settings) {
		this.parent( x, y, settings );
		this.addAnimations();
		this.shotTimer = new ig.Timer(2);
		this.keyCount = 0;
		this.inGame = true;
		this.keyList = [];
		this.invulnerableTimer = new ig.Timer(0);
		this.knockbackTimer = new ig.Timer(0);
		this.knockbackAngle = 0;
		this.applyFloorMultiplier = !settings.multiplier;

	},

	ready: function() {
		if(this.applyFloorMultiplier) {
			this.multiplier += 0.075 * ig.game.myDirector.currentLevel;
		}
		this.health = Math.floor(this.health * this.multiplier);
	},

	addAnimations: function() {
		// idle animation
		this.addAnim('idle', 1, [0] );
		this.addAnim('idleUp', 1, [12]);
		this.addAnim('idleLeft', 1, [4]);
		this.addAnim('idleRight', 1, [8]);

		// four way directional animation
		this.addAnim('down', 0.2, [0,1,2,3] );
		this.addAnim('up', 0.2, [12,13,14,15] );
		this.addAnim('left', 0.2, [4,5,6,7] );
		this.addAnim('right', 0.2, [8,9,10,11] );

		// diagonal direction animation
		this.addAnim('downRight', 0.2, [8,9,10,11]);
		this.addAnim('downLeft', 0.2, [4,5,6,7]);
		this.addAnim('upRight', 0.2, [8,9,10,11]);
		this.addAnim('upLeft', 0.2, [4,5,6,7]);
	},

	update: function() {
		if (this.inGame) {
			this.parent();
			this.shotTimer.unpause();
			if(ig.game.getEntitiesByType(EntityPlayer).length > 0) {
				var player = ig.game.getEntitiesByType(EntityPlayer)[0];
			
				//Handles movement
				this.handleMovement(player);

				this.handleArrowShooting(player);
			}
			else {
				this.vel.x = 0;
				this.vel.y = 0;
				this.currentAnim = this.anims.idle;
			}
			this.detectCollisionsWithKeys();
		} else {
			this.shotTimer.pause();
		}
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	detectCollisionsWithKeys: function() {
		var keys = ig.game.getEntitiesByType(EntityKey);
		for (i=0; i < keys.length; i++) {
			var key = keys[i];
			if(this.touches(key))
			{
				this.keyList.push(key.name);
				key.kill();
				this.keyCount++;
			}
		}
	},

	receiveDamage: function(amount, from) {
		if(this.invulnerableTimer.delta() > 0) {
			this.parent(amount, from);
			this.invulnerableTimer.set(0.2);
			this.knockbackTimer.set(0.2);
			this.knockbackAngle = this.angleTo(ig.game.playerController.playerCharacter) + Math.PI;
		}
	},

	handleMovement: function(player) {
		if (this.knockbackTimer.delta() < 0) {
			this.vel.x = Math.cos(this.knockbackAngle) * 200;
			this.vel.y = Math.sin(this.knockbackAngle) * 200;
		} else {
			if(this.arenaMode && this.distanceTo(player) > 100) {
				this.vel.x = 1 * Math.cos(this.angleTo(player)) * 70;
				this.vel.y = 1 * Math.sin(this.angleTo(player)) * 70;
				if(this.vel.y < 0 && this.vel.x < 0)
					this.currentAnim = this.anims.upLeft;
				else if(this.vel.y < 0 && this.vel.x > 0)
					this.currentAnim = this.anims.upRight;
				else if(this.vel.y > 0 && this.vel.x < 0)
					this.currentAnim = this.anims.downLeft;
				else if(this.vel.y > 0 && this.vel.x > 0)
					this.currentAnim = this.anims.downRight;
				else if(this.vel.y < 0 && this.vel.x == 0)
					this.currentAnim = this.anims.up;
				else if(this.vel.y > 0 && this.vel.x == 0)
					this.currentAnim = this.anims.down;
				else if(this.vel.y == 0 && this.vel.x < 0)
					this.currentAnim = this.anims.left;
				else if(this.vel.y == 0 && this.vel.x > 0)
					this.currentAnim = this.anims.right;
			} else if(this.distanceTo(player) < 100) {
				this.vel.x = -1 * Math.cos(this.angleTo(player)) * 70;
				this.vel.y = -1 * Math.sin(this.angleTo(player)) * 70;
				if(this.vel.y < 0 && this.vel.x < 0)
					this.currentAnim = this.anims.upLeft;
				else if(this.vel.y < 0 && this.vel.x > 0)
					this.currentAnim = this.anims.upRight;
				else if(this.vel.y > 0 && this.vel.x < 0)
					this.currentAnim = this.anims.downLeft;
				else if(this.vel.y > 0 && this.vel.x > 0)
					this.currentAnim = this.anims.downRight;
				else if(this.vel.y < 0 && this.vel.x == 0)
					this.currentAnim = this.anims.up;
				else if(this.vel.y > 0 && this.vel.x == 0)
					this.currentAnim = this.anims.down;
				else if(this.vel.y == 0 && this.vel.x < 0)
					this.currentAnim = this.anims.left;
				else if(this.vel.y == 0 && this.vel.x > 0)
					this.currentAnim = this.anims.right;
			}
			else {
				this.vel.x = 0;
				this.vel.y = 0;
				this.currentAnim = this.anims.idle;
			}
		}
	},

	handleArrowShooting: function(player) {
		var angleToPlayer = this.angleTo(player);
		if(this.shotTimer.delta() > 0) {
			ig.game.spawnEntity(EntityArrow, this.pos.x, this.pos.y+30, 
				{vel: {x: Math.cos(angleToPlayer) * 300, 
					   y: Math.sin(angleToPlayer) * 300}});
			this.shotTimer.set(10/this.multiplier);
		}
	},

	kill: function() {
		ig.game.normalEnemyItemDrop(this.pos.x, this.pos.y);
		if(this.arenaMode && ig.game.arenaController.arenaIsActive) ig.game.arenaController.addKill();
		this.parent();
		for(i = 0; i < this.keyCount; i++)
			ig.game.spawnEntity(EntityKey, this.pos.x + 10, this.pos.y + 10, {'name': this.keyList[i]});
	}

});

});