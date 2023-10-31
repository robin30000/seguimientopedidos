<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"));

if (isset($data->method)) {
    switch ($data->method) {
        case 'login':
            require_once '../class/authentication.php';
            $user = new authentication();
            $user->loginUser($data->data);
            break;
        case 'logout':
            require_once '../class/authentication.php';
            $user = new authentication();
            $user->updatesalida();
            break;
        case 'checkSession':
            require_once '../class/authentication.php';
            $user = new authentication();
            $user->checkSession();
            break;
        case 'SuperB':
            require_once '../class/authentication.php';
            $user = new authentication();
            $res = $user->SuperB($data->data);
            echo json_encode($res);
            break;

        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
