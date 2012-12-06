ig.module( 'game.levels.killscreen' )
.requires( 'impact.image','game.entities.player' )
.defines(function(){
LevelKillscreen=/*JSON[*/{"entities":[{"type":"EntityPlayer","x":508,"y":165}],"layer":[{"name":"background","width":5,"height":5,"linkWithCollision":false,"visible":true,"tilesetName":"media/killscreen.jpeg","repeat":false,"preRender":false,"distance":"1","tilesize":200,"foreground":false,"data":[[1,2,3,4,5],[6,7,8,9,10],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]},{"name":"collision","width":10,"height":10,"linkWithCollision":false,"visible":true,"tilesetName":"","repeat":false,"preRender":false,"distance":1,"tilesize":100,"foreground":false,"data":[[1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]}]}/*]JSON*/;
LevelKillscreenResources=[new ig.Image('media/killscreen.jpeg')];
});