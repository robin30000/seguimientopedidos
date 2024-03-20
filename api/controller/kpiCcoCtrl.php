<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'chartContingencia':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $res = $user->chartContingencia($data['data']);
            echo json_encode($res);
            break;
        case 'chartAllContingencia':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $dateInit = $data['dateInit'];
            $dateEnd = $data['dateEnd'];
            $res = $user->chartAllContingencia($dateInit, $dateEnd);
            echo json_encode($res);
            break;
        case 'chartToip':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $res = $user->chartToip($data['data']);
            echo json_encode($res);
            break;
        case 'chartAllToip':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $dateInit = $data['dateInit'];
            $dateEnd = $data['dateEnd'];
            $res = $user->chartAllToip($dateInit, $dateEnd);
            echo json_encode($res);
            break;
        case 'chartEtp':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $res = $user->chartEtp($data['data']);
            echo json_encode($res);
            break;
        case 'chartAllEtp':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $dateInit = $data['dateInit'];
            $dateEnd = $data['dateEnd'];
            $res = $user->chartAllEtp($dateInit, $dateEnd);
            echo json_encode($res);
            break;
        case 'chartGpon':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $res = $user->chartGpon($data['data']);
            echo json_encode($res);
            break;
        case 'chartAllGpon':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $dateInit = $data['dateInit'];
            $dateEnd = $data['dateEnd'];
            $res = $user->chartAllGpon($dateInit, $dateEnd);
            echo json_encode($res);
            break;
        case 'chartValidacion':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $res = $user->chartValidacion($data['data']);
            echo json_encode($res);
            break;
        case 'chartAllValidacion':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $dateInit = $data['dateInit'];
            $dateEnd = $data['dateEnd'];
            $res = $user->chartAllValidacion($dateInit, $dateEnd);
            echo json_encode($res);
            break;
        case 'chartEmt':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $res = $user->chartEmt($data['data']);
            echo json_encode($res);
            break;
        case 'chartAllEmt':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $dateInit = $data['dateInit'];
            $dateEnd = $data['dateEnd'];
            $res = $user->chartAllEmt($dateInit, $dateEnd);
            echo json_encode($res);
            break;

        case 'chartAllQuejas':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $dateInit = $data['dateInit'];
            $dateEnd = $data['dateEnd'];
            $res = $user->chartAllQuejas($dateInit, $dateEnd);
            echo json_encode($res);
            break;
        case 'graficoSiebel':
            require_once '../class/KpiCco.php';
            $user = new KpiCco();
            $res = $user->charSiebel($data['data']);
            echo json_encode($res);
            break;
        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
