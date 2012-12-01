<?php
//log in information for database
require_once("DBlogin.php");

//Connect to MySQL Server
mysql_connect($dbhost, $dbuser, $dbpass);

//Select Database
mysql_select_db($dbname) or die(mysql_error());
    
//TRANSFERRED VARIABLES
$user_table = $_GET["user_table"];
$weapons_table = $_GET["weapons_table"];
$password = $_GET["password"];
$email = $_GET["email"];
$level = 0;
$coins = 0;
$portals = 0;
$keys = 0;
$password_col = $_GET["password_col"];
$email_col = $_GET["email_col"];
$level_col = "level";
$hash_col = "hashID";
$coins_col = "coins";
$portals_col = "portals";
$keys_col = "game_keys";

$password = mysql_real_escape_string($password);
$email = mysql_real_escape_string($email);

$queryCheck = mysql_query("SELECT * FROM $user_table WHERE $email_col = '$email'");
$row = mysql_fetch_array($queryCheck);
//echo $row;
if(!$row){
	
	$hash = hash("sha256", $password);
	function createSalt(){
		$string = md5(uniqid(rand(), true));
		return substr($string, 0, 3);
	}
	$salt = createSalt();
	$hash = hash("sha256", $salt.$hash);
 
	$query1 = "INSERT INTO $user_table ($email_col, $password_col, $hash_col, $level_col, $coins_col, $keys_col) VALUES ('$email', '$hash', '$salt', $level, $coins, $keys)";
	$query2 = "INSERT INTO $weapons_table ($email_col) VALUES ('$email')";
//Execute query
	$qry_result1 = mysql_query($query1) or die(mysql_error());
	$qry_result2 = mysql_query($query2) or die(mysql_error());
	
	echo "success";
	
}
else{
	echo "An account already exists<br/>under this email adderess";
}

?>