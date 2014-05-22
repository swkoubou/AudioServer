<?php

if (count($argv) < 3) {
    echo "引数2つないとSWAPできないってわからないんですか\n";
    exit(1);
}

$music_id1 = $argv[1];
$music_id2 = $argv[2];

if (!is_numeric($music_id1) || !is_numeric($music_id2)) {
    echo "なんで数字じゃないですかね\n";
    exit(1);
}

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

function execute($db, $sql, array $params = []) {
    $stmt = $db->prepare($sql);
    foreach ($params as $key => $v) {
        list($value, $type) = (array)$v + array(1 => PDO::PARAM_STR);
        $stmt->bindValue(is_int($key) ? ++$key : $key, $value, is_null($value) ? PDO::PARAM_NULL : $type);
    }

    $stmt->execute();
    return $stmt;
}

$temp_music_id1 = 1000000;
$temp_music_id2 = 1000001;

try {
    $db->beginTransaction();
    $stmt = execute($db, "update music set id = ? where id = ?", [$temp_music_id1, $music_id1]);
    $stmt = execute($db, "update music set id = ? where id = ?", [$temp_music_id2, $music_id2]);
    $stmt = execute($db, "update music set id = ? where id = ?", [$music_id1, $temp_music_id2]);
    $stmt = execute($db, "update music set id = ? where id = ?", [$music_id2, $temp_music_id1]);
} catch (Exception $e) {
    $db->rollBack();
    throw new Exception($e);
}

$db->commit();
