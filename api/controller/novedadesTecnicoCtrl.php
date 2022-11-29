<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"));

if (isset($data->method)) {
    switch ($data->method) {
        case 'novedadesTecnico':
            require_once '../class/novedadesTecnico.php';
            $user = new novedadesTecnico();
            $user->novedadesTecnico($data->data);
            break;
        case 'guardarNovedadesTecnico':
            require_once '../class/novedadesTecnico.php';
            $user = new novedadesTecnico();
            $user->guardarNovedadesTecnico($data->data);
            break;
        case 'updateNovedadesTecnico':
            require_once '../class/novedadesTecnico.php';
            $user = new novedadesTecnico();
            $user->updateNovedadesTecnico($data->data);
            break;
        case 'csvNovedadesTecnico':
            require_once '../class/novedadesTecnico.php';
            $user = new novedadesTecnico();
            $user->csvNovedadesTecnico($data->data);
            break;

        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
