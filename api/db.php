<?php
	$host = "localhost";
	$user = "pi";
	$password = "raspberry";
	$database = "musicdb";
	
	$db = mysqli_connect($host, $user, $password, $database);
	$stmt = mysqli_prepare($db, "SET NAMES utf8");
	mysqli_stmt_execute($stmt);
