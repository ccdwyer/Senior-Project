// Ajax code credit: http://impactjs.com/forums/code/ingame-database-querying-with-ajax

ig.module( 
    'game.database.saveWeapons' 
)
.requires(
    'impact.impact'
)
.defines(function(){
    
SaveWeapons = ig.Class.extend({
    

    init: function(fist, boomerang, bow, grapplinghook, cloak, wand, sword, email) {
        this.weapons_table = "weapons";
		this.email = email;
		this.fistLevel = fist;
		this.boomerangLevel = boomerang;
		this.bowLevel = bow;
		this.grapplinghookLevel = grapplinghook;
		this.cloakLevel = cloak;
		this.wandLevel = wand;
		this.swordLevel = sword;
        
        var queryString = "?weapons_table=" + this.weapons_table + "&fistLevel=" + this.fistLevel + "&boomerangLevel=" + this.boomerangLevel + "&bowLevel=" + this.bowLevel + "&grapplinghookLevel=" + this.grapplinghookLevel + "&cloakLevel=" + this.cloakLevel + "&wandLevel=" + this.wandLevel + "&swordLevel=" + this.swordLevel + "&email=" + this.email;
        
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
             
        ajaxRequest.open("POST", "/Senior-Project/lib/game/database/saveWeaponsAction.php" + queryString, true);    
        ajaxRequest.send(null); 
      
    //END INIT
    }    

  });

});