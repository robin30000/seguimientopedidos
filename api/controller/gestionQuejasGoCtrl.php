<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'datosQuejasGo':
            require_once '../class/GestionQuejasGo.php';
            $user = new GestionQuejasGo();
            $user->datosQuejasGo();
            break;
        case 'datosQuejasGoTerminado':
            require_once '../class/GestionQuejasGo.php';
            $user = new GestionQuejasGo();
            $user->datosQuejasGoTerminado($data['data']);
            break;
        case 'marcarEnGestionQuejasGo':
            require_once '../class/GestionQuejasGo.php';
            $user = new GestionQuejasGo();
            $user->marcarEnGestionQuejasGo($data['data']);
            break;
        case 'guardaGestionQuejasGo':
            require_once '../class/GestionQuejasGo.php';
            $user = new GestionQuejasGo();
            $user->guardaGestionQuejasGo($data['data']);
            break;
        case 'detalleNumeroQuejaGo':
            require_once '../class/GestionQuejasGo.php';
            $user = new GestionQuejasGo();
            $user->detalleNumeroQuejaGo($data['data']);
            break;
        case 'csvQuejaGo':
            require_once '../class/GestionQuejasGo.php';
            $user = new GestionQuejasGo();
            $user->csvQuejaGo($data['data']);
            break;

        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
