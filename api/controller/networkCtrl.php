<?php


header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'cierreMasivo':
            require_once '../class/Network.php';
            $user = new Network();
            $res = $user->cierreMasivo($data['data']);
            echo json_encode($res);
            break;
        case 'cierreIndividual':
            require_once '../class/Network.php';
            $user = new Network();
            $res = $user->cierreIndividual($data['data']);
            echo json_encode($res);
            break;
        case 'registros':
            require_once '../class/Network.php';
            $user = new Network();
            $res = $user->registros($data['data']);
            echo json_encode($res);
            break;

        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
