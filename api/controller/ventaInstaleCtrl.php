<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['method'])) {
    switch ($data['method']) {
        case 'datosVentas':
            require_once '../class/ventaInstale.php';
            $user = new ventaInstale();
            $user->datosVentas();
            break;
        case 'datosVentasTerminado':
            require_once '../class/ventaInstale.php';
            $user = new ventaInstale();
            $user->datosVentasTerminado($data['data']);
            break;
        case 'marcarEnGestionVentaInstale':
            require_once '../class/ventaInstale.php';
            $user = new ventaInstale();
            $user->marcarEnGestionVentaInstale($data);
            break;
        case 'guardaVentaInstale':
            require_once '../class/ventaInstale.php';
            $user = new ventaInstale();
            $user->guardaVentaInstale($data);
            break;
        case 'detalleVentaRagoFecha':
            require_once '../class/ventaInstale.php';
            $user = new ventaInstale();
            $user->detalleVentaRagoFecha($data['data']);
            break;
        case 'detallePedidoVenta':
            require_once '../class/ventaInstale.php';
            $user = new ventaInstale();
            $user->detallePedidoVenta($data['data']);
            break;
        case 'csvVentaInstale':
            require_once '../class/ventaInstale.php';
            $user = new ventaInstale();
            $user->csvVentaInstale($data);
            break;
        case 'guardaObservacionParaVentaInstale':
            require_once '../class/ventaInstale.php';
            $user = new ventaInstale();
            $user->guardaObservacionParaVentaInstale($data);
            break;
        case 'observacionDetalleVentaModal':
            require_once '../class/ventaInstale.php';
            $user = new ventaInstale();
            $user->observacionDetalleVentaModal();
            break;
        case 'eliminaObservacion':
            require_once '../class/ventaInstale.php';
            $user = new ventaInstale();
            $user->eliminaObservacion($data);
            break;
        case 'consolidadoZona':
            require_once '../class/ventaInstale.php';
            $user = new ventaInstale();
            $user->consolidadoZona();
            break;
        default:
            echo 'ninguna opción valida.';
            break;
    }
} else {
    echo 'ninguna opción valida.';
}
