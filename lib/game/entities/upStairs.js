ig.module(
	'game.entities.upStairs'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityUpStairs = ig.Entity.extend({

	collides: ig.Entity.COLLIDES.FIXED,
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.A,

});

});