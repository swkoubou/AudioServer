<?php
	require_once 'functions.php';
	require_once 'db.php';
	
	$playlist_id = filter_input(INPUT_POST, "playlist_id", FILTER_SANITIZE_NUMBER_INT);
	$music_id = $_POST["music_id"];
	$result = mysqli_query($db, "select * from playlistdata where playlistid = $playlist_id");
	$track = mysqli_num_rows($result) + 1;
	
	foreach($music_id as $name => $value){
		mysqli_query($db, "insert into playlistdata(playlistid,musicid,track) values ($playlist_id,$value,$track)");
		if($playlist_id == -1){
			$result = mysqli_query($db, "select * from music where id = $value");
			$row = mysqli_fetch_assoc($result);
			exec("mpc add '".$row["file_name"]."'");
		}
		$track++;
	}
	
