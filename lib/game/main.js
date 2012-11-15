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
	//Firefist levels
	//Grappling hook levels
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

		this.initializeStates();
		this.playerController = new ig.PlayerController();
		this.doorController = new ig.DoorController();
		this.keyController = new ig.KeyController();
		this.chestController = new ig.ChestController();
		ig.music.add( 'music/title.ogg', 'title' );
		ig.music.add( 'music/goblinking.ogg', 'goblinking');
		ig.music.add( 'music/astralbody.ogg', 'astralbody');
		ig.music.volume = 0.2;
		ig.music.play();
		ig.music.loop = true;

		this.messageToDisplay = "";
		this.messageQueue = [];
		this.messageTimer = new ig.Timer(0);
		this.messageDuration = 2;
		// Load levels into Director for level transitions
		this.myDirector = new ig.Director(this, [LevelWelcome, LevelTest, 
												LevelLevel1, LevelLevel2, LevelLevel3, LevelTest2, LevelSwordonly1, LevelSwordonly2, 
												LevelBoomerang1, LevelBoomerang2, LevelBoomerang3, LevelGoblinking,
												LevelTest3, LevelAstralbody]);
		// Load initial level
		this.loadLevel( LevelTest );

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
		if(ig.input.state('pause') && this.stateChangeCooldown.delta() > 0) {
			this.stateChangeCooldown.set(.5);
			this.state = this.States.Paused;
			this.pauseItemSelected = this.PauseItems.Resume;
			for (var i=0; i < this.entities.length; i++)
				this.entities[i].inGame = false;
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

			var playerKeyCountString = "Keys: " + this.playerController.playerCharacter.keyCount;
			this.font.draw(playerKeyCountString, 10, 33, ig.Font.ALIGN.LEFT);

			var playerCoinCountString = "Coins: " + this.playerController.playerCharacter.coinCount;
			this.font.draw(playerCoinCountString, 10, 56, ig.Font.ALIGN.LEFT);

			if (this.playerController.playerCharacter.primary == 'sword') {
				this.font.draw('Sword +' + this.playerController.playerCharacter.swordLevel + ' Equipped', 10, 79, ig.Font.ALIGN.LEFT);
			}
			else if (this.playerController.playerCharacter.primary == 'fist') {
				this.font.draw('Fist +' + this.playerController.playerCharacter.firefistLevel +' Equipped', 10, 79, ig.Font.ALIGN.LEFT);
			}
			else if (this.playerController.playerCharacter.primary == 'firefist') {
				this.font.draw('FireFist +5 Equipped', 10, 79, ig.Font.ALIGN.LEFT);
			}

			if (this.playerController.playerCharacter.secondary == 'boomerang') {
				this.font.draw('Boomerang +' + this.playerController.playerCharacter.boomerangLevel + ' Equipped', 10, 102, ig.Font.ALIGN.LEFT);
			}
			else if (this.playerController.playerCharacter.secondary == 'bow') {
				this.font.draw('Bow +' + this.playerController.playerCharacter.bowLevel + ' Equipped', 10, 102, ig.Font.ALIGN.LEFT);
			}
			else if (this.playerController.playerCharacter.secondary == 'grapplinghook') {
				this.font.draw('Grappling Hook +' + this.playerController.playerCharacter.grapplinghookLevel + ' Equipped', 10, 102, ig.Font.ALIGN.LEFT);
			}
			else if (this.playerController.playerCharacter.secondary == 'magiccloak') {
				this.font.draw('Magic Cloak +' + this.playerController.playerCharacter.magiccloakLevel + ' Equipped', 10, 102, ig.Font.ALIGN.LEFT);
			}
			else if (this.playerController.playerCharacter.secondary == 'magicwand') {
				this.font.draw('Magic Wand +' + this.playerController.playerCharacter.magicwandLevel + ' Equipped', 10, 102, ig.Font.ALIGN.LEFT);
			}

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
        	
        	// health bar
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

			var playerPotionCountString = "Potions: " + this.playerController.playerCharacter.potionCount;
			this.font.draw(playerPotionCountString, 10, 125, ig.Font.ALIGN.LEFT);

			this.handleMessages();
		}

		
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
