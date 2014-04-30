<?php

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    // return musics
    $res = [
        '1' => [
            "id" => 1,
            "name" => "タイスの瞑想曲",
            "user" => "1"
        ],
        2 => [
            "id" => 2,
            "name" => "月の光",
            "user" => "1"
        ],
        3 => [
            "id" => 3,
            "name" => "アラベスク第１番",
            "user" => 2
        ],
        4 => [
            "id" => 4,
            "name" => "アイネ・クライネ・ナハトムジーク～第２楽章",
            "user" => 2
        ],
        5 => [
            "id" => 5,
            "name" => "夜想曲第２番",
            "user" => 1
        ],
        6 => [
            "id" => 6,
            "name" => "ジムノペディ第１番",
            "user" => 2
        ]
    ];

    echo json_encode($res, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);

} else if ($method === "POST") {
    // upload musics
    $file = isset( $_FILES['file']['tmp_name'] ) ? $_FILES['file']['tmp_name'] : null;

    var_dump( $file );

}else if ($method === "DELETE") {
    // delete musics

};