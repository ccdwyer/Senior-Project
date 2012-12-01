<?php
//log in info for database
require_once("DBlogin.php");

//Connect to MySQL Server
mysql_connect($dbhost, $dbuser, $dbpass);

  //Select Database
mysql_select_db($dbname) or die(mysql_error());

//TRANSFERRED VARIABLES
$user_table = $_GET["user_table"];
$level = $_GET["level"];
$coins = $_GET["coins"];
$email = $_GET["email"];
$potions = $_GET["potions"];
$xpos = $_GET["xpos"];
$ypos = $_GET["ypos"];
$keys = $_GET["keys"];
$level_col = "level";
$coins_col = "coins";
$email_col = "email";
$potions_col = "potions";
$keys_col = "game_keys";
$xpos_col = "xpos";
$ypos_col = "ypos";

//QUERY
$query = "UPDATE $user_table SET $level_col=$level, $coins_col=$coins, $potions_col=$potions, $keys_col=$keys, $xpos_col=$xpos, $ypos_col=$ypos WHERE $email_col='$email'";
$qry_result = mysql_query($query) or die(mysql_error());


?>