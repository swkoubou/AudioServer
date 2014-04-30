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
	$playlist_id = filter_input(INPUT_POST, "playlist_id", FILTER_SANITIZE_NUMBER_INT);
	$music_id = $_POST["music_id"];
	$result = mysqli_query($db, "select * from playlistdata where playlistid = $playlist_id");
	if(!$result){
		$output_data["Code"] = 2;
		$output_data["Result"] = "Error";
		$output_data["ErrorMessage"] = "Select Query Error";
		$http_code = 400;
		json_output($output_data, $http_code);
	}
	$track = mysqli_num_rows($result) + 1;
	
	
	foreach($music_id as $name => $value){
		$result = mysqli_query($db, "insert into playlistdata(playlistid,musicid,track) values ($playlist_id,$value,$track)");
		if(!$result){
			$output_data["Code"] = 3;
			$output_data["Result"] = "Error";
			$output_data["ErrorMessage"] = "Insert Query Error";
			$http_code = 400;
			json_output($output_data, $http_code);
		}
		if($playlist_id == -1){
			$result = mysqli_query($db, "select * from music where id = $value");
			if(!$result){
				$output_data["Code"] = 4;
				$output_data["Result"] = "Error";
				$output_data["ErrorMessage"] = "Select Query Error";
				$http_code = 400;
				json_output($output_data, $http_code);
			}
			$row = mysqli_fetch_assoc($result);
			exec("mpc add '".$row["file_name"]."'");
		}
		$track++;
	}
	
	$output_data["Code"] = 0;
	$output_data["Result"] = "Success";
	$http_code = 200;
	json_output($output_data, $http_code);
