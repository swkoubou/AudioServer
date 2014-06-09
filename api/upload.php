<?php
	require_once 'functions.php';
	require_once 'db.php';
    require_once 'MP3/Id.php';

	$code = 0;

	// 楽曲ファイルのアップロードを行う
	$code++;
	if(!is_uploaded_file($_FILES["file"]["tmp_name"])){
		$output = array('Code' => $code, 'Error' => 'Please upload the file');
		json_output($output, 400);
	}

	$_FILES["file"]["tmp_name"] = sql_escape($_FILES["file"]["tmp_name"]);
	$_FILES["file"]["name"] = sql_escape($_FILES["file"]["name"]);
	
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

    $music_file_name = $_FILES["file"]["name"];
    $music_file_path = "../music/".$music_file_name;
	
	// 同名のファイルが存在するかをチェック
	$code++;
	if(is_file($music_file_path)){
		$output = array('Code' => $code, 'Error' => 'File with the same name already exists');
		json_output($output, 400);
	}
	
	// musicフォルダに移動する
	$code++;
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

//    $mp3tag_info = id3_get_tag($music_file_path);

    if($file_type != "mp3"){//mp3以外
        $query = <<<_EOF
insert into music(name,file_name,user_id) values (
'$file_name2', '$music_file_name', '$user_id')
_EOF;
    }else{//mp3
        $mp3tag_info = new MP3_Id();
        $mp3tag_info->read($music_file_path);
        $mp3_title = sql_escape($mp3tag_info->getTag("title"));
        $mp3_artist = sql_escape($mp3tag_info->getTag("artists"));
        $mp3_album = sql_escape($mp3tag_info->getTag("album"));
        $query = <<<_EOF
insert into music(name,file_name,user_id,title,artist,album) values (
'$file_name', '$music_file_name', '$user_id', '$mp3_title','$mp3_artist', '$mp3_album')
_EOF;
    }

    $result = mysqli_query($db, $query);
	$code++;
	if(!$result){
        echo mysqli_error($db);
		$output = array('Code' => $code, 'Error' => 'Insert Query Error: '. mysqli_error($db));
		json_output($output, 400);
	}
	
	exec("mpc update");
	$output = array('Code' => '0', 'Success' => 'Success to upload');
	json_output($output, 200);
