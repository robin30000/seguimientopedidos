<?php


header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

/*if (isset($_GET['method'])) {
    switch ($_GET['method']) {
        case 'chartContingencia':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $res = $user->chartContingencia($_GET['fecha']);
            echo json_encode($res);
            break;
        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}*/

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'chartContingencia':
            require_once '../class/ApiGraficoCco.php';
            $user = new ApiGraficoCco();
            $res = $user->chartContingencia($data['fecha']);
            echo json_encode($res);
            break;
        case 'activacionToip':
            require_once '../class/ApiGraficoCco.php';
            $user = new ApiGraficoCco();
            $res = $user->activacionToip();
            echo json_encode($res);
            break;
        case 'mesasNacionales':
            require_once '../class/ApiGraficoCco.php';
            $user = new ApiGraficoCco();
            $res = $user->mesasNacionales($data['data']);
            echo json_encode($res);
            break;
        case 'guarda':
            require_once '../class/ETP.php';
            $user = new ETP();
            $res = $user->guarda($data['data']);
            echo json_encode($res);
            break;
        case 'datosTerminados':
            require_once '../class/ETP.php';
            $user = new ETP();
            $res = $user->datosTerminados($data['data']);
            echo json_encode($res);
            break;
        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}