<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"));
var_dump($data);exit();

if (isset($data->method)) {
    switch ($data->method) {
        case 'login':
            require_once '../class/user.php';
            $user = new user();
            $user->login($data->data);
            break;

        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
