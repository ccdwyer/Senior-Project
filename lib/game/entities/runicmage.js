ig.module(
	'game.entities.runicmage'
)
.requires(
	'impact.entity'
)
.defines(function(){


EntityRunicmage = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,

	size: {x: 64, y: 64},
	health: 15000,

	animSheet: new ig.AnimationSheet( 'media/runicmage.png', 64, 64),

	init: function(x, y, settings) {
		this.parent( x, y, settings );
		this.addAnimations();
		this.addSpellTimers();
		this.maxHealth = this.health;
		this.inGame = true;
		this.killMe = false;
		this.isActive = false;
		this.vel.x = 0;
		this.vel.y = 0;
		this.currentLocation = 1;
		this.invulnerableTimer = new ig.Timer(0);
		this.bombAndTeleportTimer = new ig.Timer(30);
		this.addLocations();
		this.hitNumber = 0;
	},

	addLocations: function() {
		this.locations = [];
		this.locations.push({"x": 272, "y": 96});
		this.locations.push({"x": 432, "y": 96});
		this.locations.push({"x": 592, "y": 96});
		this.locations.push({"x": 752, "y": 96});
		this.locations.push({"x": 272, "y": 416});
		this.locations.push({"x": 432, "y": 416});
		this.locations.push({"x": 592, "y": 416});
		this.locations.push({"x": 752, "y": 416});
		this.bombLocations = [];
		this.bombLocations.push({"x": 288, "y": 192});
		this.bombLocations.push({"x": 448, "y": 192});
		this.bombLocations.push({"x": 608, "y": 192});
		this.bombLocations.push({"x": 768, "y": 192});
		this.bombLocations.push({"x": 288, "y": 352});
		this.bombLocations.push({"x": 448, "y": 352});
		this.bombLocations.push({"x": 608, "y": 352});
		this.bombLocations.push({"x": 768, "y": 352});

	},

	ready: function() {
		this.thePlayer = ig.game.playerController.playerCharacter;
		this.checkIfDead();
		if(this.killMe) {
			this.kill();
			ig.game.spawnEntity(EntityElectricball, this.locations[1].x, this.locations[1].y);
		}
	},

	checkIfDead: function() {
		if(ig.game.doorController.isDoorInUnlockedList(this.name))
			this.killMe = true;
	},

	addAnimations: function() {
		// idle animation
		this.addAnim('facingdown', 1, [0] );
		this.addAnim('facingdownempowered', 1, [8] );
		this.addAnim('facingup', 1, [4] );
		this.addAnim('facingupempowered', 1, [14] );

		this.currentAnim = this.anims.facingdown;
	},

	addSpellTimers: function() {
		this.bombTimer = new ig.Timer(15);
	},

	update: function() {
		if (this.inGame && this.isActive) {
			this.parent();
			this.unpauseTimers();
			this.handleSpellCasting();
			
		} else if(this.isActive) {
			this.parent();
			this.pauseTimers();
		} else {
			this.pauseTimers();
		}
	},

	pauseTimers: function() {
		this.invulnerableTimer.pause();
	},

	unpauseTimers: function() {
		this.invulnerableTimer.unpause();
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
		if(this.invulnerableTimer.delta() >= 0) {
			this.parent(amount, from);
			this.invulnerableTimer.set(0.3);
			this.isActive = true;
			this.hitNumber++
			if(this.hitNumber >= 5) {
				this.triggerExplosion();
				if(this.currentAnim == this.anims.facingdown) this.currentAnim = this.anims.facingdownempowered;
				else if(this.currentAnim == this.anims.facingup) this.currentAnim = this.anims.facingupempowered;
			}
		}
	},

	triggerExplosion: function() {
		ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: 70, 
				   y: 0}, damage: 75});
		ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: -70, 
				   y: 0}, damage: 75});
		ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: 0, 
				   y: 70}, damage: 75});
		ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: 0, 
				   y: -70}, damage: 75});
		ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: 35, 
				   y: 35}, damage: 75});
		ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: -35, 
				   y: 35}, damage: 75});
		ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: 35, 
				   y: -35}, damage: 75});
		ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: -35, 
				   y: -35}, damage: 75});
		if(this.hitNumber >= 10) {
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: -17.5, 
				   y: -52.5}, damage: 75});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: 17.5, 
				   y: -52.5}, damage: 75});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: -17.5, 
				   y: 52.5}, damage: 75});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: 17.5, 
				   y: 52.5}, damage: 75});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: 52.5, 
				   y: 17.5}, damage: 75});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: 52.5, 
				   y: -17.5}, damage: 75});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: -52.5, 
				   y: 17.5}, damage: 75});
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y+20, 
			{vel: {x: -52.5, 
				   y: -17.5}, damage: 75});

		}
	},

	handleSpellCasting: function(player) {
		this.handleTeleportAndBomb();
	},

	handleTeleportAndBomb: function() {
		if(this.bombAndTeleportTimer.delta() > 0) {
			this.currentLocation = Math.floor(Math.random()*8);
			this.pos.x = this.locations[this.currentLocation].x;
			this.pos.y = this.locations[this.currentLocation].y;
			this.bombAndTeleportTimer.set(20);
			this.hitNumber = 0;
			if(this.currentLocation < 4) {
				this.currentAnim = this.anims.facingdown;
			} else {
				this.currentAnim = this.anims.facingup;
			}

			var electricBalls = ig.game.getEntitiesByType(EntityElectricball);
			for (i=0; i < electricBalls.length; i++) {
				electricBalls[i].kill();
			}

			for (var i = this.locations.length - 1; i >= 0; i--) {
				if(i != this.currentLocation) {
					ig.game.spawnEntity(EntityElectricball, this.locations[i].x, this.locations[i].y);
					ig.game.spawnEntity(EntityTimebomb, this.bombLocations[i].x, this.bombLocations[i].y)
				}
			};
		}
	},

	kill: function() {
		if(!ig.game.doorController.isDoorInUnlockedList(this.name)) {
			ig.game.doorController.addDoorEntityToUnlockedList(this.name);
		}
		var doors = ig.game.getEntitiesByType(EntityDoor);
		for (i=0; i < doors.length; i++) {
			doors[i].kill();
		}
		this.parent();
	}

});

});