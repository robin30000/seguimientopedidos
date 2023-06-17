<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
//var_dump($_REQUEST);Exit();
$data = json_decode(file_get_contents("php://input"), true);

//var_dump($data);Exit();

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'ciudades':
            require_once '../class/formaAsesores.php';
            $user = new formaAsesores();
            $user->ciudades();
            break;
        case 'regionesTip':
            require_once '../class/formaAsesores.php';
            $user = new formaAsesores();
            $user->regionesTip();
            break;
        case 'procesos':
            require_once '../class/formaAsesores.php';
            $user = new formaAsesores();
            $user->procesos();
            break;
        case 'registros':
            require_once '../class/formaAsesores.php';
            $user = new formaAsesores();
            $user->registros($data['data']);
            break;
        case 'registroscsv':
            require_once '../class/formaAsesores.php';
            $user = new formaAsesores();
            $user->registroscsv($data['data']);
            break;
        case 'cargaRegistros':
            require_once '../class/formaAsesores.php';
            $user = new formaAsesores();
            $user->cargaRegistros($data['data']);
            break;


        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}