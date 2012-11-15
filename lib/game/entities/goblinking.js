ig.module(
	'game.entities.goblinking'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityGoblinking = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	name: 'goblinking',

	size: {x: 58, y: 65},
	health: 4000,

	animSheet: new ig.AnimationSheet( 'media/goblinking.png', 64, 70),

	init: function(x, y, settings) {
		this.parent( x, y, settings );
		this.maxHealth = 4000;
		this.addAnimations();
		this.maxVel.x = 800;
		this.maxVel.y = 800;
		this.offset.y = 2;
		this.offset.x = 3;
		this.chargeTimer = new ig.Timer(0);
		this.chargeDurationRemainingTimer = new ig.Timer(0);
		this.isCharging = false;
		this.killMe = false;
		this.inGame = true;
		this.invulnerableTimer = new ig.Timer(0);
		this.knockbackTimer = new ig.Timer(0);
		this.knockbackAngle = 0;

		this.helpHealth = 3500;
		this.enrageHealth = 3000;
		this.isEnraged = false;
		this.isHelpAlive = false;
		this.increasedDamageTimer = new ig.Timer(0);

		this.normalSpeed = 90;
		this.chargingMultiplier = 1.3;
		this.enragedMultiplier = 1.4;

	},

	addAnimations: function() {
		// idle animation
		this.addAnim('idle', 1, [1] );
		this.addAnim('idleUp', 1, [10]);
		this.addAnim('idleLeft', 1, [4]);
		this.addAnim('idleRight', 1, [7]);

		// four way directional animation
		this.addAnim('down', 0.2, [0,1,2,1] );
		this.addAnim('up', 0.2, [9,10,11,10] );
		this.addAnim('left', 0.2, [3,4,5,4] );
		this.addAnim('right', 0.2, [6,7,8,7] );

		// diagonal direction animation
		this.addAnim('downRight', 0.2, [6,7,8,7]);
		this.addAnim('downLeft', 0.2, [3,4,5,4]);
		this.addAnim('upRight', 0.2, [6,7,8,7]);
		this.addAnim('upLeft', 0.2, [3,4,5,4]);
	},

	checkIfDead: function() {
		if(ig.game.doorController.isDoorInUnlockedList(this.name))
			this.killMe = true;
	},
	ready: function() {
		ig.music.play('goblinking');
		this.checkIfDead();
		if(this.killMe)
			this.kill();
	},
	update: function() {
		if (this.inGame) {
			this.parent();
			this.chargeTimer.unpause();
			this.chargeDurationRemainingTimer.unpause();
			if(ig.game.getEntitiesByType(EntityPlayer).length > 0) {
				var player = ig.game.getEntitiesByType(EntityPlayer)[0];
				this.handleCharging(player);
				//Handles movement
				this.handleMovement(player);
			}
			else {
				this.vel.x = 0;
				this.vel.y = 0;
				this.currentAnim = this.anims.idle;
			}
		} else {
			this.chargeTimer.pause();
			this.chargeDurationRemainingTimer.pause();
		}
	},

	draw: function() {
		if (this.inGame) {
			ig.system.context.fillStyle = "rgb(0,0,0)";
        	ig.system.context.beginPath();
        	ig.system.context.rect(
        	                (this.pos.x - ig.game.screen.x) * ig.system.scale, 
        	                (this.pos.y - ig.game.screen.y - 8) * ig.system.scale, 
        	                this.size.x * ig.system.scale, 
        	                4 * ig.system.scale
        	            );
        	ig.system.context.closePath();
        	ig.system.context.fill();
        	
        	// health bar
        	ig.system.context.fillStyle = "rgb(255,0,0)";
        	ig.system.context.beginPath();
        	ig.system.context.rect(
        	                (this.pos.x - ig.game.screen.x + 1) * ig.system.scale, 
        	                (this.pos.y - ig.game.screen.y - 7) * ig.system.scale, 
        	                ((this.size.x - 2) * (this.health / this.maxHealth)) * ig.system.scale, 
        	                2 * ig.system.scale
        	            );
        	ig.system.context.closePath();
        	ig.system.context.fill();

			this.parent();
		}
	},

	receiveDamage: function(amount, from) {
		if(this.invulnerableTimer.delta() > 0) {
			var fromIsBoomerang = (from instanceof EntityBoomerang);
			if(fromIsBoomerang && this.isEnraged) {
				this.isEnraged = false;
				this.increasedDamageTimer.set(5);
				ig.game.addMessage("Ow, quit that!");
			} else if(!this.isEnraged) {
				if(fromIsBoomerang) {
					if(this.increasedDamageTimer.delta() > 0) {
					this.parent(Math.floor(amount/10), from);
					} else {
					this.parent(Math.floor(amount/10*1.25), from);
				}
				} else {
					this.invulnerableTimer.set(0.2);
					this.knockbackTimer.set(0.2);
					this.knockbackAngle = this.angleTo(ig.game.playerController.playerCharacter) + Math.PI;
					if(this.increasedDamageTimer.delta() > 0) {
					this.parent(amount, from);
					} else {
					this.parent(Math.floor(amount*1.25), from);
				}
				}

				
			}
			
			if(this.enrageHealth > this.health) {
				this.isEnraged = true;
				this.enrageHealth -= 1000;
				ig.game.addMessage("I'll get you myself!");
			}
			if(this.helpHealth > this.health) {
				this.isHelpAlive = true;
				this.helpHealth -= 1000;
				ig.game.addMessage("Do I have to do everything? Help me boys!")
				ig.game.spawnEntity(EntityGoblin, 150, 288, {health: 150, trackingDistance: 3000});
				ig.game.spawnEntity(EntityGoblin, 150, 530, {health: 150, trackingDistance: 3000});
				ig.game.spawnEntity(EntityGoblin, 150, 800, {health: 150, trackingDistance: 3000});
				ig.game.spawnEntity(EntityGoblin, 932, 288, {health: 150, trackingDistance: 3000});
				ig.game.spawnEntity(EntityGoblin, 932, 530, {health: 150, trackingDistance: 3000});
				ig.game.spawnEntity(EntityGoblin, 932, 800, {health: 150, trackingDistance: 3000});
			}

		}
	},

	handleMovement: function(player) {
		if (this.knockbackTimer.delta() < 0) {
			this.vel.x = Math.cos(this.knockbackAngle) * 200;
			this.vel.y = Math.sin(this.knockbackAngle) * 200;
		} else {
			if(this.distanceTo(player) < 1000) {
				var currentSpeed = this.normalSpeed;
				if(this.isEnraged) currentSpeed *= this.enragedMultiplier;
				if(this.isCharging) currentSpeed *= this.chargingMultiplier;
				this.vel.x = 1 * Math.cos(this.angleTo(player)) * currentSpeed;
				this.vel.y = 1 * Math.sin(this.angleTo(player)) * currentSpeed;

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

	handleCharging: function(player) {
		if(this.chargeDurationRemainingTimer.delta() > 0 && this.isCharging) {
			this.isCharging = false;
		}
		if(this.distanceTo(player) < 200 && this.chargeTimer.delta() > 0 && !this.isCharging) {
			this.isCharging = true;
			this.chargeDurationRemainingTimer.set(2);
			this.chargeTimer.set(15);
		}
	},

	kill: function() {
		this.parent();
		if(!ig.game.doorController.isDoorInUnlockedList(this.name)) {
			ig.game.doorController.addDoorEntityToUnlockedList(this.name);
			
			//drop massive lootz
		}
		var doors = ig.game.getEntitiesByType(EntityDoor);
		for (i=0; i < doors.length; i++) {
			doors[i].kill();
		}
	}

});

});