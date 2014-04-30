<?php
	require_once 'functions.php';
	require_once 'db.php';
	
	$user_data = array();
	$result = mysqli_query($db, "select * from user");
	if(!$result){
		$output = array('Code' => $code, 'Error' => 'Select Query Error');
		json_output($output, 400);
	}
	while($row = mysqli_fetch_assoc($result)){
		$user_data[$row["id"]] = array("id" => $row["id"], "name" => $row["name"]);
	}
	json_output($user_data, 200);