<?php


header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'listarTipificaciones':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->listarTipificaciones();
            echo json_encode($response);
            break;
        case 'insertarRegistroFallas':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->insertarRegistroFallas($data['data']);
            echo json_encode($response);
            break;
        case 'miRegistroFallas':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->miRegistroFallas($data['data']);
            echo json_encode($response);
            break;
        case 'listarRegistrosFallas':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->listarRegistrosFallas($data['data']);
            echo json_encode($response);
            break;
        case 'miRegistrosFallas':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->miRegistrosFallas($data['data']);
            echo json_encode($response);
            break;
        case 'registrosFallas':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->registrosFallas($data['data']);
            echo json_encode($response);
            break;
        case 'marca':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->marca($data['data']);
            echo json_encode($response);
            break;
        case 'ObservacioAvance':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->ObservacioAvance($data['data']);
            echo json_encode($response);
            break;
        case 'guardaImpactoFalla':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->guardaImpactoFalla($data['data']);
            echo json_encode($response);
            break;
        case 'verObservacioAvance':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->verObservacioAvance($data['data']);
            echo json_encode($response);
            break;
        case 'guardarFalla':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->guardarFalla($data['data']);
            echo json_encode($response);
            break;
        case 'ActualizaFallas':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->ActualizaFallas($data['data']);
            echo json_encode($response);
            break;
        case 'ExportaRegistroFalla':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->ExportaRegistroFalla($data['data']);
            echo json_encode($response);
            break;
        case 'conteoFallas':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->conteoFallas($data['data']);
            echo json_encode($response);
            break;
        case 'listarImpactoFallas':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->listarImpactoFallas($data['data']);
            echo json_encode($response);
            break;
        case 'addCriticidad':
            require_once '../class/RegistroFallas.php';
            $user = new RegistroFallas();
            $response = $user->addCriticidad($data['data']);
            echo json_encode($response);
            break;

        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
