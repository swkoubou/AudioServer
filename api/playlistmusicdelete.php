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
	if(!isset($_POST["playlist_id"])){
		$output_data["Code"] = 2;
		$output_data["Result"] = "Error";
		$output_data["ErrorMessage"] = "Please post by adding a variable 'playlist_id'.";
		$http_code = 400;
		json_output($output_data, $http_code);
	}
	$music_id = filter_input(INPUT_POST, "music_id", FILTER_VALIDATE_INT);
	$playlist_id = filter_input(INPUT_POST, "playlist_id", FILTER_VALIDATE_INT);

	$result = mysqli_query($db, "select * from playlistdata where playlistid = ".$playlist_id." and musicid = ".$music_id);
	if(!$result){
		$output_data["Code"] = 3;
		$output_data["Result"] = "Error";
		$output_data["ErrorMessage"] = "Select Query Error.";
		$http_code = 400;
		json_output($output_data, $http_code);
	}
	$row = mysqli_fetch_assoc($result);
	$track = $row["track"];
	
	$result = mysqli_query($db, "delete from playlistdata where playlistid = ".$playlist_id." and musicid = ".$music_id);
	if(!$result){
		$output_data["Code"] = 4;
		$output_data["Result"] = "Error";
		$output_data["ErrorMessage"] = "Delete Query Error.";
		$http_code = 400;
		json_output($output_data, $http_code);
	}
	$result = mysqli_query($db, "update playlistdata set track = track-1 where track > $track");
	if(!$result){
		$output_data["Code"] = 5;
		$output_data["Result"] = "Error";
		$output_data["ErrorMessage"] = "Update Query Error.";
		$http_code = 400;
		json_output($output_data, $http_code);
	}
	
	if($playlist_id == -1){
		exec("mpc del $track");
	}
	$output_data["Code"] = 0;
	$output_data["Result"] = "Success";
	$http_code = 200;
	json_output($output_data, $http_code);
