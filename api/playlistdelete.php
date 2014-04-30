<?php
	require_once 'functions.php';
	require_once 'db.php';

	$output_data = array();
	$http_code = 0;
	if(!isset($_POST["playlist_id"])){
		$output_data["Code"] = 1;
		$output_data["Result"] = "Error";
		$output_data["ErrorMessage"] = "Please post by adding a variable 'playlist_id'.";
		$http_code = 400;
		json_output($output_data, $http_code);
	}
	$playlist_id = filter_input(INPUT_POST, "playlist_id", FILTER_VALIDATE_INT);
	
	$result = mysqli_query($db, "delete from playlist where id = ".$playlist_id);
	if(!$result){
		$output_data["Code"] = 2;
		$output_data["Result"] = "Error";
		$output_data["ErrorMessage"] = "Delete Query Error.";
		$http_code = 400;
		json_output($output_data, $http_code);
	}
	$result = mysqli_query($db, "delete from playlistdata where playlistid = ".$playlist_id);
	if(!$result){
		$output_data["Code"] = 3;
		$output_data["Result"] = "Error";
		$output_data["ErrorMessage"] = "Delete Query Error.";
		$http_code = 400;
		json_output($output_data, $http_code);
	}
	$output_data["Code"] = 0;
	$output_data["Result"] = "Success";
	$http_code = 200;
	json_output($output_data, $http_code);
