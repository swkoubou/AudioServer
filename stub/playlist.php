<?php

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    // return playlist
    $res = [
        -1 => [
            "id" => -1,
            "name" => "Current",
            "data" => [1, 2, 3]
        ],
        1 => [
            "id" => 1,
            "name" => "First",
            "data" => [1, 2, 3, 4, 5]
        ],
        2 => [
            "id" => 2,
            "name" => "Second",
            "data" => [3, 4, 5]
        ]
    ];

    echo json_encode($res, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
} else if ($method === "POST") {
    // create new playlist

}else if ($method === "DELETE") {
    // delete playlist

};