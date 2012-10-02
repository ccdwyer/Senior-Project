ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	'plugins.director.director',

	'game.entities.player',

	//Player Weapons
	'game.entities.boomerang',

	//Enemies
	'game.entities.mage',
	'game.entities.archer',

	//Enemy projectiles
	'game.entities.fireball',
	'game.entities.arrow',

	//Other Entities
	'game.entities.key',
	'game.entities.upStairs',
	'game.entities.downStairs',

	//Levels
	'game.levels.test',
	'game.levels.test2'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/plainfont.png' ),
	
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.UP_ARROW, 'up');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');

		//Temporary input to use weapons
		ig.input.bind( ig.KEY.B, 'boomerang');

		this.myDirector = new ig.Director(this, [LevelTest, LevelTest2]);

		this.loadLevel( LevelTest );
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();


		
	},
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 1280, 720, 1 );

});
