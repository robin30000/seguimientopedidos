<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'registroEquipos':
            require_once '../class/registroEquipos.php';
            $user = new RegistroEquipos();
            $res = $user->registroEquipos($data['data']);
            echo json_encode($res);
            break;
        case 'csvRegistroEquipos':
            require_once '../class/registroEquipos.php';
            $user = new RegistroEquipos();
            $user->csvRegistroEquipos($data['data']);
            break;

        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
