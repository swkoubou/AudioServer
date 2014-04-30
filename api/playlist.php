<?php
	require_once 'functions.php';
	require_once 'db.php';
	$method = $_SERVER['REQUEST_METHOD'];
	switch($method) {
	case 'GET':
		$output_data = array();
		$http_code = 0;
		$result = mysqli_query($db, "select * from playlist");
		if($result){
			while($row = mysqli_fetch_assoc($result)){
				$playlist_data = array();
				$result2 =  mysqli_query($db, "select musicid from playlistdata where playlistid = ".$row["id"]);
				if($result2){
					while($row2 = mysqli_fetch_assoc($result2)){
						array_push($playlist_data,$row2["musicid"]);
					}
					$output_data[$row["id"]] = array("id" => $row["id"], "name" => $row["name"], "data" => $playlist_data);
				}else{
					$output2_data = array();
					$output2_data["Code"] = 2;
					$output2_data["Result"] = "Error";
					$output2_data["ErrorMessage"] = "Select Query Error.";
					$http_code = 400;
					json_output($output2_data, $http_code);
				}
			}
			$http_code = 200;
		}else{
			$output_data["Code"] = 1;
			$output_data["Result"] = "Error";
			$output_data["ErrorMessage"] = "Select Query Error.";
			$http_code = 400;
		}
		json_output($output_data, $http_code);
		break;
	case 'POST':
		if(!isset($_POST["name"])){
			$output_data["Code"] = 1;
			$output_data["Result"] = "Error";
			$output_data["ErrorMessage"] = "Please post by adding a variable 'name'.";
			$http_code = 400;
			json_output($output_data, $http_code);
		}
		$playlist_name = filter_input(INPUT_POST, "name", FILTER_SANITIZE_SPECIAL_CHARS);
		$result = mysqli_query($db, "insert into playlist (name) values ('$playlist_name')");
		if($result){
			$output_data["Code"] = 0;
			$output_data["Result"] = "Success";
			$http_code = 200;
		}else{
			$output_data["Code"] = 2;
			$output_data["Result"] = "Error";
			$output_data["ErrorMessage"] = "Insert Query Error.";
			$http_code = 400;
		}
		json_output($output_data, $http_code);
		break;
	default:
		$output_data["Code"] = 1;
		$output_data["Result"] = "Error";
		$output_data["ErrorMessage"] = "Please connect with the GET or POST.";
		$http_code = 400;
		
		json_output($output_data, $http_code);
	}
