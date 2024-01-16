<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

//echo  date('Y-m-d H:i:s');exit();

require_once '../class/conection.php';

$conn = new Conection();

$stmt = $conn->prepare("SELECT
                                a.equipment_id, a.respuesta_aprov,
                                CASE
                                    WHEN (SELECT COUNT(*) FROM activacion_toip b WHERE b.tarea = a.tarea AND b.en_gestion = '2') > 0 THEN
                                        'TRUE' ELSE 'FALSE' 
                                END alerta 
                            FROM
                                activacion_toip a 
                            WHERE
                                a.en_gestion != '2' AND
                                (
                                    (SELECT COUNT(*) FROM activacion_toip b WHERE b.tarea = a.tarea AND b.en_gestion = '2') > 0
                                )
                            ORDER BY
                                a.hora_ingreso;");
$stmt->execute();
$resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
//$dataclick = (array)$resultados;
$res = json_encode($resultados);

$url = "http://10.100.66.254/BB8/contingencias/Buscar/GetToip/$res";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

curl_setopt($ch, CURLOPT_URL, "$url");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, 0);

curl_setopt($ch, CURLOPT_TIMEOUT, 60);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
$data = curl_exec($ch);
//var_dump($data);exit();
curl_close($ch);

$dataclick = json_decode($data, true);


//echo $url;exit();
/*$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

curl_setopt($ch, CURLOPT_URL, "$url");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, 0);

curl_setopt($ch, CURLOPT_TIMEOUT, 60);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
$data = curl_exec($ch);
var_dump($data);exit();
curl_close($ch);

$dataclick = json_decode($data, true);*/

/*echo "<pre>";
print_r($dataclick);
echo "</pre>";exit();*/

$datos = $dataclick;
$total = count($datos);
$count = 0;

try {

    for ($i = 0; $i < $total; $i++) {

        $fecha = date('Y-m-d');

        $stmt = $conn->prepare("SELECT * FROM activacion_toip where pedido = :pedido and en_gestion != '2'");
        $stmt->execute(['pedido' => $datos[$i]['UNEPedido']]);

        if ($stmt->rowCount()) {
            continue;
        } else {
            $stmt = $conn->prepare("INSERT INTO activacion_toip (pedido, tarea, serial, mac, region, numero_toip, hora_ingreso, hora_cierre_click, respuesta_aprov, eq_producto, categoria, task_type, equipment_id, tipo_equipo, nombre_tecnico, cc_tecnico,identificador_servicio)
                                    VALUES (:pedido, :tarea, :serial, :mac, :region, :numero_toip, :hora_ingreso, :hora_respuesta, :respuesta_aprov, :eq_producto, :categoria, :task_type, :equipment_id, :tipo_equipo, :nom_tecnico, :cc_tecnico, :identificador_servicio)");

            $stmt->execute([
                ':pedido' => $datos[$i]['UNEPedido'],
                ':tarea' => $datos[$i]['CallID'],
                ':serial' => $datos[$i]['SerialNo'],
                ':mac' => $datos[$i]['MAC'],
                ':region' => $datos[$i]['Region'],
                ':numero_toip' => $datos[$i]['NumeroToIP'],
                ':hora_ingreso' => date('Y-m-d H:i:s'),
                ':hora_respuesta' => $datos[$i]['Hora_Respuesta'],
                ':respuesta_aprov' => $datos[$i]['RespuestaAprov'],
                ':eq_producto' => $datos[$i]['EQProducto'],
                ':categoria' => $datos[$i]['Categoria'],
                ':task_type' => $datos[$i]['TaskType'],
                ':equipment_id' => $datos[$i]['EquipmentID'],
                ':tipo_equipo' => $datos[$i]['TipoEquipo'],
                ':nom_tecnico' => $datos[$i]['nom_tecnico'],
                ':cc_tecnico' => $datos[$i]['cc_tecnico'],
                ':identificador_servicio' => $datos[$i]['IdentificadorServicio'],
            ]);

            if ($stmt->rowCount()) {
                $count++;
            }
        }
    }

    /*$stmt = $conn->prepare("DELETE FROM activacion_toip
                                    WHERE en_gestion != '2'
                                      AND (
                                        (SELECT COUNT(*) FROM activacion_toip b WHERE b.tarea = activacion_toip.tarea AND b.en_gestion = '2') > 0
                                      );");
    $stmt->execute();*/


} catch (PDOException $e) {
    var_dump($e);
}

if ($count) {
    echo 'Se ingresaron en la fecha ' . date('Y-m-d H:i:s') . ' ' . $count . ' registros';
} else {
    echo 'No se ingresaron registros en bd sin gestionar fecha ' . date('Y-m-d H:i:s');
}



