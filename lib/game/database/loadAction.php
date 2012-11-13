<?php

//PART A CONNECT: ADAPT THIS TO YOUR DATABASE!!!

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "Senior-Project";

  //Connect to MySQL Server
mysql_connect($dbhost, $dbuser, $dbpass);
  //Select Database
mysql_select_db($dbname) or die(mysql_error());
    
//PART B TRANSFERRED VARIABLES
$lookup_table = $_GET["lookup_table"];
$lookup_var = $_GET["lookup_var"];
$lookup_value = $_GET["lookup_value"];
$return_var = $_GET["return_var"];
 
  // Escape User Input to help prevent SQL Injection
$lookup_table = mysql_real_escape_string($lookup_table);
$lookup_var = mysql_real_escape_string($lookup_var);
$lookup_value = mysql_real_escape_string($lookup_value);
$return_var = mysql_real_escape_string($return_var);

//PART C QUERY
  //build query
$query = "SELECT * FROM $lookup_table WHERE $lookup_var = $lookup_value";
//Execute query
$qry_result = mysql_query($query) or die(mysql_error());
$row = mysql_fetch_array($qry_result);
//PART D FUNCTION OUTPUT
echo $row[$return_var];

?>