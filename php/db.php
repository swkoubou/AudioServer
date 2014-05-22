<?php

class DB {
	public $db;

	public function initDB() {
		$db = new PDO(
			'mysql:host=localhost;dbname=musicdb;charset=utf8;',
			'root',
			'raspberry',
			[
				PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
				PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,
				PDO::ATTR_EMULATE_PREPARES => true
			]
		);
	}

	public execute($db, $sql, array $params = []) {
		$stmt = $db->prepare($sql);
		foreach ($params as $key => $v) {
			list($value, $type) = (array)$v + array(1 => PDO::PARAM_STR);
			$stmt->bindValue(is_int($key) ? ++$key : $key, $value, is_null($value) ? PDO::PARAM_NULL : $type);
		}

		$stmt->execute();
		return $stmt;
	}
}
