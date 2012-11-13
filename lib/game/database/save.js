// Ajax code credit: http://impactjs.com/forums/code/ingame-database-querying-with-ajax

ig.module( 
    'game.database.save' 
)
.requires(
    'impact.impact'
)
.defines(function(){
    
Save = ig.Class.extend({
    

    init: function() {
        /*
        // Table that will be queried
        this.lookup_table = lookup_table;
        // Primary Key
        this.lookup_var = lookup_var;
        // Primary Key Value
        this.lookup_value = lookup_value;
        // Return Value (column)
        this.return_var = return_var;
        this.out_text = "voor_invulling";
        
        var queryString = "?lookup_table=" + lookup_table + "&lookup_var=" + lookup_var + "&lookup_value=" + lookup_value + "&return_var=" + return_var;
        */
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
              ig.out_text = ajaxRequest.responseText;         
            }    
        }
             
        ajaxRequest.open("POST", "/Senior-Project/lib/plugins/databaselookup/saveAction.php" + queryString, true);    
        ajaxRequest.send(null); 
      
    //END INIT
    }    

  });

});