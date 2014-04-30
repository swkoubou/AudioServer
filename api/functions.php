<?php
	/**
	 * json形式のデータを出力して終了する
	 * 
	 * @param type $output_data 出力するデータ
	 * @param type $http_code JSONを返す際のHTTPステータスコード
	 */
	function json_output($output_data,$http_code){
		header('HTTP', true, $http_code);
		header('Content-Type: text/javascript; charset=utf-8');
		echo json_encode($output_data,JSON_NUMERIC_CHECK);
		exit;
	}