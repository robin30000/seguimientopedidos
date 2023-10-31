<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'cargaData':
            require_once '../class/Ruteo.php';
            $user     = new Ruteo();
            $response = $user->cargaData($data['data']);
            echo json_encode($response);
            break;
        case 'dataCompara':
            require_once '../class/Ruteo.php';
            $user     = new Ruteo();
            $response = $user->dataCompara($data['data']);
            echo json_encode($response);
            break;
        case 'analisisDia':
            require_once '../class/Ruteo.php';
            $user     = new Ruteo();
            $response = $user->analisisDia($data['data']);
            echo json_encode($response);
            break;
        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
