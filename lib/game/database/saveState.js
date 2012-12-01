// Ajax code credit: http://impactjs.com/forums/code/ingame-database-querying-with-ajax

ig.module( 
    'game.database.saveState' 
)
.requires(
    'impact.impact'
)
.defines(function(){
    
SaveState = ig.Class.extend({
    

    init: function(table_name, email, values, value_col) {
		this.email = email;
		this.table_name = table_name;
		this.values = values;
		this.value_col = value_col;
		
        var queryString = "?email="+this.email+"&table_name="+this.table_name+"&values="+this.values+"&value_col="+this.value_col;
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
              //ig.out_text = ajaxRequest.responseText;         
            }    
        }
             
        ajaxRequest.open("POST", "/Senior-Project/lib/game/database/saveStateAction.php" + queryString, true);    
        ajaxRequest.send(null); 
      
    //END INIT
    }
	
  });

});