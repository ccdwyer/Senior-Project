<?php
$to = $_GET["email"];
$subject = "test subject";
$message = "test message";
mail($to,$subject,$message);
?>