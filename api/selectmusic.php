<?php
	require_once 'functions.php';
	require_once 'db.php';

	if(!isset($_POST["music_id"])){
		$output_data["Code"] = 1;
		$output_data["Result"] = "Error";
		$output_data["ErrorMessage"] = "Please post by adding a variable 'music_id'.";
		$http_code = 400;
		json_output($output_data, $http_code);
	}
	$music_id = filter_input(INPUT_POST, "music_id", FILTER_VALIDATE_INT);
	$result = mysqli_query($db, "select * from playlistdata where playlistid = -1 and musicid = ".$music_id);
	if(!$result){
		$output_data["Code"] = 2;
		$output_data["Result"] = "Error";
		$output_data["ErrorMessage"] = "Select Query Error";
		$http_code = 400;
		json_output($output_data, $http_code);
	}
	$row = mysqli_fetch_assoc($result);
	$track = $row["track"];
	exec("mpc play $track");
	
	$output_data["Code"] = 0;
	$output_data["Result"] = "Success";
	$http_code = 200;
	json_output($output_data, $http_code);
