<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

//echo  date('Y-m-d H:i:s');exit();

require_once '../class/conection.php';

$conn = new Conection();

//$val = 123;
$url = "http://10.100.66.254/BB8/contingencias/Buscar/GetToip/MTA_VOZ";

//echo $url;exit();
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

curl_setopt($ch, CURLOPT_URL, "$url");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, 0);

curl_setopt($ch, CURLOPT_TIMEOUT, 60);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
$data = curl_exec($ch);
curl_close($ch);

$dataclick = json_decode($data, true);

echo "<pre>";
print_r($dataclick);
echo "</pre>";exit();

$datos = $dataclick;
$total = count($datos);
$count = 0;

try {

    for ($i = 0; $i < $total; $i++) {

        $fecha = date('Y-m-d');

        $stmt = $conn->prepare("SELECT * FROM activacion_toip where pedido = :pedido and en_gestion != 2");
        $stmt->execute(['pedido' => $datos[$i]['UNEPedido']]);

        if ($stmt->rowCount()) {
            continue;
        } else {
            $stmt = $conn->prepare("INSERT INTO activacion_toip (pedido, tarea, serial, mac, region, numero_toip, hora_ingreso, hora_cierre_click, respuesta_aprov, eq_producto, categoria, task_type, equipment_id, tipo_equipo, identificador_servicio)
                                    VALUES (:pedido, :tarea, :serial, :mac, :region, :numero_toip, :hora_ingreso, :hora_respuesta, :respuesta_aprov, :eq_producto, :categoria, :task_type, :equipment_id, :tipo_equipo, :identificador_servicio)");

            $stmt->execute([
                ':pedido'                => $datos[$i]['UNEPedido'],
                ':tarea'                 => $datos[$i]['CallID'],
                ':serial'                => $datos[$i]['SerialNo'],
                ':mac'                   => $datos[$i]['MAC'],
                ':region'                => $datos[$i]['Region'],
                ':numero_toip'           => $datos[$i]['NumeroToIP'],
                ':hora_ingreso'          => date('Y-m-d H:i:s'),
                ':hora_respuesta'        => $datos[$i]['Hora_Respuesta'],
                ':respuesta_aprov'       => $datos[$i]['RespuestaAprov'],
                ':eq_producto'           => $datos[$i]['EQProducto'],
                ':categoria'             => $datos[$i]['Categoria'],
                ':task_type'             => $datos[$i]['TaskType'],
                ':equipment_id'          => $datos[$i]['EquipmentID'],
                ':tipo_equipo'           => $datos[$i]['TipoEquipo'],
                ':identificador_servicio' => $datos[$i]['IdentificadorServicio'],
            ]);

            if ($stmt->rowCount()) {
                $count++;
            }
        }

    }
} catch (PDOException $e) {
    var_dump($e);
}

if ($count) {
    echo 'Se ingresaron en la fecha ' . date('Y-m-d H:i:s') . ' ' . $count . ' registros';
} else {
    echo 'No se ingresaron registros en bd sin gestionar fecha ' . date('Y-m-d H:i:s');
}



