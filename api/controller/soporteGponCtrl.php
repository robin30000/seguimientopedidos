<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'getSoporteGponByTask':
            require_once '../class/soporteGpon.php';
            $user = new soporteGpon();
            $user->getSoporteGponByTask($data['data']);
            break;
        case 'validarLlenadoSoporteGpon':
            require_once '../class/soporteGpon.php';
            $user = new soporteGpon();
            $user->validarLlenadoSoporteGpon($data['data']);
            break;
        case 'postPendientesSoporteGpon':
            require_once '../class/soporteGpon.php';
            $user = new soporteGpon();
            $user->postPendientesSoporteGpon($data['data']);
            break;
        case 'getListaPendientesSoporteGpon':
            require_once '../class/soporteGpon.php';
            $user = new soporteGpon();
            $user->getListaPendientesSoporteGpon();
            break;
        case 'gestionarSoporteGpon':
            require_once '../class/soporteGpon.php';
            $user = new soporteGpon();
            $user->gestionarSoporteGpon($data['data']);
            break;
        case 'registrossoportegpon':
            require_once '../class/soporteGpon.php';
            $user = new soporteGpon();
            $user->registrossoportegpon($data['data']);
            break;
        case 'csvRegistrosSoporteGpon':
            require_once '../class/soporteGpon.php';
            $user = new soporteGpon();
            $user->csvRegistrosSoporteGpon($data['data']);
            break;
        case 'marcarEngestionGpon':
            require_once '../class/soporteGpon.php';
            $user = new soporteGpon();
            $user->marcarEngestionGpon($data['data']);
            break;
        case 'BuscarSoporteGpon':
            require_once '../class/soporteGpon.php';
            $user = new soporteGpon();
            $user->BuscarSoporteGpon($data['data']);
            break;
        case 'graphic':
            require_once '../class/ETP.php';
            $user = new ETP();
            $res = $user->graphic($data['data']);
            echo json_encode($res);
            break;
        case 'graphicDetails':
            require_once '../class/ETP.php';
            $user = new ETP();
            $res = $user->graphicDetails($data['data']);
            echo json_encode($res);
            break;
        case 'gestionPorHora':
            require_once '../class/ETP.php';
            $user = new ETP();
            $res = $user->gestionPorHora($data['data']);
            echo json_encode($res);
            break;
        case 'datosEtb':
            require_once '../class/soporteGpon.php';
            $user = new soporteGpon();
            $res = $user->datosEtb();
            echo json_encode($res);
            break;
        case 'datosGpon':
            require_once '../class/soporteGpon.php';
            $user = new soporteGpon();
            $res = $user->datosGpon();
            echo json_encode($res);
            break;
        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
