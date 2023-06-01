<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'contigenciaDiario':
            require_once '../class/kpi.php';
            $user = new kpi();
            $user->contigenciaDiario($data['data']);
            break;
        case 'contigenciaAgente':
            require_once '../class/kpi.php';
            $user = new kpi();
            $user->contigenciaAgente($data['data']);
            break;
        case 'contigenciaHoraAgente':
            require_once '../class/kpi.php';
            $user = new kpi();
            $user->contigenciaHoraAgente($data['data']);
            break;
        case 'contigenciaHoraAgenteApoyo':
            require_once '../class/kpi.php';
            $user = new kpi();
            $user->contigenciaHoraAgenteApoyo($data['data']);
            break;
        case 'contigenciaHoraAgenteTiempoCompleto':
            require_once '../class/kpi.php';
            $user = new kpi();
            $user->contigenciaHoraAgenteTiempoCompleto($data['data']);
            break;
        case 'contigenciaHoraAgenteMmss':
            require_once '../class/kpi.php';
            $user = new kpi();
            $user->contigenciaHoraAgenteMmss($data['data']);
            break;
        case 'AgenteEmtelco':
            require_once '../class/kpi.php';
            $user = new kpi();
            $user->AgenteEmtelco($data['data']);
            break;
        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
