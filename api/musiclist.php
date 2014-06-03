<?php
	require_once 'functions.php';
    require_once 'db.php';
	
	$output_data = array();
	$http_code = 0;
	$result = mysqli_query($db, "select * from music");
	if($result){
		while($row = mysqli_fetch_assoc($result)){
			$output_data[$row["id"]] = array("id" => $row["id"], "name" => $row["name"], "user_id" => $row["user_id"]);
		}
		$http_code = 200;
	}else{
		$output_data["Code"] = 1;
		$output_data["Result"] = "Error";
		$output_data["ErrorMessage"] = "Select Query Error.";
		$http_code = 400;
		
	}
	json_output($output_data, $http_code);
	