<?php
//log in information for database
require_once("DBlogin.php");

//Connect to MySQL Server
mysqli_report(MYSQLI_REPORT_OFF);
$conn = mysqli_connect($dbhost, $dbuser, $dbpass);

//Select Database
mysqli_select_db($conn, $dbname) or die(mysqli_error($conn));
    
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

$password = mysqli_real_escape_string($conn, $password);
$email = mysqli_real_escape_string($conn, $email);

$queryCheck = mysqli_query($conn, "SELECT * FROM $user_table WHERE $email_col = '$email'");
$row = mysqli_fetch_array($queryCheck);
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
	$qry_result1 = mysqli_query($conn, $query1) or die(mysqli_error($conn));
	$qry_result2 = mysqli_query($conn, $query2) or die(mysqli_error($conn));
	
	echo "success";
	
}
else{
	echo "An account already exists<br/>under this email adderess";
}

?>