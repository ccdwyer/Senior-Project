<?php
//log in info for database
require_once("DBlogin.php");

//Connect to MySQL Server
mysqli_report(MYSQLI_REPORT_OFF);
$conn = mysqli_connect($dbhost, $dbuser, $dbpass);

  //Select Database
mysqli_select_db($conn, $dbname) or die(mysqli_error($conn));

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
$qry_result = mysqli_query($conn, $query) or die(mysqli_error($conn));


?>