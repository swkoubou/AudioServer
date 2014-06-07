<?php
	require_once 'functions.php';
	require_once 'db.php';
	$code = 0;

	// 楽曲ファイルのアップロードを行う
	$code++;
    json_output($_POST, 400);
	if(!is_uploaded_file($_FILES["file"]["tmp_name"])){
		$output = array('Code' => $code, 'Error' => 'Please upload the file');
		json_output($output, 400);
	}

	$_FILES["file"]["tmp_name"] = htmlspecialchars($_FILES["file"]["tmp_name"], ENT_QUOTES | ENT_NOQUOTES);
	$_FILES["file"]["name"] = htmlspecialchars($_FILES["file"]["name"], ENT_QUOTES | ENT_NOQUOTES);
	
	$file_name = $_FILES["file"]["tmp_name"];
	
	$file_name_split = explode(".", $file_name);
	$file_name2_split = explode(".",$_FILES["file"]["name"]);
	$file_name2 = "";
	for($i=0;$i<count($file_name2_split)-1;$i++){
		$file_name2 .= $file_name2_split[$i];
	}
	
	// {mp3|wma|wav|flac}じゃなかったらアップロード不可にする
	$code++;
        $file_type = $file_name2_split[count($file_name2_split)-1];
        if ($file_type != "mp3" && $file_type != "wav" && $file_type != "wma" && $file_type != "flac") {
		$output = array('Code' => $code, 'Error' => 'Please upload the file format {mp3|wma|wav|flac}. ');
		json_output($output, 400);
	}
	
	// 名前がPOSTで送られてきているかをチェック
	$code++;
	$user_name = filter_input(INPUT_POST, "name", FILTER_SANITIZE_SPECIAL_CHARS);
	if(!$user_name || $user_name == "" || $user_name == NULL){
		$output = array('Code' => $code, 'Error' => 'Please POST your name');
		json_output($output, 400);
	}
	
	// 同名のファイルが存在するかをチェック
	$code++;
	if(is_file("../music/".$_FILES["file"]["name"])){
		$output = array('Code' => $code, 'Error' => 'File with the same name already exists');
		json_output($output, 400);
	}
	
	// musicフォルダに移動する
	$code++;
    $music_file_name = $_FILES["file"]["name"];
    $music_file_path = "../music/".$music_file_name;
	if(!move_uploaded_file($file_name, $music_file_path)){
		$output = array('Code' => $code, 'Error' => 'Failed to upload');
		json_output($output, 400);
	}
	chmod($music_file_path, 0644);
	
	// dbに登録した情報を保存する
	// ユーザ名の処理
	$code++;
	$result = mysqli_query($db, "select id from user where name = '".$user_name."'");
	if(!$result){
		$output = array('Code' => $code, 'Error' => 'Select Query Error');
		json_output($output, 400);
	}
	$row_cnt = mysqli_num_rows($result);
	
	if($row_cnt != 0){
		$row = mysqli_fetch_assoc($result);
		$user_id = $row["id"];
	}else{
		mysqli_query($db, "insert into user(name) values ('$user_name')");
		$result = mysqli_query($db, "select id from user where name = '".$user_name."'");
		$code++;
		if(!$result){
			$output = array('Code' => $code, 'Error' => 'Select Query Error');
			json_output($output, 400);
		}
		$row = mysqli_fetch_assoc($result);
		$user_id = $row["id"];
	}
	
	// 楽曲テーブルに曲情報の追加

    $mp3tag_info = id3_get_tag($music_file_path);
    $query = <<<_EOF
insert into music(name,file_name,user_id,title,artist,album) values (
$file_name, $music_file_name, $user_id,
{$mp3tag_info["title"]},{$mp3tag_info["artist"]},{$mp3tag_info["album"]})
_EOF;



	mysqli_query($db, $query);
	$code++;
	if(!$result){
		$output = array('Code' => $code, 'Error' => 'Insert Query Error');
		json_output($output, 400);
	}
	
	exec("mpc update");
	$output = array('Code' => '0', 'Success' => 'Success to upload');
	json_output($output, 200);
