<?php

require_once "db.php";

function music_swap($music_id1, $music_id2, $db, $transaction = true) {
	if (!is_numeric($music_id1) || !is_numeric($music_id2)) {
		throw new InvalidArgumentException("arg1 and arg2 is must be numeric.");
	}

	$temp_music_id1 = 1000000;
	$temp_music_id2 = 1000001;

	try {
		if ($transaction) {
			$db->db->beginTransaction();
		}

		$stmt = $dbexecute($db, "update music set id = ? where id = ?", [$temp_music_id1, $music_id1]);
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
