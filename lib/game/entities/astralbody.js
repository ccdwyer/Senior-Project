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
	health: 5000,

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
		this.hasMoved = false;
		this.name = "astralbody";
	},

	addAnimations: function() {
		// idle animation
		this.addAnim('ready', 1, [0] );
		this.addAnim('shielded', 1, [1] );
		this.addAnim('moving', 1, [2] );
	},

	addTimers: function() {
		this.invulnerableTimer = new ig.Timer(0);
		this.movementTimer = new ig.Timer(30);
		this.timeUntilMoveOrExpose = new ig.Timer(0);

		//skill timers
		this.spellTimer = new ig.Timer(3)
		this.energyTrapTimer = new ig.Timer(90);
		this.energyBallTimer = new ig.Timer(20);
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
			if(this.state == this.States.ready) {
				this.handleCombat();
			} 
			this.handleMovement();
			
		} else {
			this.pauseTimers();
		}
	},

	handleCombat: function() {
		if(this.movementTimer.delta() > 0) {
			this.state = this.States.shielding;
			this.currentAnim = this.anims.shielded;
			this.timeUntilMoveOrExpose.set(1);
			this.hasMoved = false;
			this.invulnerableTimer.set(20);
		} else if (this.spellTimer.delta() > 0) {
			if(this.energyTrapTimer.delta() > 0) {
				//create energy trap
				if(this.health > 2500)
					this.energyTrapTimer.set(90);
				else
					this.energyTrapTimer.set(60);
				this.spellTimer.set(1);
			} else if(this.energyBallTimer.delta() > 0) {
				//create energy ball
				this.handleEnergyBallSpell();
			} else if(this.volleyTimer.delta() > 0) {
				this.handleVolleySpell();
			} else if(this.explosionTimer.delta() > 0) {
				this.handleExplosionSpell();
			}
		}
	},

	handleEnergyBallSpell: function() {
		ig.game.spawnEntity(EntityEnergyball, this.pos.x+20, this.pos.y+20);
		if(this.health > 3500)
			this.energyBallTimer.set(15);
		else if(this.health > 2250)
			this.energyBallTimer.set(10);
		else if(this.health > 1125)
			this.energyBallTimer.set(5);
		else
			this.energyBallTimer.set(3);
		this.spellTimer.set(.5);
	},

	handleVolleySpell: function() {
		ig.game.spawnEntity(EntityEnergybeam, this.pos.x+20, this.pos.y+20, 
			{vel: {x: 300, 
					y: 300}});
		ig.game.spawnEntity(EntityEnergybeam, this.pos.x+20, this.pos.y+20, 
			{vel: {x: -300, 
					y: 300}});
		ig.game.spawnEntity(EntityEnergybeam, this.pos.x+20, this.pos.y+20, 
			{vel: {x: 300, 
					y: -300}});
		ig.game.spawnEntity(EntityEnergybeam, this.pos.x+20, this.pos.y+20, 
			{vel: {x: -300, 
					y: -300}});

		if(this.health > 3700)
			this.volleyTimer.set(25);
		else if(this.health > 2500)
			this.volleyTimer.set(12);
		else
			this.volleyTimer.set(8);
		this.spellTimer.set(1);
	},

	handleExplosionSpell: function() {
		ig.game.spawnEntity(EntityEnergybeam, this.pos.x+20, this.pos.y+20, 
			{vel: {x: 300, 
					y: 300}, hasAimed: true});
		ig.game.spawnEntity(EntityEnergybeam, this.pos.x+20, this.pos.y+20, 
			{vel: {x: -300, 
					y: 300}, hasAimed: true});
		ig.game.spawnEntity(EntityEnergybeam, this.pos.x+20, this.pos.y+20, 
			{vel: {x: 300, 
					y: -300}, hasAimed: true});
		ig.game.spawnEntity(EntityEnergybeam, this.pos.x+20, this.pos.y+20, 
			{vel: {x: -300, 
					y: -300}, hasAimed: true});
		ig.game.spawnEntity(EntityEnergybeam, this.pos.x+20, this.pos.y+20, 
			{vel: {x: -424, 
					y: 0}, hasAimed: true});
		ig.game.spawnEntity(EntityEnergybeam, this.pos.x+20, this.pos.y+20, 
			{vel: {x: 424, 
					y: 0}, hasAimed: true});
		ig.game.spawnEntity(EntityEnergybeam, this.pos.x+20, this.pos.y+20, 
			{vel: {x: 0, 
					y: 424}, hasAimed: true});
		ig.game.spawnEntity(EntityEnergybeam, this.pos.x+20, this.pos.y+20, 
			{vel: {x: 0, 
					y: -424}, hasAimed: true});
		if(this.health > 3500)
			this.explosionTimer.set(12);
		else if(this.health > 2000)
			this.explosionTimer.set(6);
		else
			this.explosionTimer.set(3);
		this.spellTimer.set(1);
	},

	unpauseTimers: function() {
		this.invulnerableTimer.unpause();
		this.movementTimer.unpause();
		this.spellTimer.unpause();
		this.energyTrapTimer.unpause();
		this.energyBallTimer.unpause();
		this.volleyTimer.unpause();
		this.explosionTimer.unpause();
		this.timeUntilMoveOrExpose.unpause();
	},

	pauseTimers: function() {
		this.invulnerableTimer.pause();
		this.movementTimer.pause();
		this.spellTimer.pause();
		this.energyTrapTimer.pause();
		this.energyBallTimer.pause();
		this.volleyTimer.pause();
		this.explosionTimer.pause();
		this.timeUntilMoveOrExpose.pause();
	},

	draw: function() {
		if (this.inGame) {
			this.parent();
		}
	},

	handleMovement: function(player) {
		if(this.state == this.States.shielding && this.timeUntilMoveOrExpose.delta() > 0 && !this.hasMoved) {
			this.state = this.States.moving;
			this.currentAnim = this.anims.moving;
			this.destinationx = Math.floor(Math.random()*1000 + 500);
			this.destinationy = Math.floor(Math.random()*550 + 150);
			this.currentAnim.angle = Math.atan2(this.destinationy - this.pos.y, this.destinationx - this.pos.x);
			this.vel.y = Math.sin(Math.atan2(this.destinationy - this.pos.y, this.destinationx - this.pos.x)) * 400;
			this.vel.x = Math.cos(Math.atan2(this.destinationy - this.pos.y, this.destinationx - this.pos.x)) * 400;
		} 
		if(this.state == this.States.moving && !this.hasMoved) {
			if(Math.abs(this.pos.y-this.destinationy) + Math.abs(this.pos.x-this.destinationx) < 30) {
				this.state = this.States.shielding;
				this.timeUntilMoveOrExpose.set(1);
				this.currentAnim = this.anims.shielded;
				this.hasMoved = true;
				this.vel.x = 0;
				this.vel.y = 0;
			}
		} 
		if(this.hasMoved && this.state == this.States.shielding && this.timeUntilMoveOrExpose.delta() > 0) {
			this.state = this.States.ready;
			this.currentAnim = this.anims.ready;
			this.movementTimer.set(30);
			this.invulnerableTimer.set(0);
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
		var energyballs = ig.game.getEntitiesByType(EntityEnergyball);
		for (i=0; i < energyballs.length; i++) {
			energyballs[i].kill();
		}


	}

});

});