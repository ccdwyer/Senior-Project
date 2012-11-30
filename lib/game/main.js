ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	// Director plugin, used for transitioning from level to level
	'plugins.director.director',

	// Player
	'game.entities.player',

	// Save/Load
	'game.database.save',
	'game.database.load',

	//Controllers
	'game.director.player-controller',
	'game.director.door-controller',
	'game.director.key-controller',
	'game.director.chest-controller',
	'game.director.portal-controller',

	//Player Weapon
	'game.entities.sword',
	'game.entities.fist',

	//Player Equipment
	'game.entities.boomerang',
	'game.entities.grapplinghook',
	'game.entities.playerarrow',
	'game.entities.arcaneblock',

	//Player Projectiles
	'game.entities.firefistprojectile',

	//Blacksmiths
	'game.entities.primaryBlacksmith',
	'game.entities.secondaryBlacksmith',

	//Enemies
	'game.entities.mage',
	'game.entities.archer',
	'game.entities.goblin',
	'game.entities.slimer',
	'game.entities.clonercrystal',
	'game.entities.explodercrystal',
	'game.entities.rogue',

	//Bosses
	'game.entities.astralbody',
	'game.entities.goblinking',

	//Enemy projectiles
	'game.entities.fireball',
	'game.entities.arrow',

	//Astral Body abilities
	'game.entities.energybeam',
	'game.entities.energytrace',
	'game.entities.energyball',
	'game.entities.energybombardment',
	'game.entities.energybombardmenttarget',

	//Other Entities
	'game.entities.key',
	'game.entities.coin',
	'game.entities.door',
	'game.entities.upFloorTrigger',
	'game.entities.downFloorTrigger',
	'game.entities.peg',
	'game.entities.healthkit',
	'game.entities.treasurechest',
	'game.entities.button',
	'game.entities.iceball',
	'game.entities.electricball',
	'game.entities.arcanebutton',
	'game.entities.arcanedoor',
	'game.entities.healparticle',
	'game.entities.messenger',
	'game.entities.portal',

	//Levels
	'game.levels.welcome',
	//Town
	'game.levels.test',
	//Sword only levels
	'game.levels.level1',
	'game.levels.level2',
	'game.levels.level3',
	'game.levels.test2',
	'game.levels.swordonly1',
	'game.levels.swordonly2',
	//Boomerang levels
	'game.levels.boomerang1',
	'game.levels.boomerang2',
	'game.levels.boomerang3',
	'game.levels.goblinking',
	//Bow levels
	'game.levels.bow1',
	'game.levels.bow2',
	'game.levels.bow3',
	'game.levels.bow4',
	'game.levels.bow5',
	//Firefist levels
	'game.levels.firefist1',
	'game.levels.firefist2',
	'game.levels.firefist3',
	//Grappling hook levels
	'game.levels.runicmage',
	//Magiccloak levels
	//magicwand levels
	'game.levels.test3',
	'game.levels.astralbody'

	//'game.levels.explore1',
	//'game.levels.explore2',
	//'game.levels.explore3',
	//'game.levels.explore4'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/plainfont.png' ),
	
	
	init: function() {
		this.initializeControls();
		this.loadImages();
		this.initializeStates();
		this.playerController = new ig.PlayerController();
		this.doorController = new ig.DoorController();
		this.keyController = new ig.KeyController();
		this.chestController = new ig.ChestController();
		this.portalController = new ig.PortalController();
		this.inventoryImage = new ig.Image( 'media/inventorylarge.png' );

		this.messageToDisplay = "";
		this.messageQueue = [];
		this.messageTimer = new ig.Timer(0);
		this.messageDuration = 2;
		// Load levels into Director for level transitions
		this.myDirector = new ig.Director(this, [LevelWelcome, LevelTest, 
												LevelLevel1, LevelLevel2, LevelLevel3, LevelTest2, LevelSwordonly1, LevelSwordonly2, 
												LevelBoomerang1, LevelBoomerang2, LevelBoomerang3, LevelGoblinking,
												LevelBow1, LevelBow2, LevelBow3, LevelBow4, LevelBow5,
												LevelFirefist1, LevelFirefist2, LevelFirefist3,
												//LevelRunicmage, //Fist levels
												LevelTest3, LevelAstralbody]);
		// Load initial level
		this.loadLevel( LevelTest );
		if( ig.ua.mobile ) {
    		ig.Sound.enabled = false;
		}

		if(this.isUsingInternetExplorer()) {
			this.addMessage("Use Chrome or Firefox for higher quality audio");
			ig.music.add( 'music/title.mp3', 'title' );
			ig.music.add( 'music/goblinking.mp3', 'goblinking');
			ig.music.add( 'music/astralbody.mp3', 'astralbody');
			
			this.rangedUseSound = new ig.Sound('media/sfx/rangeduse.mp3');
			this.hitSound = new ig.Sound('media/sfx/hit.mp3');
			this.coinSound = new ig.Sound('media/sfx/coin.mp3');
			this.explosionSound = new ig.Sound('media/sfx/explosion.mp3');
			this.healSound = new ig.Sound('media/sfx/heal.mp3');
		} else {
			ig.music.add( 'music/title.ogg', 'title' );
			ig.music.add( 'music/goblinking.ogg', 'goblinking');
			ig.music.add( 'music/astralbody.ogg', 'astralbody');
			
			this.rangedUseSound = new ig.Sound('media/sfx/rangeduse.ogg');
			this.hitSound = new ig.Sound('media/sfx/hit.ogg');
			this.coinSound = new ig.Sound('media/sfx/coin.ogg');
			this.explosionSound = new ig.Sound('media/sfx/explosion.ogg');
			this.healSound = new ig.Sound('media/sfx/heal.ogg');
		
		}
		ig.music.volume = 0.2;
		ig.music.play();
		ig.music.loop = true;
		this.hitSound.volume = 0.2;
		this.explosionSound.volume = 0.1;
		this.rangedUseSound.volume = 0.2;
		this.healSound.volume = 0.4;
		this.coinSound.volume = 0.4;
	},

	isUsingInternetExplorer: function()
	// Returns the version of Internet Explorer or a -1
	// (indicating the use of another browser).
	{
	  if (navigator.appName == 'Microsoft Internet Explorer')
	  {
	    var ua = navigator.userAgent;
	    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	    if (re.exec(ua) != null)
	      return true;
	  }
	  return false;
	},

	loadImages: function () {
		this.keyIcon = new ig.Image( 'media/key.png')
	},

	initializeControls: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.UP_ARROW, 'up');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');

		ig.input.bind( ig.KEY.P, 'pause');

		ig.input.bind( ig.KEY._1, 'sword');
		ig.input.bind( ig.KEY._2, 'fist');
		ig.input.bind( ig.KEY._3, 'boomerang');
		ig.input.bind( ig.KEY._4, 'bow');
		ig.input.bind( ig.KEY._5, 'grapplinghook');
		ig.input.bind( ig.KEY._6, 'magiccloak');
		ig.input.bind( ig.KEY._7, 'magicwand');
		
		ig.input.bind( ig.KEY.D, 'primary');
		ig.input.bind( ig.KEY.F, 'secondary');
		ig.input.bind( ig.KEY.G, 'potion');
		ig.input.bind( ig.KEY.B, 'portal');
		ig.input.bind( ig.KEY.M, 'mother');
		ig.input.bind( ig.KEY.J, 'back');
		ig.input.bind( ig.KEY.K, 'forward');

		ig.input.bind( ig.KEY.A, 'action');
	},

	initializeStates: function() {
		this.States = { "MainMenu" : 0,
						"InGame" : 1,
						"Paused" : 2,
						"Inventory" : 3};
		this.state = this.States.InGame;
		this.stateChangeCooldown = new ig.Timer(0);

		this.PauseItems = { "Resume" : 0,
							"Save" : 1};
		this.pauseItemSelected = this.PauseItems.Resume;
		this.portalTimer = new ig.Timer(0);
		this.isCastingPortal = false;
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		if(this.state == this.States.InGame) {
			this.updateGame();
		} else if (this.state == this.States.MainMenu) {

		} else if (this.state == this.States.Paused) {
			this.updatePausedGame();
		}
		// Add your own, additional update code here
	},


	updateGame: function() {
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
		if(ig.input.state('mother') && ig.input.state('potion')) {
			this.playerController.playerCharacter.swordLevel = 5;
			this.playerController.playerCharacter.firefistLevel = 5;
			this.playerController.playerCharacter.boomerangLevel = 5;
			this.playerController.playerCharacter.bowLevel = 5;
			this.playerController.playerCharacter.grapplinghookLevel = 5;
			this.playerController.playerCharacter.magiccloakLevel = 5;
			this.playerController.playerCharacter.magicwandLevel = 5;
			this.playerController.playerCharacter.potionCount = 11;
			this.playerController.playerCharacter.health = 1000;
			this.stateChangeCooldown.set(1);
		}
		if(ig.input.state('mother') && ig.input.state('back') && this.stateChangeCooldown.delta() > 0) {
			this.myDirector.previousLevel();
			this.stateChangeCooldown.set(.5);
		}
		if(ig.input.state('mother') && ig.input.state('forward') && this.stateChangeCooldown.delta() > 0) {
			this.myDirector.nextLevel();
			this.stateChangeCooldown.set(.5);
		}
		if(ig.input.state('pause') && this.stateChangeCooldown.delta() > 0) {
			this.stateChangeCooldown.set(.5);
			this.state = this.States.Paused;
			this.pauseItemSelected = this.PauseItems.Resume;
			for (var i=0; i < this.entities.length; i++)
				this.entities[i].inGame = false;
		}
		if(ig.input.state('portal') && this.stateChangeCooldown.delta() > 0 && !this.isCastingPortal) {
			this.stateChangeCooldown.set(.5);
			this.isCastingPortal = true;
			this.portalTimer.set(10);
			this.playerController.playerCharacter.state = this.playerController.playerCharacter.States.stunned;
			this.playerController.playerCharacter.vel = {x: 0, y: 0};
		}
		if(ig.input.state('portal') && this.stateChangeCooldown.delta() > 0 && this.isCastingPortal) {
			this.isCastingPortal = false;
			this.stateChangeCooldown.set(.5);
			this.playerController.playerCharacter.state = this.playerController.playerCharacter.States.fullcontrol;
		}
		if(this.isCastingPortal && this.portalTimer.delta() > 0) {
			this.playerController.playerCharacter.updateController();
			this.playerController.storeSettings();
			var pos = {x: 200, y: 200};
			this.playerController.setPosition(pos);
			ig.music.play('title');
			this.myDirector.loadLevel(1);
			this.isCastingPortal = false;
			this.playerController.playerCharacter.state = this.playerController.playerCharacter.States.fullcontrol;
		}
	},

	normalEnemyItemDrop: function(posx, posy) {
		//20% chance to drop health pack
		if(Math.floor(Math.random()*11) > 8) {
			this.spawnEntity(EntityHealthkit, posx+17, posy+17);
		}

		//50% chance to drop coins
		if(Math.floor(Math.random()*2) == 1) {
			var randomNumber = Math.floor(Math.random()*41);
			if(randomNumber <= 27) {
				this.spawnEntity(EntityCoin, posx+25, posy+25, {'amount': Math.floor(Math.random()*6+1)});
			} else if(randomNumber <= 36) {
				this.spawnEntity(EntityCoin, posx+25, posy+25, {'amount': Math.floor(Math.random()*6*3+5)});
			} else if(randomNumber <= 38) {
				this.spawnEntity(EntityCoin, posx+25, posy+25, {'amount': Math.floor(Math.random()*6*9+10)});
			} else {
				this.spawnEntity(EntityCoin, posx+25, posy+25, {'amount': Math.floor(Math.random()*6*25+25)});
			}
		}
	},

	updatePausedGame: function() {
		if(ig.input.state('pause') && this.stateChangeCooldown.delta() > 0) {
				this.stateChangeCooldown.set(.5);
				if (this.pauseItemSelected == this.PauseItems.Resume) {
					this.state = this.States.InGame;
					for (var i=0; i < this.entities.length; i++)
						this.entities[i].inGame = true;
				}
				else {
					//Save Game logic here.
				}
		} else {
			if ( (ig.input.state('down') || ig.input.state('up')) && this.stateChangeCooldown.delta() > 0)
			{
				if (this.pauseItemSelected == this.PauseItems.Resume)
					this.pauseItemSelected = this.PauseItems.Save;
				else
					this.pauseItemSelected = this.PauseItems.Resume;
				this.stateChangeCooldown.set(.5);
			}
		}
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		if(this.state == this.States.Paused) {
			this.drawPauseMenu();
		} else if(this.state == this.States.InGame && this.playerController.playerCharacter) {
			//var playerHealthString = "Player Health: " + this.playerController.playerCharacter.health;
			//this.font.draw(playerHealthString, 10, 10, ig.Font.ALIGN.LEFT);

			var playerKeyCountString = ":" + this.playerController.playerCharacter.keyCount;
			this.keyIcon.draw(10,33);
			this.font.draw(playerKeyCountString, 24, 31, ig.Font.ALIGN.LEFT);

			var playerCoinCountString = "Coins: " + this.playerController.playerCharacter.coinCount;
			this.font.draw(playerCoinCountString, 10, 56, ig.Font.ALIGN.LEFT);



			if (this.playerController.playerCharacter.primary == 'sword') {
				this.inventoryImage.drawTile(ig.system.width - 165, ig.system.height - 55, 0, 50);
				this.font.draw('+' + this.playerController.playerCharacter.swordLevel, ig.system.width - 144, ig.system.height - 27, ig.Font.ALIGN.LEFT);
			}
			else if (this.playerController.playerCharacter.primary == 'fist') {
				this.inventoryImage.drawTile(ig.system.width - 165, ig.system.height - 55, 4, 50);
				this.font.draw('+' + this.playerController.playerCharacter.firefistLevel, ig.system.width - 144, ig.system.height - 27, ig.Font.ALIGN.LEFT);
			}
			else if (this.playerController.playerCharacter.primary == 'firefist') {
				this.inventoryImage.drawTile(ig.system.width - 165, ig.system.height - 55, 4, 50);
				this.font.draw('+' + this.playerController.playerCharacter.firefistLevel, ig.system.width - 144, ig.system.height - 27, ig.Font.ALIGN.LEFT);
			}

			if (this.playerController.playerCharacter.secondary == 'boomerang') {
				this.inventoryImage.drawTile(ig.system.width - 110, ig.system.height - 55, 7, 50);
				this.font.draw('+' + this.playerController.playerCharacter.boomerangLevel, ig.system.width - 89, ig.system.height - 27, ig.Font.ALIGN.LEFT);
			}
			else if (this.playerController.playerCharacter.secondary == 'bow') {
				this.inventoryImage.drawTile(ig.system.width - 110, ig.system.height - 55, 6, 50);
				this.font.draw('+' + this.playerController.playerCharacter.bowLevel, ig.system.width - 89, ig.system.height - 27, ig.Font.ALIGN.LEFT);
			}
			else if (this.playerController.playerCharacter.secondary == 'grapplinghook') {
				this.inventoryImage.drawTile(ig.system.width - 110, ig.system.height - 55, 8, 50);
				this.font.draw('+' + this.playerController.playerCharacter.grapplinghookLevel, ig.system.width - 89, ig.system.height - 27, ig.Font.ALIGN.LEFT);
			}
			else if (this.playerController.playerCharacter.secondary == 'magiccloak') {
				this.inventoryImage.drawTile(ig.system.width - 110, ig.system.height - 55, 5, 50);
				this.font.draw('+' + this.playerController.playerCharacter.magiccloakLevel, ig.system.width - 89, ig.system.height - 27, ig.Font.ALIGN.LEFT);
			}
			else if (this.playerController.playerCharacter.secondary == 'magicwand') {
				this.inventoryImage.drawTile(ig.system.width - 110, ig.system.height - 55, 1, 50);
				this.font.draw('+' + this.playerController.playerCharacter.magicwandLevel, ig.system.width - 89, ig.system.height - 27, ig.Font.ALIGN.LEFT);
			} else {
				this.inventoryImage.drawTile(ig.system.width - 110, ig.system.height - 55, 9, 50);
			}

			this.inventoryImage.drawTile(ig.system.width - 55, ig.system.height - 55, 2, 50);
			this.font.draw(this.playerController.playerCharacter.potionCount, ig.system.width - 34, ig.system.height - 27, ig.Font.ALIGN.LEFT);
			
			this.font.draw('D', ig.system.width - 150, ig.system.height - 70, ig.Font.ALIGN.LEFT);
        	this.font.draw('F', ig.system.width - 95, ig.system.height - 70, ig.Font.ALIGN.LEFT);
        	this.font.draw('G', ig.system.width - 40, ig.system.height - 70, ig.Font.ALIGN.LEFT);

			
        	this.drawHealthBar();
        	this.drawPortalBar();

			this.handleMessages();
		}

		
	},

	drawPortalBar: function() {
		if(this.isCastingPortal) {
			ig.system.context.fillStyle = "rgb(0,0,0)";
        	ig.system.context.beginPath();
        	ig.system.context.rect(
        	                200 * ig.system.scale, 
        	                200 * ig.system.scale, 
        	                400 * ig.system.scale, 
        	                30 * ig.system.scale
        	            );
        	ig.system.context.closePath();
        	ig.system.context.fill();
	
        	ig.system.context.fillStyle = "rgb(255,0,0)";
        	ig.system.context.beginPath();
        	ig.system.context.rect(
        	                202 * ig.system.scale, 
        	                202 * ig.system.scale, 
        	                (396 * ((10 + this.portalTimer.delta()) / 10)) * ig.system.scale, 
        	                26 * ig.system.scale
        	            );
        	ig.system.context.closePath();
        	ig.system.context.fill();

        	this.font.draw("Teleporting to town", ig.system.width/2 * ig.system.scale, 205 * ig.system.scale, ig.Font.ALIGN.CENTER);
    	}
	},

	drawHealthBar: function() {
		ig.system.context.fillStyle = "rgb(123,123,123)";
        ig.system.context.beginPath();
        ig.system.context.rect(
                        4 * ig.system.scale, 
                        4 * ig.system.scale, 
                        204 * ig.system.scale, 
                        24 * ig.system.scale
                    );
        ig.system.context.closePath();
        ig.system.context.fill();

		ig.system.context.fillStyle = "rgb(0,0,0)";
        ig.system.context.beginPath();
        ig.system.context.rect(
                        6 * ig.system.scale, 
                        6 * ig.system.scale, 
                        200 * ig.system.scale, 
                        20 * ig.system.scale
                    );
        ig.system.context.closePath();
        ig.system.context.fill();
        
        ig.system.context.fillStyle = "rgb(255,0,0)";
        ig.system.context.beginPath();
        ig.system.context.rect(
                        8 * ig.system.scale, 
                        8 * ig.system.scale, 
                        (196 * (this.playerController.playerCharacter.health / this.playerController.playerCharacter.maxHealth)) * ig.system.scale, 
                        16 * ig.system.scale
                    );
        ig.system.context.closePath();
        ig.system.context.fill();
        },

	handleMessages: function() {
		if (this.messageQueue.length > 0 && this.messageTimer.delta() > 0) {
			this.messageToDisplay = this.messageQueue.shift();
			this.messageTimer.set(this.messageDuration + 0.05 * this.messageToDisplay.length)
		} else if (this.messageTimer.delta() <= 0) {
			this.font.draw(this.messageToDisplay, ig.system.width/2 , ig.system.height/4, ig.Font.ALIGN.CENTER);
		}
	},

	addMessage: function(message) {
		this.messageQueue.push(message);
	},

	drawPauseMenu: function() {
		if(this.pauseItemSelected == this.PauseItems.Resume)
			this.font.draw("Resume Game", ig.system.width/2, ig.system.height/2, ig.Font.ALIGN.CENTER);
		else
			this.font.draw("Save Game", ig.system.width/2, ig.system.height/2, ig.Font.ALIGN.CENTER);
	},
	// Will go to gameover screen when player entity is killed
	gameOver: function() {
		ig.system.setGame(GameOver);
	}
});

