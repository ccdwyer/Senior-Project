ig.module(
	'game.entities.astralbody'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityAstralbody = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,

	size: {x: 50, y: 70},
	health: 50,

	animSheet: new ig.AnimationSheet( 'media/astralbody.png', 100, 100),

	init: function(x, y, settings) {
		this.parent( x, y, settings );
		this.addBaseValues();
		this.addAnimations();
		this.addTimers();
	},

	addBaseValues: function() {
		this.States = { "ready" : 0,
						"shielding" : 1,
						"moving" : 2,
						"doneMoving" : 3,
						"waitingForPlayer" : 4 };
		this.state = this.States.waitingForPlayer;
		this.maxVel.x = 1600;
		this.maxVel.y = 1600;
		this.offset.y = 15;
		this.offset.x = 24;
		this.inGame = true;
		this.killMe = false;
		this.firstUpdate = true;
		this.name = "astralbody";
	},

	addAnimations: function() {
		// idle animation
		this.addAnim('ready', 1, [0] );
		this.addAnim('shielded', 1, [1] );
		this.addAnim('traveling', 1, [2] );
	},

	addTimers: function() {
		this.invulnerableTimer = new ig.Timer(0);
		this.movementTimer = new ig.Timer(30);

		//skill timers
		this.spellTimer = new ig.Timer(3)
		this.energyTrapTimer = new ig.Timer(90);
		this.energyBallTimer = new ig.Timer(60);
		this.volleyTimer = new ig.Timer(30);
		this.explosionTimer = new ig.Timer(15);
	},

	checkIfDead: function() {
		if(ig.game.doorController.isDoorInUnlockedList(this.name))
			this.killMe = true;
	},

	update: function() {
		if(this.firstUpdate) {
			this.thePlayer = ig.game.playerController.playerCharacter;
			this.checkIfDead();
			this.firstUpdate = false;
		}
		if(this.killMe)
			this.kill();
		if (this.inGame) {
			this.parent();
			this.unpauseTimers();
			if(this.state == this.States.waitingForPlayer && this.distanceTo(this.thePlayer) < 250) {
					this.state = this.States.ready;
			}
			if(this.state != this.States.waitingForPlayer) {
				this.handleCombat();
			}
		} else {
			this.pauseTimers();
		}
	},

	handleCombat: function() {

	},

	unpauseTimers: function() {
		this.invulnerableTimer.unpause();
		this.movementTimer.unpause();
		this.spellTimer.unpause();
		this.energyTrapTimer.unpause();
		this.energyBallTimer.unpause();
		this.volleyTimer.unpause();
		this.explosionTimer.unpause();
	},

	pauseTimers: function() {
		this.invulnerableTimer.pause();
		this.movementTimer.pause();
		this.spellTimer.pause();
		this.energyTrapTimer.pause();
		this.energyBallTimer.pause();
		this.volleyTimer.pause();
		this.explosionTimer.pause();
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	handleMovement: function(player) {
		
		if(this.distanceTo(player) < 400) {
			this.vel.x = 1 * Math.cos(this.angleTo(player)) * 70;
			this.vel.y = 1 * Math.sin(this.angleTo(player)) * 70;
			if(this.isCharging) {
				this.vel.x = 1 * Math.cos(this.angleTo(player)) * 110;
				this.vel.y = 1 * Math.sin(this.angleTo(player)) * 110;
			}
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
	},

	receiveDamage: function(amount, from) {
		if(this.invulnerableTimer.delta() > 0) {
			this.parent(amount, from);
			this.invulnerableTimer.set(0.2);
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