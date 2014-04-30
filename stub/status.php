<?php

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    // return status
    $res = [
        "isPlay" => false,
        "isRepeat" => false,
        "isRandom" => false,
        "volume" => 80,
        "musicID" => 1,
    ];

    echo json_encode($res, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
};