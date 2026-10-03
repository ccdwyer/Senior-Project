<?php
//log in info for database
require_once("DBlogin.php");

//Connect to MySQL Server
mysqli_report(MYSQLI_REPORT_OFF);
$conn = mysqli_connect($dbhost, $dbuser, $dbpass);

//Select Database
mysqli_select_db($conn, $dbname) or die(mysqli_error($conn));

$table_name = $_GET["table_name"];
$values = $_GET["values"];
$email = $_GET["email"];
$value_col = $_GET["value_col"];
$value_array = explode(",",$values);
$insert_query = "INSERT INTO $table_name ($value_col, email) VALUES ";
for($i=0; $i<count($value_array); $i++){
	if($i < count($value_array)-1)
		$insert_query = $insert_query."('$value_array[$i]', '$email'),";
	else
		$insert_query = $insert_query."('$value_array[$i]', '$email')";
}
$queryDelete="DELETE FROM $table_name WHERE email = '$email'";

$qry_result = mysqli_query($conn, $queryDelete) or die(mysqli_error($conn));
$qry_result = mysqli_query($conn, $insert_query) or die(mysqli_error($conn));
mysqli_close($conn);
?>