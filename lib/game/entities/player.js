ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityPlayer = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.B,

	size: {x: 24, y: 22},
	health: 1000,

	animSheet: new ig.AnimationSheet( 'media/player.png', 36, 36),

	init: function(x, y, settings) {

		this.parent( x, y, settings );
		
		this.setAnimations();
		this.setTimersAndCooldowns();
		
		this.inGame = true;
		this.offset.x = 6;
		this.offset.y = 12;
		this.keyCount = 0;
		this.global = true;

		this.setItemLevels();
		
		this.font = new ig.Font( 'media/plainfont.png' );
		this.addedToController = false;
	},

	setTimersAndCooldowns: function() {
		this.invulnerableTimer = new ig.Timer(0);
		this.invulnerableDuration = 1;
		this.globalCooldown = new ig.Timer(0);
		this.attackCooldown = new ig.Timer(0);
	},

	setItemLevels: function() {
		this.boomerangLevel = 0;
		this.swordLevel = 0;
		this.firefistLevel = 0;
		this.bowLevel = 0;
		this.grapplinghookLevel = 0;
		this.magicwandLevel = 0;
		this.magiccloakLevel = 0;
	},

	setAnimations: function() {
		// idle animation
		this.addAnim('idle', 1, [0] );
		this.addAnim('idleUp', 1, [12]);
		this.addAnim('idleLeft', 1, [6]);
		this.addAnim('idleRight', 1, [18]);

		// four way directional animation
		this.addAnim('down', 0.2, [1,0,2,0] );
		this.addAnim('up', 0.2, [13,12,14,12] );
		this.addAnim('left', 0.2, [7,6,8,6] );
		this.addAnim('right', 0.2, [19,18,20,18] );

		// diagonal direction animation
		this.addAnim('downRight', 0.2, [22,21,23,21]);
		this.addAnim('downLeft', 0.2, [4,3,5,3]);
		this.addAnim('upRight', 0.2, [16,15,17,15]);
		this.addAnim('upLeft', 0.2, [10,9,11,9]);
	},

	update: function() {
		if(!this.addedToController) {
			ig.game.playerController.addPlayerEntity(this);
			this.addedToController = true;
		}
		if(this.inGame) {
			this.parent();
			this.unpauseTimers();
			this.handleMovement();
			this.handleWeaponUsage();
			this.detectCollisionsWithItems();
			this.detectCollisionsWithEnemeiesOrProjectiles();
			this.updateController();
		} else {
			this.pauseTimers();
		}
	},

	updateController: function() {
		ig.game.playerController.setPosition(this.pos);
	},

	pauseTimers: function() {
		this.invulnerableTimer.pause();
		this.globalCooldown.pause();
		this.attackCooldown.pause();
	},

	unpauseTimers: function() {
		this.invulnerableTimer.unpause();
		this.globalCooldown.unpause();
		this.attackCooldown.unpause();
	},

	getKeyCount: function() {
		return this.keyCount;
	},

	useKeyToRemoveDoor: function() {
		this.keyCount--;
	},

	handleMovement: function() {
		if (ig.input.state('up')) {
			this.vel.y = -100;
			this.currentAnim = this.anims.up;
			if (ig.input.released('up')) {
				this.vel.y = 0;
				this.currentAnim = this.anims.idleUp;
			}
		}
		// move down
		else if (ig.input.state('down')) {
			this.vel.y = 100;
			this.currentAnim = this.anims.down;
			if (ig.input.released('down')) {
				this.vel.y = 0;
				this.currentAnim = this.anims.idle;
			}
		}
		else {
			this.vel.y = 0;
		}

		// move left or right
		// move left
		if (ig.input.state('left')) {
			this.vel.x = -100;
			this.currentAnim = this.anims.left;
			if (ig.input.released('left')) {
				this.vel.x = 0;
				this.currentAnim = this.anims.idleLeft;
			}
		}
		// move right
		else if (ig.input.state('right')) {
			this.vel.x = 100;
			this.currentAnim = this.anims.right;
			if(ig.input.released('right')) {
				this.vel.x = 0;
				this.currentAnim = this.anims.idleRight;
			}
		}
		else {
			this.vel.x = 0;
		}

		if ((this.vel.x < 0) && (this.vel.y < 0)) {
			this.currentAnim = this.anims.upLeft;
		}
		// animate up right
		else if ((this.vel.x > 0) && (this.vel.y < 0)) {
			this.currentAnim = this.anims.upRight;
		}
		// animate down left
		else if ((this.vel.x < 0) && (this.vel.y > 0)) {
			this.currentAnim = this.anims.downLeft;
		}
		// animate down right
		else if((this.vel.x > 0) && (this.vel.y > 0)) {
			this.currentAnim = this.anims.downRight;
		}
	},

	handleWeaponUsage: function() {
		this.handleBoomerangUsage();
		this.handleFireFistAttacking();
	},

	handleBoomerangUsage: function() {
		this.handleBoomerangThrowing();
		this.pickUpBoomerangs();
	},

	handleBoomerangThrowing: function() {
		if (ig.input.state('boomerang') && this.globalCooldown.delta() > 0) {
			if(this.currentAnim == this.anims.right || 
				this.currentAnim == this.anims.idleRight ||
				this.currentAnim == this.anims.downRight ||
				this.currentAnim == this.anims.upRight) {
				ig.game.spawnEntity(EntityBoomerang, this.pos.x+25, this.pos.y, 
					{vel: {x: 600, y: 0}, "boomerangLevel":this.boomerangLevel, "boomerangReturnTime":0.3});
			} else if(this.currentAnim == this.anims.left || 
				this.currentAnim == this.anims.idleLeft ||
				this.currentAnim == this.anims.downLeft ||
				this.currentAnim == this.anims.upLeft) {
				ig.game.spawnEntity(EntityBoomerang, this.pos.x-20, this.pos.y, 
					{vel: {x: -600, y: 0}, "boomerangLevel":this.boomerangLevel, "boomerangReturnTime":0.3});
			} else if(this.currentAnim == this.anims.up || 
				this.currentAnim == this.anims.idleUp) {
				ig.game.spawnEntity(EntityBoomerang, this.pos.x, this.pos.y-25, 
					{vel: {x: 0, y: -600}, "boomerangLevel":this.boomerangLevel, "boomerangReturnTime":0.3});
			} else if(this.currentAnim == this.anims.down || 
				this.currentAnim == this.anims.idle) {
				ig.game.spawnEntity(EntityBoomerang, this.pos.x, this.pos.y+25, 
					{vel: {x: 0, y: 600}, "boomerangLevel":this.boomerangLevel, "boomerangReturnTime":0.3});
			}
			this.globalCooldown.set(.9);
		}
	},

	handleFireFistAttacking: function() {
		if (ig.input.state('firefist') && this.attackCooldown.delta() > 0) {
			if(this.currentAnim == this.anims.right || 
				this.currentAnim == this.anims.idleRight ||
				this.currentAnim == this.anims.downRight ||
				this.currentAnim == this.anims.upRight) {
				ig.game.spawnEntity(EntityFirefistprojectile, this.pos.x, this.pos.y, 
					{vel: {x: 300, y: 0}});
			} else if(this.currentAnim == this.anims.left || 
				this.currentAnim == this.anims.idleLeft ||
				this.currentAnim == this.anims.downLeft ||
				this.currentAnim == this.anims.upLeft) {
				ig.game.spawnEntity(EntityFirefistprojectile, this.pos.x, this.pos.y, 
					{vel: {x: -300, y: 0}});
			} else if(this.currentAnim == this.anims.up || 
				this.currentAnim == this.anims.idleUp) {
				ig.game.spawnEntity(EntityFirefistprojectile, this.pos.x, this.pos.y, 
					{vel: {x: 0, y: -300}});
			} else if(this.currentAnim == this.anims.down || 
				this.currentAnim == this.anims.idle) {
				ig.game.spawnEntity(EntityFirefistprojectile, this.pos.x, this.pos.y, 
					{vel: {x: 0, y: 300}});
			}
			this.attackCooldown.set(.4);
		}
	},

	pickUpBoomerangs: function() {
		var boomerangs = ig.game.getEntitiesByType(EntityBoomerang);
		for (var i=0; i < boomerangs.length; i++) {
			var boomerang = boomerangs[i];
			if(this.touches(boomerang))
			{
				boomerang.kill();
				this.globalCooldown.set(0.2);
			}
		}
	},

	detectCollisionsWithItems: function() {
		this.detectCollisionsWithKeys();
	},

	detectCollisionsWithKeys: function() {
		var keys = ig.game.getEntitiesByType(EntityKey);
		for (var i=0; i < keys.length; i++) {
			var key = keys[i];
			if(this.touches(key))
			{
				key.kill();
				this.keyCount++;
			}
		}
	},
	
	//Detects and handles any collisions that should cause damage
	detectCollisionsWithEnemeiesOrProjectiles: function() {
		this.detectCollisionsWithFireballs();
		this.detectCollisionsWithArrows();
		this.detectCollisionsWithMages();
		this.detectCollisionsWithArchers();
	},

	detectCollisionsWithFireballs: function() {
		var fireballs = ig.game.getEntitiesByType(EntityFireball);
		for (var i=0; i < fireballs.length; i++) {
			var fireball = fireballs[i];
			if(this.touches(fireball))
			{
				fireball.kill();
				if(this.invulnerableTimer.delta() > 0)
				{
					this.receiveDamage(100, fireball);
					this.invulnerableTimer.set(this.invulnerableDuration);
				}
			}
		}
	},

	detectCollisionsWithArrows: function() {
		var arrows = ig.game.getEntitiesByType(EntityArrow);
		for (var i=0; i < arrows.length; i++) {
			var arrow = arrows[i];
			if(this.touches(arrow))
			{
				arrow.kill();
				if(this.invulnerableTimer.delta() > 0)
				{
					this.receiveDamage(50, arrow);
					this.invulnerableTimer.set(this.invulnerableDuration);
				}
			}
		}
	},

	detectCollisionsWithMages: function() {
		var mages = ig.game.getEntitiesByType(EntityMage);
		for (var i=0; i < mages.length; i++) {
			var mage = mages[i];
			if(this.touches(mage))
			{
				if(this.invulnerableTimer.delta() > 0)
				{
					this.receiveDamage(150, mage);
					this.invulnerableTimer.set(this.invulnerableDuration);
				}
			}
		}
	},

	detectCollisionsWithArchers: function() {
		var archers = ig.game.getEntitiesByType(EntityArcher);
		for (var i=0; i < archers.length; i++) {
			var archer = archers[i];
			if(this.touches(archer)) {
				if(this.invulnerableTimer.delta() > 0) {
					this.receiveDamage(150, archer);
					this.invulnerableTimer.set(this.invulnerableDuration);
				}
			}
		}
	},

	getPosition: function() {
		return this.pos;
	},
	setPosition: function(posx,posy) {
		this.pos.x = posx;
		this.pos.y = posy;
	},

	draw: function() {
		if(this.inGame) {
			this.parent();

			var playerHealthString = "Player Health: " + this.health;
			this.font.draw(playerHealthString, 10, 10, ig.Font.ALIGN.LEFT);

			var playerKeyCountString = "Keys: " + this.keyCount;
			this.font.draw(playerKeyCountString, 10, 33, ig.Font.ALIGN.LEFT);
		}
	},

	getHealth: function() {
		return this.health;
	},
	setHealth: function(myhealth) {
		this.health = myhealth;
	},

	//Getters and setters for weapons/equipment levels
	getBoomerangLevel: function() {
		return this.boomerangLevel;
	},
	setBoomerangLevel: function(myBoomerangLevel) {
		this.boomerangLevel = myBoomerangLevel;
	},

	getSwordLevel: function() {
		return this.swordLevel;
	},
	setSwordLevel: function(mySwordLevel) {
		this.swordLevel = mySwordLevel;
	},

	getFirefistLevel: function() {
		return this.firefistLevel;
	},
	setFirefistLevel: function(myFirefistLevel) {
		this.firefistLevel = myFirefistLevel;
	},

	getBowLevel: function() {
		return this.bowLevel;
	},
	setBowLevel: function(myBowLevel) {
		this.bowLevel = myBowLevel;
	},

	getGrapplinghookLevel: function() {
		return this.grapplinghookLevel;
	},
	setGrapplinghookLevel: function(myGrapplinghookLevel) {
		this.grapplinghookLevel = myGrapplinghookLevel;
	},

	getMagicwandLevel: function() {
		return this.magicwandLevel;
	},
	setMagicwandLevel: function(myMagicwandLevel) {
		this.magicwandLevel = myMagicwandLevel;
	},

	getMagiccloakLevel: function() {
		return this.magiccloakLevel;
	},
	setMagiccloakLevel: function(myMagiccloakLevel) {
		this.magiccloakLevel = myMagiccloakLevel;
	},

});

});