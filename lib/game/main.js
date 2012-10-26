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

	//Controllers
	'game.director.player-controller',
	'game.director.door-controller',
	'game.director.key-controller',

	//Player Weapon
	'game.entities.sword',
	'game.entities.fist',

	//Player Equipment
	'game.entities.boomerang',
	'game.entities.grapplinghook',
	'game.entities.playerarrow',

	//Player Projectiles
	'game.entities.firefistprojectile',

	//Enemies
	'game.entities.mage',
	'game.entities.archer',
	'game.entities.goblin',
	'game.entities.slimer',
	'game.entities.clonercrystal',

	//Bosses
	'game.entities.astralbody',

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

	//Levels
	'game.levels.test',
	'game.levels.test2',
	'game.levels.test3',
	'game.levels.astralbody',
	'game.levels.explore1'
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
		// Load levels into Director for level transitions
		this.myDirector = new ig.Director(this, [LevelTest, LevelTest2, LevelTest3, LevelAstralbody]);

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
		
		ig.input.bind( ig.KEY.D, 'primary');
		ig.input.bind( ig.KEY.F, 'secondary');
		ig.input.bind( ig.KEY.G, 'potion');
		ig.input.bind( ig.KEY.B, 'portal');
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
		}
	},

	drawPauseMenu: function() {
		if(this.pauseItemSelected == this.PauseItems.Resume)
			this.font.draw("Resume Game", ig.system.width/2, ig.system.height/2, ig.Font.ALIGN.CENTER);
		else
			this.font.draw("Save Game", ig.system.width/2, ig.system.height/2, ig.Font.ALIGN.CENTER);
	}
});

// Start Screen
StartScreen = ig.Game.extend({
	instructText: new ig.Font('media/plainfont.png'),
	background: new ig.Image('media/TitleScreen.png'),
	init: function() {
		ig.input.bind(ig.KEY.SPACE, 'start');
	},

	update: function() {
		if(ig.input.pressed('start')) {
			ig.system.setGame(MyGame)
		}
		this.parent();
	},
	draw: function() {
		this.parent();
		this.background.draw(0,0);
		var x = ig.system.width/2,
		y = ig.system.height - 20;
		this.instructText.draw('Press Spacebar to Begin', x+40, y-70, ig.Font.ALIGN.CENTER);
	}
});

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', StartScreen, 60, 800, 600, 1 );

});
