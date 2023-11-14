<?php


header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'datos':
            require_once '../class/ETP.php';
            $user = new ETP();
            $res  = $user->datos($data['data']);
            echo json_encode($res);
            break;
        case 'marca':
            require_once '../class/ETP.php';
            $user = new ETP();
            $res  = $user->marca($data['data']);
            echo json_encode($res);
            break;
        case 'guarda':
            require_once '../class/ETP.php';
            $user = new ETP();
            $res  = $user->guarda($data['data']);
            echo json_encode($res);
            break;
        case 'datosTerminados':
            require_once '../class/ETP.php';
            $user = new ETP();
            $res  = $user->datosTerminados($data['data']);
            echo json_encode($res);
            break;
        case 'datosTerminadosRegistros':
            require_once '../class/ETP.php';
            $user = new ETP();
            $res  = $user->datosTerminadosRegistros($data['data']);
            echo json_encode($res);
            break;
        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}