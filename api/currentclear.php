<?php
	require_once 'functions.php';
	require_once 'db.php';
	
	$result = mysqli_query($db, "delete from playlistdata where playlistid = -1");
	$output_data = array();
	$http_code = 0;
	if($result){
		exec("mpc clear");
		$output_data["Code"] = 0;
		$output_data["Result"] = "Success";
		$http_code = 200;
	}else{
		$output_data["Code"] = 1;
		$output_data["Result"] = "Error";
		$output_data["ErrorMessage"] = "Delete Query Error.";
		$http_code = 400;
	}
	
	json_output($output_data, $http_code);
