<?php


header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'mesa1':
            require_once '../class/MesasNacionales.php';
            $user = new MesasNacionales();
            $res = $user->mesa1($data['data']);
            echo json_encode($res);
            break;
        case 'mesa2':
            require_once '../class/MesasNacionales.php';
            $user = new MesasNacionales();
            $res = $user->mesa2($data['data']);
            echo json_encode($res);
            break;
        case 'mesa3':
            require_once '../class/MesasNacionales.php';
            $user = new MesasNacionales();
            $res = $user->mesa3($data['data']);
            echo json_encode($res);
            break;
        case 'mesa4':
            require_once '../class/MesasNacionales.php';
            $user = new MesasNacionales();
            $res = $user->mesa4($data['data']);
            echo json_encode($res);
            break;
        case 'mesa6':
            require_once '../class/MesasNacionales.php';
            $user = new MesasNacionales();
            $res = $user->mesa6($data['data']);
            echo json_encode($res);
            break;
        case 'mesa7':
            require_once '../class/MesasNacionales.php';
            $user = new MesasNacionales();
            $res = $user->mesa7($data['data']);
            echo json_encode($res);
            break;
        case 'registros':
            require_once '../class/MesasNacionales.php';
            $user = new MesasNacionales();
            $res = $user->registros($data['data']);
            echo json_encode($res);
            break;
        case 'marca':
            require_once '../class/MesasNacionales.php';
            $user = new MesasNacionales();
            $res = $user->marca($data['data']);
            echo json_encode($res);
            break;
        case 'guarda':
            require_once '../class/MesasNacionales.php';
            $user = new MesasNacionales();
            $res = $user->guarda($data['data']);
            echo json_encode($res);
            break;
        case 'detalleMesa':
            require_once '../class/MesasNacionales.php';
            $user = new MesasNacionales();
            $res = $user->detalleMesa($data['data']);
            echo json_encode($res);
            break;
        case 'graphic':
            require_once '../class/MesasNacionales.php';
            $user = new MesasNacionales();
            $res = $user->graphic($data['data']);
            echo json_encode($res);
            break;
        case 'graphicDetails':
            require_once '../class/MesasNacionales.php';
            $user = new MesasNacionales();
            $res = $user->graphicDetails($data['data']);
            echo json_encode($res);
            break;
        case 'gestionPorHora':
            require_once '../class/MesasNacionales.php';
            $user = new MesasNacionales();
            $res = $user->gestionPorHora($data['data']);
            echo json_encode($res);
            break;

        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
