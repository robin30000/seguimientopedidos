<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {

    switch ($data['method']) {

        case 'DepartamentosContratos':
            require_once '../class/otrosServicios.php';
            $user = new otrosServicios();
            $user->DepartamentosContratos($data['data']);
            break;
        case 'insertData':
            require_once '../class/otrosServicios.php';
            $user = new otrosServicios();
            $user->insertData($data['data']);
            break;

        case 'getRegistrosCarga':
            require_once '../class/otrosServicios.php';
            $user = new otrosServicios();
            $user->getRegistrosCarga();
            break;
        case'getDemePedidoEncuesta':
            require_once '../class/otrosServicios.php';
            $user = new otrosServicios();
            $user->getDemePedidoEncuesta();
            break;

        case 'resumenSemanas':
            require_once '../class/otrosServicios.php';
            $user = new otrosServicios();
            $user->resumenSemanas($data['data']);
            break;
        case 'listadoTecnicos':
            require_once '../class/otrosServicios.php';
            $user = new otrosServicios();
            $user->listadoTecnicos($data['data']);
            break;
        case 'buscarPedidoContingencias':
            require_once '../class/otrosServicios.php';
            $user = new otrosServicios();
            $user->buscarPedidoContingencias($data['data']);
            break;
        case 'regiones':
            require_once '../class/otrosServicios.php';
            $user = new otrosServicios();
            $res = $user->regiones();
            echo json_encode($res);
            break;
        case 'ciudades':
            require_once '../class/otrosServicios.php';
            $user = new otrosServicios();
            $res = $user->ciudades();
            echo json_encode($res);
            break;
        case 'empresas':
            require_once '../class/otrosServicios.php';
            $user = new otrosServicios();
            $res = $user->empresas();
            echo json_encode($res);
            break;
        case 'guardaTecnico':
            require_once '../class/otrosServicios.php';
            $user = new otrosServicios();
            $res = $user->guardaTecnico($data['data']);
            echo json_encode($res);
            break;
        case 'actualizaTecnico':
            require_once '../class/otrosServicios.php';
            $user = new otrosServicios();
            $res = $user->actualizaTecnico($data['data']);
            echo json_encode($res);
            break;
        default:
            echo 'ninguna opción valida.';
            break;

    }
} else {
    echo 'ninguna opción valida.';
}
