<?php

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    // return status
    $res = [
        1 => [
            "id" => "1",
            "name" => "igari"
        ],
        2 => [
            "id" => 2,
            "name" => "nakazawa"
        ]
    ];

    echo json_encode($res, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
};