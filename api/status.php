<?php
	require_once 'functions.php';
	require_once 'db.php';
	
	$proc = filter_input(INPUT_POST, "type", FILTER_SANITIZE_SPECIAL_CHARS);
	$value = filter_input(INPUT_POST, "value", FILTER_SANITIZE_SPECIAL_CHARS);
	$music_id = 0;
	if(!$proc || $proc == "" || $proc == null){
		exec("mpc status",$op);
		if(count($op)==1){
			$isPlay = "false";
			$statusstr = $op[0];
		}else{
			$isPlay = "true";
			$buf = explode("#", $op[1]);
			$buf = explode("/", $buf[1]);
			
			$music_data = array();
			$result = mysqli_query($db, "select * from playlistdata where playlistid = -1 and track = $buf[0]");
			if(!$result){
				$output_data["Code"] = 1;
				$output_data["Result"] = "Error";
				$output_data["ErrorMessage"] = "Select Query Error";
				$http_code = 400;
				json_output($output_data, $http_code);
			}
			$row = mysqli_fetch_assoc($result);
			$music_id = $row["musicid"];
			$statusstr = $op[2];
		}
		$statusstr = explode(":",$statusstr);
		$volume = trim(substr($statusstr[1],0,3));
		$repeat = trim(substr($statusstr[2],0,4));
		$random = trim(substr($statusstr[3],0,4));
		
		
		$output = array(
			"isPlay" => $isPlay, 
			"volume" => $volume, 
			"isRepeat" => $repeat, 
			"isRandom" => $random,
			"musicID" => $music_id,
			);
		json_output($output, 200);
	}
	
	switch($proc){
		case "play":
			if($value == "on"){
				exec("mpc play");
			}else{
				exec("mpc stop");
			}
			break;
		case "volume":
			exec("mpc volume ".$value);
			break;
		case "repeat":
			if($value == "on"){
				exec("mpc repeat on");
			}else{
				exec("mpc repeat off");
			}
			break;
		case "random":
			if($value == "on"){
				exec("mpc random on");
			}else{
				exec("mpc random off");
			}
			break;
		case "prev":
			exec("mpc prev");
 			break;
		case "next":
			exec("mpc next");
			break;
	}
	$output_data["Code"] = 0;
	$output_data["Result"] = "Success";
	$http_code = 200;
	json_output($output_data, $http_code);
