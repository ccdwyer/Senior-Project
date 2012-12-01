<?php
//log in info for database
require_once("DBlogin.php");

//Connect to MySQL Server
mysql_connect($dbhost, $dbuser, $dbpass);

//Select Database
mysql_select_db($dbname) or die(mysql_error());

//TRANSFERRED VARIABLES
$weapons_table = $_GET["weapons_table"];
$email = $_GET["email"];
$fistLevel = $_GET["fistLevel"];
$boomerangLevel = $_GET["boomerangLevel"];
$bowLevel = $_GET["bowLevel"];
$grapplinghookLevel = $_GET["grapplinghookLevel"];
$cloakLevel = $_GET["cloakLevel"];
$wandLevel = $_GET["wandLevel"];
$swordLevel = $_GET["swordLevel"];
$fist_col = "fist";
$boomerang_col = "boomerang";
$bow_col = "bow";
$grapplinghook_col = "grapplinghook";
$cloak_col = "cloak";
$wand_col = "wand";
$sword_col = "sword";
$email_col = "email";

//query
$query = "UPDATE $weapons_table SET $fist_col=$fistLevel, $boomerang_col=$boomerangLevel, $bow_col=$bowLevel, $grapplinghook_col=$grapplinghookLevel, $cloak_col=$cloakLevel, $wand_col=$wandLevel, $sword_col=$swordLevel WHERE $email_col='$email'";
$qry_result = mysql_query($query) or die(mysql_error());
mysql_close();
?>