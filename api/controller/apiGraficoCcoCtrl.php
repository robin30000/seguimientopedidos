<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
	switch ($data['method']) {
		case 'activacionToip':
			require_once '../class/ApiGraficoCco.php';
			$user = new ApiGraficoCco();
			$res = $user->activacionToip();
			echo json_encode($res);
			break;
		case 'mesasNacionales':
			require_once '../class/ApiGraficoCco.php';
			$user = new ApiGraficoCco();
			$res = $user->mesasNacionales($data['data']);
			echo json_encode($res);
			break;
		case 'gestionEtp':
			require_once '../class/ApiGraficoCco.php';
			$user = new ApiGraficoCco();
			$res = $user->gestionEtp();
			echo json_encode($res);
			break;
		case 'registroSoporteGpon':
			require_once '../class/ApiGraficoCco.php';
			$user = new ApiGraficoCco();
			$res = $user->registroSoporteGpon();
			echo json_encode($res);
			break;

		default:
			echo 'ninguna opción valida.';
			break;
	}
} else {
	echo 'ninguna opción valida.';
}