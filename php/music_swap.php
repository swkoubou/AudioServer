<?php

require_once "db.php";

function music_swap($music_id1, $music_id2, $db = null, $transaction = true) {
	if (!is_numeric($music_id1) || !is_numeric($music_id2)) {
		throw new InvalidArgumentException("arg1 and arg2 is must be numeric.");
	}

	if ($db === null) {
		$db = new DB();
	}

	$temp_music_id1 = 1000000;
	$temp_music_id2 = 1000001;

	try {
		if ($transaction) {
			$db->db->beginTransaction();
		}

		$stmt = $db->execute($db, "update music set id = ? where id = ?", [$temp_music_id1, $music_id1]);
		$stmt = $db->execute($db, "update music set id = ? where id = ?", [$temp_music_id2, $music_id2]);
		$stmt = $db->execute($db, "update music set id = ? where id = ?", [$music_id1, $temp_music_id2]);
		$stmt = $db->execute($db, "update music set id = ? where id = ?", [$music_id2, $temp_music_id1]);
	} catch (Exception $e) {
		if ($transaction) {
			$db->db->rollBack();
		}

		throw new Exception($e);
	}

	if ($transaction) {
		$db->db->commit();
	}
}

function music_sort($start, $end, $db = null) {
<<<<<<< HEAD
	if ($db === null) {
		$db = new DB();
	}

	try {
		$stmt = $db->execute($db, "select id, name from music where id >= ? and id <= ? order by id", [$start, $end]);
	} catch (Exception $e) {
		throw new Exception($e);
	}

	$N = $stmt->rowCount();
	$musics = $stmt->fetchAll();

	$db->db->beginTransaction();
	try {
		for ($i = 0; $i < $N; $i++) {
			for ($j = $i + 1; $j < $N; $j++) {
				if ($musics[$i]["name"] > $musics[$j]["name"]) {
					music_swap($musics[$i]["id"], $musics[$j]["id"], $db, false);
					list($musics[$i]["name"], $musics[$j]["name"]) =
						array($musics[$j]["name"], $musics[$i]["name"]);
				}
			}
		}
	} catch (Exception $e) {
		$db->db->rollBack();
		throw new Exception($e);
	}

	$db->db->commit();
}
