<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'resumenContingencias':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->resumencontingencias($data['data']);
            break;
        case 'datoscontingencias':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->datoscontingencias();
            break;

        case 'registrosOffline':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->registrosOffline($data['data']);
            break;

        case 'graficaDepartamento':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->graficaDepartamento($data['data']);
            break;

        case 'marcaPortafolio':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->marcaPortafolio($data['data']);
            break;
        case 'guardarpedidocontingencia':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->guardarpedidocontingencia($data['data']);
            break;
        case 'guardarescalamiento':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->guardarescalamiento($data['data']);
            break;
        case 'cerrarMasivamenteContingencias':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->cerrarMasivamenteContingencias($data['data']);
            break;
        case 'guardarPedidoContingenciaPortafolio':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->guardarPedidoContingenciaPortafolio($data['data']);
            break;

        case 'garantiasInstalaciones':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->garantiasInstalaciones($data['data']);
            break;

        case 'graficaAcumulados':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->graficaAcumulados($data['data']);
            break;
        case 'graficaAcumuladosrepa':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->graficaAcumuladosrepa($data['data']);
            break;

        case 'marcarengestion':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->marcarengestion($data['data']);
            break;

        case 'datosgestioncontingenciasTv':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->datosgestioncontingenciasTv($data['data']);
            break;

        case 'datosgestioncontingenciasInternet':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->datosgestioncontingenciasInternet($data['data']);
            break;
        case 'datosgestioncontingenciasPortafolio':
            require_once '../class/contingencia.php';
            $user = new contingeContingenciancia();
            $user->datosgestioncontingenciasPortafolio($data['data']);
            break;
        case 'registrosContingencias':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->registrosContingencias($data['data']);
            break;
        case 'registrosContingenciasCsv':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->registrosContingenciasCsv($data['data']);
            break;
        case 'savecontingencia':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->savecontingencia($data['data']);
            break;
        case 'csvContingencias':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->csvContingencias($data['data']);
            break;
        case 'consultaTipoTarea':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $user->consultaTipoTarea($data['data']);
            break;
        case 'damePedido':
            require_once '../class/contingencia.php';
            $user = new Contingencia();
            $res = $user->damePedido($data['data']);
            echo json_encode($res);
            break;
        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