// Start Screen
StartScreen = ig.Game.extend({
	instructText: new ig.Font('media/plainfont.png'),
	background: new ig.Image('media/TitleScreen.png'),
	init: function() {
		ig.input.bind(ig.KEY.SPACE, 'start');
		ig.music.add( 'music/title.ogg' );
		ig.music.volume = 0.5;
		ig.music.play();
	},

	update: function() {
		if(ig.input.pressed('start')) {
			ig.music.stop();
			ig.music = new ig.Music(); 
			ig.system.setGame(MyGame);
		}
		this.parent();
	},
	draw: function() {
		this.parent();
		this.background.draw(0,0);
		var x = ig.system.width/2,
		y = ig.system.height - 20;
		this.instructText.draw('Press Spacebar to Begin', x+40, y, ig.Font.ALIGN.CENTER);
	}
});

GameOver = ig.Game.extend({
	instructText: new ig.Font('media/plainfont.png'),
	background: new ig.Image('media/GameOver.png'),

	init: function() {
		ig.input.bind(ig.KEY.SPACE, 'cont');
	},

	update: function() {
		if(ig.input.pressed('cont')) {
			ig.system.setGame(StartScreen)
		}
	},

	draw: function() {
		this.parent();
		this.background.draw(0,0);
		var x = ig.system.width/2,
		y = ig.system.height - 20;
		this.instructText.draw('Press Spacebar to Continue', x+40, y, ig.Font.ALIGN.CENTER);
	}
});

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', StartScreen, 60, 800, 600, 1 );

});
