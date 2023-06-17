<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'getMenu':
            require_once '../class/MenuPerfil.php';
            $user = new MenuPerfil();
            $user->getMenu();
            break;
        case 'getSubmenu':
            require_once '../class/MenuPerfil.php';
            $user = new MenuPerfil();
            $user->getSubmenu();
            break;
        case 'getPerfil':
            require_once '../class/MenuPerfil.php';
            $user = new MenuPerfil();
            $user->getPerfil();
            break;
        case 'verMenuPerfil':
            require_once '../class/MenuPerfil.php';
            $user = new MenuPerfil();
            $user->verMenuPerfil($data['data']);
            break;
        case 'cambioMenu':
            require_once '../class/MenuPerfil.php';
            $user = new MenuPerfil();
            $user->cambioMenu($data['data']);
            break;
        case 'cambiaEstadoSubmenu':
            require_once '../class/MenuPerfil.php';
            $user = new MenuPerfil();
            $user->cambiaEstadoSubmenu($data['data']);
            break;
        case 'guardaNuevoSubmenu':
            require_once '../class/MenuPerfil.php';
            $user = new MenuPerfil();
            $user->guardaNuevoSubmenu($data['data']);
            break;
        case 'guardaPerfil':
            require_once '../class/MenuPerfil.php';
            $user = new MenuPerfil();
            $user->guardaPerfil($data['data']);
            break;
        case 'quitarUsuarioKpi':
            require_once '../class/MenuPerfil.php';
            $user = new MenuPerfil();
            $user->quitarUsuarioKpi($data['data']);
            break;
        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
