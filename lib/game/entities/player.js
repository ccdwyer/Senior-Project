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

	size: {x: 23, y: 23},
	health: 1000,

	animSheet: new ig.AnimationSheet( 'media/playerhighres.png', 60, 60),

	init: function(x, y, settings) {

		this.parent( x, y, settings );
		
		this.setAnimations();
		this.setTimersAndCooldowns();
		
		this.inGame = true;
		this.offset.x = 16;
		this.offset.y = 21;
		this.keyCount = 0;
		this.coinCount = 0;

		//Handling potions
		this.potionCount = 5;
		this.isHealing = false;
		this.potionDuration = new ig.Timer(0);
		this.potionTickTimer = new ig.Timer(0);
		this.potionTickTime = 3;
		this.potionReuseTime = 15.5;


		this.primary = 'sword';
		this.seconadry = '';

		this.maxVel.x = 400;
		this.maxVel.y = 400;
		this.maxHealth = 1000;
		this.States = { "fullcontrol" : 0,
						"attacking" : 1,
						"stunned" : 2,
						"grappling" : 3 };
		this.state = this.States.fullcontrol;
		this.shielded = false;

		this.setItemLevels();
		
		this.font = new ig.Font( 'media/plainfont.png' );
		this.addedToController = false;
		this.destination = {'x':0,
							'y':1};

		this.knockbackTimer = new ig.Timer(0);
		this.knockbackAngle = 0;
		this.zIndex = 99999;
		this.speed = 160;
		//Make sure the player is drawn on top.							
	},

	setTimersAndCooldowns: function() {
		this.invulnerableTimer = new ig.Timer(0);
		this.shieldedTimer = new ig.Timer(0);
		this.invulnerableDuration = 1;
		this.globalCooldown = new ig.Timer(0);
		this.attackCooldown = new ig.Timer(0);
		this.moveCooldown = new ig.Timer(0);
		this.equipCooldown = new ig.Timer(0);
		this.returnCooldown = new ig.Timer(0);
	},

	setItemLevels: function() {
		this.boomerangLevel = -1;
		this.swordLevel = 0;
		this.firefistLevel = -1;
		this.bowLevel = -1;
		this.grapplinghookLevel = -1;
		this.magicwandLevel = -1;
		this.magiccloakLevel = -1;
	},

	setAnimations: function() {
		// idle animation
		this.addAnim('idle', 1, [4] );
		this.addAnim('idleUp', 1, [12]);
		this.addAnim('idleLeft', 1, [8]);
		this.addAnim('idleRight', 1, [0]);

		// four way directional animation
		this.addAnim('down', 0.2, [5,4,6,4] );
		this.addAnim('up', 0.2, [13,12,14,12] );
		this.addAnim('left', 0.2, [9,8,10,8] );
		this.addAnim('right', 0.2, [1,0,2,0] );

		// sword 1 attack animations
		this.addAnim('sword1AttackUp', 0.2, [19]);
		this.addAnim('sword1AttackDown', 0.2, [17]);
		this.addAnim('sword1AttackLeft', 0.2, [18]);
		this.addAnim('sword1AttackRight', 0.2, [16]);

		// sword 2 attack animations
		this.addAnim('sword2AttackUp', 0.2, [23]);
		this.addAnim('sword2AttackDown', 0.2, [21]);
		this.addAnim('sword2AttackLeft', 0.2, [22]);
		this.addAnim('sword2AttackRight', 0.2, [20]);

		// sword 3 attack animations
		this.addAnim('sword3AttackUp', 0.2, [27]);
		this.addAnim('sword3AttackDown', 0.2, [25]);
		this.addAnim('sword3AttackLeft', 0.2, [26]);
		this.addAnim('sword3AttackRight', 0.2, [24]);

		// fist 1 attack animations
		this.addAnim('fist1AttackUp', 0.2, [31]);
		this.addAnim('fist1AttackDown', 0.2, [29]);
		this.addAnim('fist1AttackLeft', 0.2, [30]);
		this.addAnim('fist1AttackRight', 0.2, [28]);

		// fist 2 attack animations
		this.addAnim('fist2AttackUp', 0.2, [35]);
		this.addAnim('fist2AttackDown', 0.2, [33]);
		this.addAnim('fist2AttackLeft', 0.2, [34]);
		this.addAnim('fist2AttackRight', 0.2, [32]);

		// fist 2 attack animations
		this.addAnim('fist3AttackUp', 0.2, [39]);
		this.addAnim('fist3AttackDown', 0.2, [37]);
		this.addAnim('fist3AttackLeft', 0.2, [38]);
		this.addAnim('fist3AttackRight', 0.2, [36]);

		// magic wand animations
		this.addAnim('wandAttackUp', 0.2, [43]);
		this.addAnim('wandAttackDown', 0.2, [41]);
		this.addAnim('wandAttackLeft', 0.2, [42]);
		this.addAnim('wandAttackRight', 0.2, [40]);

		// bow animations
		this.addAnim('bowAttackUp', 0.2, [47]);
		this.addAnim('bowAttackDown', 0.2, [45]);
		this.addAnim('bowAttackLeft', 0.2, [46]);
		this.addAnim('bowAttackRight', 0.2, [44]);

	},

	ready: function() {
		ig.game.playerController.addPlayerEntity(this);
		if (this.swordLevel == 5) {
			this.speed = 200;
		}
		ig.game.portalController.setDestination(ig.game.myDirector.currentLevel, this.pos.x, this.pos.y);
	},

	update: function() {
		if(this.inGame) {
			this.parent();
				this.unpauseTimers();
				this.detectCollisionsWithItems();
				this.updateController();
			if(this.state == this.States.fullcontrol) {
				this.handleMovement();
				this.handleWeaponUsage();
				this.handleWeaponEquiping();
				this.handleWeaponUpgrading();
				this.handlePotionUsage();
			}
			else if(this.state == this.States.grappling) {
				this.handleGrappling();
			}
		} else {
			this.pauseTimers();
		}
	},
	// Overides kill for gameover screen
	kill: function() {
		this.parent();
		ig.game.gameOver();
	},

	handlePotionUsage: function() {
		if (this.potionCount > 0 && this.potionDuration.delta() > 0 && ig.input.state('potion')) {
			this.potionCount--;
			this.potionTickTimer.set(0);
			this.potionDuration.set(this.potionReuseTime);
			this.isHealing = true;
			ig.game.healSound.play();
		}

		if(this.isHealing && this.potionTickTimer.delta() > 0) {
			this.healBy(45);
			if(this.potionDuration.delta() > 0) {
				this.isHealing = false;
			}
			else {
				this.potionTickTimer.set(this.potionTickTime);
			}
		}

	},

	handleGrappling: function () {
		if(ig.game.getEntitiesByType(EntityGrapplinghook).length > 0) {
			var grapplinghook = ig.game.getEntitiesByType(EntityGrapplinghook)[0];
			this.vel.x = 0;
			this.vel.y = 0;
		}
		else {
			if(this.destination['x'] > this.pos.x)
				this.vel.x = 200;
			if(this.destination['x'] < this.pos.x)
				this.vel.x = -200;
			if(this.destination['y'] < this.pos.y)
				this.vel.y = -200;
			if(this.destination['y'] > this.pos.y)
				this.vel.y = 200;
		}
	},

	updateController: function() {
		ig.game.playerController.setPosition(this.pos);
	},

	pauseTimers: function() {
		this.invulnerableTimer.pause();
		this.globalCooldown.pause();
		this.attackCooldown.pause();
		this.shieldedTimer.pause();
		this.moveCooldown.pause();
		this.equipCooldown.pause();
		this.returnCooldown.pause();
		this.potionDuration.pause();
		this.potionTickTimer.pause();
	},

	unpauseTimers: function() {
		this.invulnerableTimer.unpause();
		this.globalCooldown.unpause();
		this.attackCooldown.unpause();
		this.shieldedTimer.unpause();
		this.moveCooldown.unpause();
		this.equipCooldown.unpause();
		this.returnCooldown.unpause();
		this.potionDuration.unpause();
		this.potionTickTimer.unpause();
	},

	getKeyCount: function() {
		return this.keyCount;
	},

	useKeyToRemoveDoor: function() {
		this.keyCount--;
	},

	handleMovement: function() {

		if (this.knockbackTimer.delta() < 0) {
			this.vel.x = Math.cos(this.knockbackAngle) * 400;
			this.vel.y = Math.sin(this.knockbackAngle) * 400;
		} else {
			// move up
			if (ig.input.state('up') && this.moveCooldown.delta() > 0) {
				this.vel.y = -this.speed;
				this.currentAnim = this.anims.up;
				if (ig.input.released('up')) {
					this.vel.y = 0;
					this.currentAnim = this.anims.idleUp;
				}
			}
			// move down
			else if (ig.input.state('down') && this.moveCooldown.delta() > 0) {
				this.vel.y = this.speed;
				this.currentAnim = this.anims.down;
				if (ig.input.released('down')) {
					this.vel.y = 0;
					this.currentAnim = this.anims.idle;
				}
			}
			else {
				this.vel.y = 0;
			}

			// move left
			if (ig.input.state('left') && this.moveCooldown.delta() > 0) {
				this.vel.x = -this.speed;
				this.currentAnim = this.anims.left;
				if (ig.input.released('left')) {
					this.vel.x = 0;
					this.currentAnim = this.anims.idleLeft;
				}
			}
			// move right
			else if (ig.input.state('right') && this.moveCooldown.delta() > 0) {
				this.vel.x = this.speed;
				this.currentAnim = this.anims.right;
				if(ig.input.released('right')) {
					this.vel.x = 0;
					this.currentAnim = this.anims.idleRight;
				}
			}
			else {
				this.vel.x = 0;
			}
		}
	},

	handleWeaponEquiping: function () {
		this.handlePrimaryEquiping();
		this.handleSecondaryEquiping();
	},

	handlePrimaryEquiping: function() {
		if (ig.input.state('sword') && this.equipCooldown.delta() > 0 && this.swordLevel >= 0) {
			this.primary = 'sword';
			this.equipCooldown.set(.5);
		}
		else if (ig.input.state('fist') && this.equipCooldown.delta() > 0 && this.firefistLevel >= 0) {
			if(this.firefistLevel == 5) {
				this.primary = 'firefist'
				this.equipCooldown.set(.5);
			}
			else {
				this.primary = 'fist';
				this.equipCooldown.set(.5);
			}
			
		}
	},

	handleSecondaryEquiping: function() {
		if (ig.input.state('boomerang') && this.equipCooldown.delta() > 0 && this.boomerangLevel >= 0) {
			this.secondary = 'boomerang';
			this.equipCooldown.set(.5);
		}
		else if (ig.input.state('bow') && this.equipCooldown.delta() > 0 && this.bowLevel >= 0) {
			this.secondary = 'bow';
			this.equipCooldown.set(.5);
		}
		else if (ig.input.state('grapplinghook') && this.equipCooldown.delta() > 0 && this.grapplinghookLevel >= 0) {
			this.secondary = 'grapplinghook';
			this.equipCooldown.set(.5);
		}
		else if (ig.input.state('magiccloak') && this.equipCooldown.delta() > 0 && this.magiccloakLevel >= 0) {
			this.secondary = 'magiccloak';
			this.equipCooldown.set(.5);
		}
		else if (ig.input.state('magicwand') && this.equipCooldown.delta() > 0 && this.magicwandLevel >= 0) {
			this.secondary = 'magicwand';
			this.equipCooldown.set(.5);
		}
	},

	handleWeaponUsage: function() {
		this.handleMagiccloakUsage();
		this.handleBoomerangUsage();
		this.handleFireFistAttacking();
		this.handleSwordAttacking();
		this.handleFistAttacking();
		this.handleGrapplinghookUsage();
		this.handleBowUsage();
		this.handleSwordEndAnimation();
		this.handleFistEndAnimation();
		this.handleMagicwandUsage();
		this.handleWandEndAnimation();
		this.handleBowEndAnimation();
	},

	handleBoomerangUsage: function() {
		this.handleBoomerangThrowing();
		this.pickUpBoomerangs();
	},

	handleMagicwandUsage: function() {
		var arcaneblocks = ig.game.getEntitiesByType(EntityArcaneblock);

		if (this.secondary == 'magicwand' && ig.input.state('secondary') && this.globalCooldown.delta() > 0) {
			if(arcaneblocks.length < 1 || arcaneblocks[0].canBeDestroyed()) {
				if(arcaneblocks.length > 0) {
					arcaneblocks[0].kill();
				}
				if(this.currentAnim == this.anims.right || 
					this.currentAnim == this.anims.idleRight) {
					this.currentAnim = this.anims.wandAttackRight;
					ig.game.spawnEntity(EntityArcaneblock, this.pos.x+27, this.pos.y-7, 
						{"magicwandLevel":this.magicwandLevel});
				} else if(this.currentAnim == this.anims.left || 
					this.currentAnim == this.anims.idleLeft) {
					this.currentAnim = this.anims.wandAttackLeft;
					ig.game.spawnEntity(EntityArcaneblock, this.pos.x-38, this.pos.y-10, 
						{"magicwandLevel":this.magicwandLevel});
				} else if(this.currentAnim == this.anims.up || 
					this.currentAnim == this.anims.idleUp) {
					this.currentAnim = this.anims.wandAttackUp;
					ig.game.spawnEntity(EntityArcaneblock, this.pos.x-5, this.pos.y-47, 
						{"magicwandLevel":this.magicwandLevel});
				} else if(this.currentAnim == this.anims.down || 
					this.currentAnim == this.anims.idle) {
					this.currentAnim = this.anims.wandAttackDown;
					ig.game.spawnEntity(EntityArcaneblock, this.pos.x-5, this.pos.y+27, 
						{"magicwandLevel":this.magicwandLevel});
				}
				this.globalCooldown.set(2);
				this.moveCooldown.set(.2);
				this.returnCooldown.set(.2);
				
			}
		}
	},

	handleWandEndAnimation: function() {
		if (this.currentAnim == this.anims.wandAttackRight &&
			this.returnCooldown.delta() > 0) {
			this.currentAnim = this.anims.idleRight;
		}
		else if (this.currentAnim == this.anims.wandAttackLeft &&
			this.returnCooldown.delta() > 0) {
			this.currentAnim = this.anims.idleLeft;
		}
		else if (this.currentAnim == this.anims.wandAttackUp &&
			this.returnCooldown.delta() > 0) {
			this.currentAnim = this.anims.idleUp;
		}
		else if (this.currentAnim == this.anims.wandAttackDown &&
			this.returnCooldown.delta() > 0){
			this.currentAnim = this.anims.idle;
		}
	},

	handleBowUsage: function() {
		if (this.secondary == 'bow' && ig.input.state('secondary') && this.globalCooldown.delta() > 0) {
			if(this.currentAnim == this.anims.right || 
				this.currentAnim == this.anims.idleRight) {
				this.currentAnim = this.anims.bowAttackRight;
				ig.game.spawnEntity(EntityPlayerarrow, this.pos.x+30, this.pos.y+3, 
					{vel: {x: 600, y: 0}, "bowLevel":this.bowLevel});
			} else if(this.currentAnim == this.anims.left || 
				this.currentAnim == this.anims.idleLeft) {
				this.currentAnim = this.anims.bowAttackLeft;
				ig.game.spawnEntity(EntityPlayerarrow, this.pos.x-30, this.pos.y+3, 
					{vel: {x: -600, y: 0}, "bowLevel":this.bowLevel});
			} else if(this.currentAnim == this.anims.up || 
				this.currentAnim == this.anims.idleUp) {
				this.currentAnim = this.anims.bowAttackUp;
				ig.game.spawnEntity(EntityPlayerarrow, this.pos.x+5, this.pos.y-25, 
					{vel: {x: 0, y: -600}, "bowLevel":this.bowLevel});
			} else if(this.currentAnim == this.anims.down || 
				this.currentAnim == this.anims.idle) {
				this.currentAnim = this.anims.bowAttackDown;
				ig.game.spawnEntity(EntityPlayerarrow, this.pos.x+5, this.pos.y+30, 
					{vel: {x: 0, y: 600}, "bowLevel":this.bowLevel});
			}
			ig.game.rangedUseSound.play();
			this.globalCooldown.set(.9);
			this.moveCooldown.set(.2);
			this.returnCooldown.set(.2);
		}
	},

	handleBowEndAnimation: function() {
		if (this.currentAnim == this.anims.bowAttackRight &&
			this.returnCooldown.delta() > 0) {
			this.currentAnim = this.anims.idleRight;
		}
		else if (this.currentAnim == this.anims.bowAttackLeft &&
			this.returnCooldown.delta() > 0) {
			this.currentAnim = this.anims.idleLeft;
		}
		else if (this.currentAnim == this.anims.bowAttackUp &&
			this.returnCooldown.delta() > 0) {
			this.currentAnim = this.anims.idleUp;
		}
		else if (this.currentAnim == this.anims.bowAttackDown &&
			this.returnCooldown.delta() > 0){
			this.currentAnim = this.anims.idle;
		}
	},

	handleMagiccloakUsage: function() {
		if(this.shieldedTimer.delta() > 0 && this.shielded) {
			this.shielded = false;
			this.animSheet = new ig.AnimationSheet('media/playerhighres.png', 60, 60);
			this.setAnimations();
			this.currentAnim = this.anims.idle;
		}
		if (this.secondary == 'magiccloak' && ig.input.state('secondary') && this.globalCooldown.delta() > 0) {
			this.globalCooldown.set(10);
			this.shielded = true;
			this.shieldedTimer.set(this.magiccloakLevel + 5);
			this.animSheet = new ig.AnimationSheet('media/playershieldedhighres.png', 60, 60);
			this.setAnimations();
			this.currentAnim = this.anims.idle;
		}
	},

	handleBoomerangThrowing: function() {
		if (this.secondary == 'boomerang' && ig.input.state('secondary') && this.globalCooldown.delta() > 0) {
			if(this.currentAnim == this.anims.right || 
				this.currentAnim == this.anims.idleRight) {
				ig.game.spawnEntity(EntityBoomerang, this.pos.x+30, this.pos.y+3, 
					{vel: {x: 600, y: 0}, "boomerangLevel":this.boomerangLevel, "boomerangReturnTime":0.3});
			} else if(this.currentAnim == this.anims.left || 
				this.currentAnim == this.anims.idleLeft) {
				ig.game.spawnEntity(EntityBoomerang, this.pos.x-30, this.pos.y+3, 
					{vel: {x: -600, y: 0}, "boomerangLevel":this.boomerangLevel, "boomerangReturnTime":0.3});
			} else if(this.currentAnim == this.anims.up || 
				this.currentAnim == this.anims.idleUp) {
				ig.game.spawnEntity(EntityBoomerang, this.pos.x+5, this.pos.y-25, 
					{vel: {x: 0, y: -600}, "boomerangLevel":this.boomerangLevel, "boomerangReturnTime":0.3});
			} else if(this.currentAnim == this.anims.down || 
				this.currentAnim == this.anims.idle) {
				ig.game.spawnEntity(EntityBoomerang, this.pos.x+5, this.pos.y+30, 
					{vel: {x: 0, y: 600}, "boomerangLevel":this.boomerangLevel, "boomerangReturnTime":0.3});
			}
			ig.game.rangedUseSound.play();
			this.globalCooldown.set(.9);
		}
	},

	handleGrapplinghookUsage: function() {
		if (this.secondary == 'grapplinghook' && ig.input.state('secondary') && this.globalCooldown.delta() > 0) {
			if(this.currentAnim == this.anims.right || 
				this.currentAnim == this.anims.idleRight) {
				ig.game.spawnEntity(EntityGrapplinghook, this.pos.x, this.pos.y, 
					{vel: {x: 400, y: 0}, "grapplinghookLevel":this.grapplinghookLevel});
			} else if(this.currentAnim == this.anims.left || 
				this.currentAnim == this.anims.idleLeft) {
				ig.game.spawnEntity(EntityGrapplinghook, this.pos.x, this.pos.y, 
					{vel: {x: -400, y: 0}, "grapplinghookLevel":this.grapplinghookLevel});
			} else if(this.currentAnim == this.anims.up || 
				this.currentAnim == this.anims.idleUp) {
				ig.game.spawnEntity(EntityGrapplinghook, this.pos.x, this.pos.y, 
					{vel: {x: 0, y: -400}, "grapplinghookLevel":this.grapplinghookLevel});
			} else if(this.currentAnim == this.anims.down || 
				this.currentAnim == this.anims.idle) {
				ig.game.spawnEntity(EntityGrapplinghook, this.pos.x, this.pos.y, 
					{vel: {x: 0, y: 400}, "grapplinghookLevel":this.grapplinghookLevel});
			}
			this.state = this.States.grappling;
			this.globalCooldown.set(3 - 0.3*this.grapplinghookLevel);
		}
	},

	handleFireFistAttacking: function() {
		if (this.primary == 'firefist' && ig.input.state('primary') && this.attackCooldown.delta() > 0) {
			if(this.currentAnim == this.anims.right || 
				this.currentAnim == this.anims.idleRight) {
				this.currentAnim = this.anims.fist3AttackRight;
				ig.game.spawnEntity(EntityFirefistprojectile, this.pos.x, this.pos.y, 
					{vel: {x: 300, y: 0}});
				ig.game.spawnEntity(EntityFist, this.pos.x + 25, this.pos.y + 5,
					{vel: {x:0, y:0}, "firefistLevel":this.firefistLevel});
			} else if(this.currentAnim == this.anims.left || 
				this.currentAnim == this.anims.idleLeft) {
				this.currentAnim = this.anims.fist3AttackLeft;
				ig.game.spawnEntity(EntityFirefistprojectile, this.pos.x, this.pos.y, 
					{vel: {x: -300, y: 0}});
				ig.game.spawnEntity(EntityFist, this.pos.x - 15, this.pos.y,
					{vel: {x:0, y:0}, "firefistLevel":this.firefistLevel});
			} else if(this.currentAnim == this.anims.up || 
				this.currentAnim == this.anims.idleUp) {
				this.currentAnim = this.anims.fist3AttackUp;
				ig.game.spawnEntity(EntityFirefistprojectile, this.pos.x, this.pos.y, 
					{vel: {x: 0, y: -300}});
				ig.game.spawnEntity(EntityFist, this.pos.x + 15, this.pos.y - 20,
					{vel: {x:0, y:0}, "firefistLevel":this.firefistLevel});
			} else if(this.currentAnim == this.anims.down || 
				this.currentAnim == this.anims.idle) {
				this.currentAnim = this.anims.fist3AttackDown;
				ig.game.spawnEntity(EntityFirefistprojectile, this.pos.x, this.pos.y, 
					{vel: {x: 0, y: 300}});
				ig.game.spawnEntity(EntityFist, this.pos.x, this.pos.y + 20,
					{vel: {x:0, y:0}, "firefistLevel":this.firefistLevel});
			}
			this.attackCooldown.set(.4);
			this.moveCooldown.set(.2);
			this.returnCooldown.set(.2);
		}
	},

	handleSwordAttacking: function() {
		if (this.primary == 'sword' && ig.input.pressed('primary') && this.attackCooldown.delta() > 0) {
			if(this.currentAnim == this.anims.up ||
				this.currentAnim == this.anims.idleUp) {
				if (this.swordLevel == 0) {
					this.currentAnim = this.anims.sword1AttackUp;
				}
				else if(this.swordLevel >= 1 && this.swordLevel <= 4) {
					this.currentAnim = this.anims.sword2AttackUp;
				}
				else if(this.swordLevel == 5) {
					this.currentAnim = this.anims.sword3AttackUp;
				}
				ig.game.spawnEntity(EntitySword, this.pos.x + 10, this.pos.y - 25,
					{size: {x:40, y:20}, "swordLevel":this.swordLevel});
			}
			else if(this.currentAnim == this.anims.down ||
				this.currentAnim == this.anims.idle) {
				if (this.swordLevel == 0) {
					this.currentAnim = this.anims.sword1AttackDown;
				}
				else if(this.swordLevel >= 1 && this.swordLevel <= 4) {
					this.currentAnim = this.anims.sword2AttackDown;
				}
				else if(this.swordLevel == 5) {
					this.currentAnim = this.anims.sword3AttackDown;
				}
				ig.game.spawnEntity(EntitySword, this.pos.x - 10, this.pos.y + 25,
					{size: {x:40, y:20}, "swordLevel":this.swordLevel});
			}
			else if(this.currentAnim == this.anims.right ||
				this.currentAnim == this.anims.idleRight) {
				if (this.swordLevel == 0) {
					this.currentAnim = this.anims.sword1AttackRight;
				}
				else if(this.swordLevel >= 1 && this.swordLevel <= 4) {
					this.currentAnim = this.anims.sword2AttackRight;
				}
				else if(this.swordLevel == 5) {
					this.currentAnim = this.anims.sword3AttackRight;
				}
				ig.game.spawnEntity(EntitySword, this.pos.x + 35, this.pos.y - 5,
					{size: {x:20, y:40}, "swordLevel":this.swordLevel});
			}
			else if(this.currentAnim == this.anims.left ||
				this.currentAnim == this.anims.idleLeft) {
				if (this.swordLevel == 0) {
					this.currentAnim = this.anims.sword1AttackLeft;
				}
				else if(this.swordLevel >= 1 && this.swordLevel <= 4) {
					this.currentAnim = this.anims.sword2AttackLeft;
				}
				else if(this.swordLevel == 5) {
					this.currentAnim = this.anims.sword3AttackLeft;
				}
				ig.game.spawnEntity(EntitySword, this.pos.x - 20, this.pos.y - 5,
					{size: {x:20, y:40}, "swordLevel":this.swordLevel});
			}
			this.attackCooldown.set(.4);
			this.moveCooldown.set(.2);
			this.returnCooldown.set(.2);
		}

	},

	handleSwordEndAnimation: function() {
		if ((this.currentAnim == this.anims.sword1AttackLeft || 
			this.currentAnim == this.anims.sword2AttackLeft ||
			this.currentAnim == this.anims.sword3AttackLeft) && 
			this.returnCooldown.delta() > 0) {
			this.currentAnim = this.anims.idleLeft;
		}
		else if ((this.currentAnim == this.anims.sword1AttackRight || 
			this.currentAnim == this.anims.sword2AttackRight ||
			this.currentAnim == this.anims.sword3AttackRight) && 
			this.returnCooldown.delta() > 0) {
			this.currentAnim = this.anims.idleRight;
		}
		else if ((this.currentAnim == this.anims.sword1AttackUp || 
			this.currentAnim == this.anims.sword2AttackUp ||
			this.currentAnim == this.anims.sword3AttackUp) && 
			this.returnCooldown.delta() > 0) {
			this.currentAnim = this.anims.idleUp;
		}
		else if ((this.currentAnim == this.anims.sword1AttackDown || 
			this.currentAnim == this.anims.sword2AttackDown ||
			this.currentAnim == this.anims.sword3AttackDown) && 
			this.returnCooldown.delta() > 0) {
			this.currentAnim = this.anims.idle;
		}
	},

	handleFistAttacking: function() {
		if (this.primary == 'fist' && ig.input.pressed('primary') && this.attackCooldown.delta() > 0) {
			if(this.currentAnim == this.anims.up ||
				this.currentAnim == this.anims.idleUp) {
				if (this.firefistLevel == 0) {
					this.currentAnim = this.anims.fist1AttackUp;
				}
				else if(this.firefistLevel >= 1 && this.firefistLevel <= 4) {
					this.currentAnim = this.anims.fist2AttackUp;
				}
				ig.game.spawnEntity(EntityFist, this.pos.x + 15, this.pos.y - 20,
					{vel: {x:0, y:0}, "firefistLevel":this.firefistLevel});
			}
			else if(this.currentAnim == this.anims.down ||
				this.currentAnim == this.anims.idle) {
				if (this.firefistLevel == 0) {
					this.currentAnim = this.anims.fist1AttackDown;
				}
				else if(this.firefistLevel >= 1 && this.firefistLevel <= 4) {
					this.currentAnim = this.anims.fist2AttackDown;
				}
				ig.game.spawnEntity(EntityFist, this.pos.x, this.pos.y + 20,
					{vel: {x:0, y:0}, "firefistLevel":this.firefistLevel});
			}
			else if(this.currentAnim == this.anims.right ||
				this.currentAnim == this.anims.idleRight) {
				if (this.firefistLevel == 0) {
					this.currentAnim = this.anims.fist1AttackRight;
				}
				else if(this.firefistLevel >= 1 && this.firefistLevel <= 4) {
					this.currentAnim = this.anims.fist2AttackRight;
				}
				ig.game.spawnEntity(EntityFist, this.pos.x + 25, this.pos.y + 5,
					{vel: {x:0, y:0}, "firefistLevel":this.firefistLevel});
			}
			else if(this.currentAnim == this.anims.left ||
				this.currentAnim == this.anims.idleLeft) {
				if (this.firefistLevel == 0) {
					this.currentAnim = this.anims.fist1AttackLeft;
				}
				else if(this.firefistLevel >= 1 && this.firefistLevel <= 4) {
					this.currentAnim = this.anims.fist2AttackLeft;
				}
				ig.game.spawnEntity(EntityFist, this.pos.x - 15, this.pos.y,
					{vel: {x:0, y:0}, "firefistLevel":this.firefistLevel});
			}
			this.attackCooldown.set(.4);
			this.moveCooldown.set(.2);
			this.returnCooldown.set(.2);
		}
	},

	handleFistEndAnimation: function() {
		if ((this.currentAnim == this.anims.fist1AttackLeft || 
			this.currentAnim == this.anims.fist2AttackLeft ||
			this.currentAnim == this.anims.fist3AttackLeft) && 
			this.returnCooldown.delta() > 0) {
			this.currentAnim = this.anims.idleLeft;
		}
		else if ((this.currentAnim == this.anims.fist1AttackRight || 
			this.currentAnim == this.anims.fist2AttackRight ||
			this.currentAnim == this.anims.fist3AttackRight) && 
			this.returnCooldown.delta() > 0) {
			this.currentAnim = this.anims.idleRight;
		}
		else if ((this.currentAnim == this.anims.fist1AttackUp || 
			this.currentAnim == this.anims.fist2AttackUp ||
			this.currentAnim == this.anims.fist3AttackUp) && 
			this.returnCooldown.delta() > 0) {
			this.currentAnim = this.anims.idleUp;
		}
		else if ((this.currentAnim == this.anims.fist1AttackDown || 
			this.currentAnim == this.anims.fist2AttackDown ||
			this.currentAnim == this.anims.fist3AttackDown) && 
			this.returnCooldown.delta() > 0) {
			this.currentAnim = this.anims.idle;
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
				ig.game.keyController.addKeyEntityToPickedUpList(key.name);
				key.kill();
				this.keyCount++;
				ig.game.coinSound.play();
			}
		}
	},

	handleWeaponUpgrading: function() {
		this.upgradePrimaryWeapons();
		this.upgradeSecondaryWeapons();
	},

	upgradePrimaryWeapons: function() {
		this.upgradeSword();
		this.upgradeFist();
	},

	upgradeSecondaryWeapons: function() {
		this.upgradeBow();
		this.upgradeBoomerang();
		this.upgradeGrapplingHook();
		this.upgradeMagicCloak();
		this.upgradeMagicWand();
	},

	upgradeSword: function() {
		var primaryBlacksmiths = ig.game.getEntitiesByType(EntityPrimaryBlacksmith);
		for (var i=0; i < primaryBlacksmiths.length; i++) {
			var primaryBlacksmith = primaryBlacksmiths[i];
			if(this.touches(primaryBlacksmith) && this.primary == 'sword') {
				if(this.swordLevel == 0 && this.coinCount >= 1 && ig.input.pressed('action')) {
					this.swordLevel = 1;
					this.coinCount = this.coinCount - 1;
				}
				else if(this.swordLevel == 1 && this.coinCount >= 50 && ig.input.pressed('action')) {
					this.swordLevel = 2;
					this.coinCount = this.coinCount - 50;
				}
				else if(this.swordLevel == 2 && this.coinCount >= 100 && ig.input.pressed('action')) {
					this.swordLevel = 3;
					this.coinCount = this.coinCount - 100
				}
				else if(this.swordLevel == 3 && this.coinCount >= 250 && ig.input.pressed('action')) {
					this.swordLevel = 4;
					this.coinCount = this.coinCount - 250;
				}
				else if(this.swordLevel == 4 && this.coinCount >= 500 && ig.input.pressed('action')) {
					this.swordLevel = 5;
					this.coinCount = this.coinCount - 500;
					this.speed = 200;
				}
			}
		}
		
	},

	upgradeFist: function() {
		var primaryBlacksmiths = ig.game.getEntitiesByType(EntityPrimaryBlacksmith);
		for (var i=0; i < primaryBlacksmiths.length; i++) {
			var primaryBlacksmith = primaryBlacksmiths[i];
			if(this.touches(primaryBlacksmith) && this.primary == 'fist') {
				if(this.firefistLevel == 0 && this.coinCount >= 1 && ig.input.pressed('action')) {
					this.firefistLevel = 1;
					this.coinCount = this.coinCount - 1;
				}
				else if(this.firefistLevel == 1 && this.coinCount >= 50 && ig.input.pressed('action')) {
					this.firefistLevel = 2;
					this.coinCount = this.coinCount - 50;
				}
				else if(this.firefistLevel == 2 && this.coinCount >= 100 && ig.input.pressed('action')) {
					this.firefistLevel = 3;
					this.coinCount = this.coinCount - 100
				}
				else if(this.firefistLevel == 3 && this.coinCount >= 250 && ig.input.pressed('action')) {
					this.firefistLevel = 4;
					this.coinCount = this.coinCount - 250;
				}
				else if(this.firefistLevel == 4 && this.coinCount >= 500 && ig.input.pressed('action')) {
					this.firefistLevel = 5;
					this.coinCount = this.coinCount - 500;
					this.primary = 'firefist';
				}
			}
		}

	},
	
	upgradeBow: function() {
		var secondaryBlacksmiths = ig.game.getEntitiesByType(EntitySecondaryBlacksmith);
		for (var i=0; i < secondaryBlacksmiths.length; i++) {
			var secondaryBlacksmith = secondaryBlacksmiths[i];
			if(this.touches(secondaryBlacksmith) && this.secondary == 'bow') {
				if(this.bowLevel == 0 && this.coinCount >= 1 && ig.input.pressed('action')) {
					this.bowLevel = 1;
					this.coinCount = this.coinCount - 1;
				}
				else if(this.bowLevel == 1 && this.coinCount >= 50 && ig.input.pressed('action')) {
					this.bowLevel = 2;
					this.coinCount = this.coinCount - 50;
				}
				else if(this.bowLevel == 2 && this.coinCount >= 100 && ig.input.pressed('action')) {
					this.bowLevel = 3;
					this.coinCount = this.coinCount - 100
				}
				else if(this.bowLevel == 3 && this.coinCount >= 250 && ig.input.pressed('action')) {
					this.bowLevel = 4;
					this.coinCount = this.coinCount - 250;
				}
				else if(this.bowLevel == 4 && this.coinCount >= 500 && ig.input.pressed('action')) {
					this.bowLevel = 5;
					this.coinCount = this.coinCount - 500;
				}
			}
		}
	},

	upgradeMagicWand: function() {
		var secondaryBlacksmiths = ig.game.getEntitiesByType(EntitySecondaryBlacksmith);
		for (var i=0; i < secondaryBlacksmiths.length; i++) {
			var secondaryBlacksmith = secondaryBlacksmiths[i];
			if(this.touches(secondaryBlacksmith) && this.secondary == 'magicwand') {
				if(this.magicwandLevel == 0 && this.coinCount >= 1 && ig.input.pressed('action')) {
					this.magicwandLevel = 1;
					this.coinCount = this.coinCount - 1;
				}
				else if(this.magicwandLevel == 1 && this.coinCount >= 50 && ig.input.pressed('action')) {
					this.magicwandLevel = 2;
					this.coinCount = this.coinCount - 50;
				}
				else if(this.magicwandLevel == 2 && this.coinCount >= 100 && ig.input.pressed('action')) {
					this.magicwandLevel = 3;
					this.coinCount = this.coinCount - 100
				}
				else if(this.magicwandLevel == 3 && this.coinCount >= 250 && ig.input.pressed('action')) {
					this.magicwandLevel = 4;
					this.coinCount = this.coinCount - 250;
				}
				else if(this.magicwandLevel == 4 && this.coinCount >= 500 && ig.input.pressed('action')) {
					this.magicwandLevel = 5;
					this.coinCount = this.coinCount - 500;
				}
			}
		}
	},
	
	upgradeBoomerang: function() {
		var secondaryBlacksmiths = ig.game.getEntitiesByType(EntitySecondaryBlacksmith);
		for (var i=0; i < secondaryBlacksmiths.length; i++) {
			var secondaryBlacksmith = secondaryBlacksmiths[i];
			if(this.touches(secondaryBlacksmith) && this.secondary == 'boomerang') {
				if(this.boomerangLevel == 0 && this.coinCount >= 1 && ig.input.pressed('action')) {
					this.boomerangLevel = 1;
					this.coinCount = this.coinCount - 1;
				}
				else if(this.boomerangLevel == 1 && this.coinCount >= 50 && ig.input.pressed('action')) {
					this.boomerangLevel = 2;
					this.coinCount = this.coinCount - 50;
				}
				else if(this.boomerangLevel == 2 && this.coinCount >= 100 && ig.input.pressed('action')) {
					this.boomerangLevel = 3;
					this.coinCount = this.coinCount - 100
				}
				else if(this.boomerangLevel == 3 && this.coinCount >= 250 && ig.input.pressed('action')) {
					this.boomerangLevel = 4;
					this.coinCount = this.coinCount - 250;
				}
				else if(this.boomerangLevel == 4 && this.coinCount >= 500 && ig.input.pressed('action')) {
					this.boomerangLevel = 5;
					this.coinCount = this.coinCount - 500;
				}
			}
		}
	},
	
	upgradeGrapplingHook: function() {
		var secondaryBlacksmiths = ig.game.getEntitiesByType(EntitySecondaryBlacksmith);
		for (var i=0; i < secondaryBlacksmiths.length; i++) {
			var secondaryBlacksmith = secondaryBlacksmiths[i];
			if(this.touches(secondaryBlacksmith) && this.secondary == 'grapplinghook') {
				if(this.grapplinghookLevel == 0 && this.coinCount >= 1 && ig.input.pressed('action')) {
					this.grapplinghookLevel = 1;
					this.coinCount = this.coinCount - 1;
				}
				else if(this.grapplinghookLevel == 1 && this.coinCount >= 50 && ig.input.pressed('action')) {
					this.grapplinghookLevel = 2;
					this.coinCount = this.coinCount - 50;
				}
				else if(this.grapplinghookLevel == 2 && this.coinCount >= 100 && ig.input.pressed('action')) {
					this.grapplinghookLevel = 3;
					this.coinCount = this.coinCount - 100
				}
				else if(this.grapplinghookLevel == 3 && this.coinCount >= 250 && ig.input.pressed('action')) {
					this.grapplinghookLevel = 4;
					this.coinCount = this.coinCount - 250;
				}
				else if(this.grapplinghookLevel == 4 && this.coinCount >= 500 && ig.input.pressed('action')) {
					this.grapplinghookLevel = 5;
					this.coinCount = this.coinCount - 500;
				}
			}
		}
	},
	
	upgradeMagicCloak: function() {
		var secondaryBlacksmiths = ig.game.getEntitiesByType(EntitySecondaryBlacksmith);
		for (var i=0; i < secondaryBlacksmiths.length; i++) {
			var secondaryBlacksmith = secondaryBlacksmiths[i];
			if(this.touches(secondaryBlacksmith) && this.secondary == 'magiccloak') {
				if(this.magiccloakLevel == 0 && this.coinCount >= 1 && ig.input.pressed('action')) {
					this.magiccloakLevel = 1;
					this.coinCount = this.coinCount - 1;
				}
				else if(this.magiccloakLevel == 1 && this.coinCount >= 50 && ig.input.pressed('action')) {
					this.magiccloakLevel = 2;
					this.coinCount = this.coinCount - 50;
				}
				else if(this.magiccloakLevel == 2 && this.coinCount >= 100 && ig.input.pressed('action')) {
					this.magiccloakLevel = 3;
					this.coinCount = this.coinCount - 100
				}
				else if(this.magiccloakLevel == 3 && this.coinCount >= 250 && ig.input.pressed('action')) {
					this.magiccloakLevel = 4;
					this.coinCount = this.coinCount - 250;
				}
				else if(this.magiccloakLevel == 4 && this.coinCount >= 500 && ig.input.pressed('action')) {
					this.magiccloakLevel = 5;
					this.coinCount = this.coinCount - 500;
				}
			}
		}
	},


	check: function(other) {
		if(!(other instanceof EntityPeg || other instanceof EntityIceball || other instanceof EntityBossShadow)) {
			this.receiveDamage(30, other);
		}
	},

	receivePureDamage: function(amount, from) {
		if(this.health - amount <= 0) {
			this.receiveDamage(amount, from);
		} else {
			this.health -= amount;
		}
	},

	receiveDamage: function(amount, from) {
		if(this.invulnerableTimer.delta() > 0) {
			var isMagic = from instanceof EntityFireball 
						|| from instanceof EntityElectricball 
						|| from instanceof EntityEnergybombardment
						|| from instanceof EntityEnergyball
						|| from instanceof EntityEnergybeam;
			if(!isMagic || (isMagic && !this.shielded)) {
				if(this.health - amount <= 0 && ig.game.arenaController.arenaIsActive) {
					ig.game.arenaController.endArenaMatch();
				} else if(this.health - amount <= 0) {
					this.pos.x = 200;
					this.pos.y = 200;
					ig.game.addMessage("You have died, enemies looted half your gold");
					this.coinCount = Math.floor(this.coinCount/2);
					this.health = 1000;
					this.updateController();
					ig.game.playerController.storeSettings();
					ig.music.play('title');
					ig.game.myDirector.jumpTo(LevelTest);
				} else {
					this.parent(amount, from);
					this.invulnerableTimer.set(this.invulnerableDuration);
					this.knockbackTimer.set(0.15);
					this.knockbackAngle = this.angleTo(from) + Math.PI;
					ig.game.hitSound.play();
				}
			}
		} else {
			if (from instanceof EntityElectricball) {
				this.knockbackTimer.set(0.15);
				this.knockbackAngle = this.angleTo(from) + Math.PI;
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
	setDestination: function(posx, posy) {
		this.destination['x'] = posx;
		this.destination['y'] = posy;
	},
	stopGrappling: function() {
		this.state = this.States.fullcontrol;
	},

	draw: function() {
		if(this.inGame) {
			this.parent();
		}
	},

	handleMovementTrace: function( res ) {
    	if(this.state == this.States.grappling) {
    	// This completely ignores the trace result (res) and always
    	// moves the entity according to its velocity
    		this.collides = ig.Entity.COLLIDES.NONE;
    		this.pos.x += this.vel.x * ig.system.tick;
    		this.pos.y += this.vel.y * ig.system.tick;
    	} else {
    		this.collides = ig.Entity.COLLIDES.PASSIVE;
    		this.parent(res);
    	}
	},

	getHealth: function() {
		return this.health;
	},
	setHealth: function(myhealth) {
		this.health = myhealth;
	},

	healBy: function(amount) {
		this.health += amount;
		if(this.health > this.maxHealth)
			this.health = this.maxHealth;
		ig.game.spawnEntity(EntityHealparticle, this.pos.x, this.pos.y);

	},


	getCoinCount: function() {
		return this.coinCount;
	},

	setCoinCount: function(amount) {
		this.coinCount = amount;
	},

	addCoins: function(amount) {
		this.coinCount += amount;
	},

	//This returns true if the player has the coins to remove, and removes them.
	//If the player doesn't have the coins, it just returns false.
	removeCoins: function(amount) {
		if(this.coinCount >= amount) {
			this.coinCount -= amount;
			return true;
		} else {
			return false;
		}
	},

	getKeyCount: function() {
		return this.keyCount;
	},

	setKeyCount: function(myKeyCount) {
		this.keyCount = myKeyCount;
	},

	//Getter and setters for primary and secondary equipment selection
	getPrimary: function() {
		return this.primary;
	},

	setPrimary: function(myPrimary) {
		this.primary = myPrimary;
	},

	getSecondary: function() {
		return this.secondary;
	},

	setSecondary: function(mySecondary) {
		this.secondary = mySecondary;
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
	}

});

});