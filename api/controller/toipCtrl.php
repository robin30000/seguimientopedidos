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
            require_once '../class/Toip.php';
            $user = new Toip();
            $res  = $user->datos($data['data']);
            echo json_encode($res);
            break;
        case 'marca':
            require_once '../class/Toip.php';
            $user = new Toip();
            $res  = $user->marca($data['data']);
            echo json_encode($res);
            break;
        case 'guarda':
            require_once '../class/Toip.php';
            $user = new Toip();
            $res  = $user->guarda($data['data']);
            echo json_encode($res);
            break;
        case 'datosTerminados':
            require_once '../class/Toip.php';
            $user = new Toip();
            $res  = $user->datosTerminados($data['data']);
            echo json_encode($res);
            break;
        case 'graficos':
            require_once '../class/Toip.php';
            $user = new Toip();
            $res  = $user->graficos($data['data']);
            echo json_encode($res);
            break;
        case 'graficoTiempo':
            require_once '../class/Toip.php';
            $user = new Toip();
            $res  = $user->graficoTiempo($data['data']);
            echo json_encode($res);
            break;
        case 'gestionPorHora':
            require_once '../class/Toip.php';
            $user = new Toip();
            $res  = $user->gestionPorHora($data['data']);
            echo json_encode($res);
            break;
        case 'registro_15':
            require_once '../class/Toip.php';
            $user = new Toip();
            $res  = $user->registro_15($data['data']);
            echo json_encode($res);
            break;
        case 'consolidado':
            require_once '../class/Toip.php';
            $user = new Toip();
            $res  = $user->consolidado($data['data']);
            echo json_encode($res);
            break;
        case 'detalles_contingencias':
            require_once '../class/Toip.php';
            $user = new Toip();
            $res  = $user->detalles_contingencias($data['data']);
            echo json_encode($res);
            break;
        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
