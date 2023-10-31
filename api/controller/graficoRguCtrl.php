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
            require_once '../class/GraficoRgu.php';
            $user = new GraficoRgu();
            $res  = $user->datos($data['data']);
            echo json_encode($res);
            break;
        case 'buscar':
            require_once '../class/GraficoRgu.php';
            $user = new GraficoRgu();
            $res  = $user->buscar($data['data']);
            echo json_encode($res);
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
