<?php
	$host = "";
	$user = "";
	$password = "";
	$database = "";
	
	$db = mysqli_connect($host, $user, $password, $database);
	$stmt = mysqli_prepare($db, "SET NAMES utf8");
	mysqli_stmt_execute($stmt);
