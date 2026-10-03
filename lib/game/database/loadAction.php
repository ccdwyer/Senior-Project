<?php
require_once("DBlogin.php");

  //Connect to MySQL Server
mysqli_report(MYSQLI_REPORT_OFF);
$conn = mysqli_connect($dbhost, $dbuser, $dbpass);

  //Select Database
mysqli_select_db($conn, $dbname) or die(mysqli_error($conn));

//PART B TRANSFERRED VARIABLES
$users_table = $_GET["users_table"];
$weapons_table = $_GET["weapons_table"];
$keys_table = $_GET["keys_table"];
$chests_table = $_GET["chests_table"];
$doors_table = $_GET["doors_table"];
$email = $_GET["email"];
$password = $_GET["password"];
$password_col = $_GET["password_col"];
$email_col = $_GET["email_col"];
$playerWeapons = "";
$playerKeys = "";
$playerChests = "";
$playerDoors = "";
$returnString = "";

$password = mysqli_real_escape_string($conn, $password);
$email = mysqli_real_escape_string($conn, $email);

$queryUsers = "SELECT * FROM $users_table WHERE $email_col = '$email'";
$qry_result = mysqli_query($conn, $queryUsers) or die(mysqli_error($conn));
$row = mysqli_fetch_array($qry_result);

$hash = hash("sha256", $password);
$hash = $row ? hash("sha256", $row["hashID"].$hash) : "";

if($row && strcmp($row["password"], $hash) == 0){
	$returnString = $returnString . $row["level"]." ".$row["coins"]." ".$row["potions"]." ".$row["game_keys"]." ".$row["xpos"]." ".$row["ypos"]." ";
	$queryWeapons = "SELECT * FROM $weapons_table WHERE $email_col = '$email'";
	$queryKeys = "SELECT * FROM $keys_table WHERE $email_col = '$email'";
	$queryChests = "SELECT * FROM $chests_table WHERE $email_col = '$email'";
	$queryDoors = "SELECT * FROM $doors_table WHERE $email_col = '$email'";
	$qry_result = mysqli_query($conn, $queryWeapons) or die(mysqli_error($conn));
	$row = mysqli_fetch_array($qry_result);
	$playerWeapons = $row["boomerang"]." ".$row["fist"]." ".$row["grapplinghook"]." ".$row["wand"]." ".$row["cloak"]." ".$row["bow"]." ".$row["sword"].",";
	$returnString = $returnString . $playerWeapons;
	
	//get key list
	$qry_result = mysqli_query($conn, $queryKeys) or die(mysqli_error($conn));
	$record_set = mysqli_num_rows($qry_result);
	$row = mysqli_fetch_array($qry_result);
	for($i=0; $i<$record_set; $i++){
		if($i<$record_set-1)
			$playerKeys = $playerKeys.$row["keyID"]." ";
		else
			$playerKeys = $playerKeys.$row["keyID"].",";
		$row = mysqli_fetch_array($qry_result);
	}
	$returnString = $returnString . $playerKeys;
	
	//get chest list
	$qry_result = mysqli_query($conn, $queryChests) or die(mysqli_error($conn));
	$record_set = mysqli_num_rows($qry_result);
	$row = mysqli_fetch_array($qry_result);
	for($i=0; $i<$record_set; $i++){
		if($i<$record_set-1)
			$playerChests = $playerChests.$row["chestID"]." ";
		else
			$playerChests = $playerChests.$row["chestID"].",";
		$row = mysqli_fetch_array($qry_result);
	}
	$returnString = $returnString . $playerChests;
	
	//get door list
	$qry_result = mysqli_query($conn, $queryDoors) or die(mysqli_error($conn));
	$record_set = mysqli_num_rows($qry_result);
	$row = mysqli_fetch_array($qry_result);
	for($i=0; $i<$record_set; $i++){
		if($i<$record_set-1)
			$playerDoors = $playerDoors.$row["doorID"]." ";
		else
			$playerDoors = $playerDoors.$row["doorID"];
		$row = mysqli_fetch_array($qry_result);
	}
	$returnString = $returnString . $playerDoors;
	
	echo $returnString;
}
else
	echo "Invalid Password";
?>