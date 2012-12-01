// Ajax code credit: http://impactjs.com/forums/code/ingame-database-querying-with-ajax

ig.module( 
    'game.database.saveUser' 
)
.requires(
    'impact.impact'
)
.defines(function(){
    
SaveUser = ig.Class.extend({
    

    init: function(coins, level, email, potions, keys, xpos, ypos) {
        this.user_table = "users";
        this.level = level;
		this.coins = coins;
		this.email = email;
		this.potions = potions;
		this.keys = keys;
		this.xpos = xpos;
		this.ypos = ypos;
        
        var queryString = "?user_table=" + this.user_table + "&level=" + this.level + "&coins=" + this.coins + "&email=" + this.email + "&potions=" + this.potions + "&keys=" + this.keys + "&xpos=" + this.xpos + "&ypos=" + this.ypos;
        
        this.ajaxRequest;  // The variable that makes Ajax possible!    
        try{
            // Opera 8.0+, Firefox, Safari
            ajaxRequest = new XMLHttpRequest();
        } catch (e){
            // Internet Explorer Browsers
            try{
                ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try{
                    ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e){
                    // Something went wrong
                    alert("Your browser broke!");
                    return false;
                }
            }
        }
        
        ajaxRequest.onreadystatechange = function()
        {      
            ig.sqlstate = ajaxRequest.readyState;
            if(ajaxRequest.readyState == 4)
            {
            
            }    
        }
             
        ajaxRequest.open("POST", "/Senior-Project/lib/game/database/saveUserAction.php" + queryString, true);    
        ajaxRequest.send(null); 
      
    //END INIT
    }    

  });

});