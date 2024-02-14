<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'extraeQuejasGoDia':
            require_once '../class/quejasGo.php';
            $user = new quejasGo();
            $user->listaQuejasGoDia($data['data']);
            break;

        case 'csvQuejasGo':
            require_once '../class/quejasGo.php';
            $user = new quejasGo();
            $user->csvQuejasGo($data['data']);
            break;

        case 'traerTecnico':
            require_once '../class/quejasGo.php';
            $user = new quejasGo();
            $user->buscarTecnico($data['data']);
            break;

        case 'creaTecnicoQuejasGo':
            require_once '../class/quejasGo.php';
            $user = new quejasGo();
            $user->creaTecnicoQuejasGo($data['data']);
            break;
        case 'ciudadesQGo':
            require_once '../class/quejasGo.php';
            $user = new quejasGo();
            $user->ciudadesQGo();
            break;
        case 'registrarQuejaGo':
            require_once '../class/quejasGo.php';
            $user = new quejasGo();
            $user->registrarQuejaGo($data['data']);
            break;
        case 'ActualizarObserQuejasGo':
            require_once '../class/quejasGo.php';
            $user = new quejasGo();
            $user->ActualizarObserQuejasGo($data['data']);
            break;
        case 'graphic':
            require_once '../class/quejasGo.php';
            $user = new quejasGo();
            $res = $user->graphic($data['data']);
            echo json_encode($res);
            break;
        case 'graphicDetails':
            require_once '../class/quejasGo.php';
            $user = new quejasGo();
            $res = $user->graphicDetails($data['data']);
            echo json_encode($res);
            break;
        case 'gestionPorHora':
            require_once '../class/quejasGo.php';
            $user = new quejasGo();
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
