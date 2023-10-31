<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

//echo  date('Y-m-d H:i:s');exit();

require_once '../class/conection.php';

$conn = new Conection();

$val = 123;
$url = "http://10.100.66.254/SARA/ruteo/" . $val;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

curl_setopt($ch, CURLOPT_URL, "$url");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, 0);
$data = curl_exec($ch);
curl_close($ch);

$dataclick = json_decode($data, true);

$datos              = $dataclick;
$total              = count($datos);
$count              = 0;
$categoriacalculada = "";
function mesEspanol($fecha)
{

    $fechaDateTime = new DateTime($fecha);

    $nombreMes = $fechaDateTime->format('F');

    $mesesEnEspanol = [
        'January'   => 'Enero',
        'February'  => 'Febrero',
        'March'     => 'Marzo',
        'April'     => 'Abril',
        'May'       => 'Mayo',
        'June'      => 'Junio',
        'July'      => 'Julio',
        'August'    => 'Agosto',
        'September' => 'Septiembre',
        'October'   => 'Octubre',
        'November'  => 'Noviembre',
        'December'  => 'Diciembre',
    ];

    $nombreMesEnEspanol = $mesesEnEspanol[$nombreMes];

    return $nombreMesEnEspanol;
}

try {

    $stmt = $conn->prepare("DELETE FROM historico where fecha = :fecha");
    $stmt->execute([':fecha' => date('Y-m-d')]);

    if ($stmt->rowCount()) {
        echo 'se eliminaron ' . $stmt->rowCount() . ' registros ';
    }

    for ($i = 0; $i < $total; $i++) {

        if (strpos($datos[$i]['proceso'], "B2B") !== false) {
            $categoriacalculada = "B2B";
        } elseif (strpos($datos[$i]['proceso'], "BSC") !== false) {
            $categoriacalculada = "BSC";
        }

        if ((strpos($datos[$i]['tasktype'], "Reparacion") !== false) || (strpos($datos[$i]['tasktype'], "Corte") !== false)) {
            $categoriacalculada = "Corte";
        } elseif ((strpos($datos[$i]['tasktype'], "B2B") === false) && (strpos($datos[$i]['tasktype'], "BSC") === false)) {
            $categoriacalculada = "Hogares";
        }


        if ((strpos($datos[$i]['proceso'], "Aseguramiento") !== false) && (strpos($datos[$i]['proceso'], 'bronceplus') !== false)) {
            $categoriacalculada = "Aseguramiento BSC";
        }

        if ((strpos($datos[$i]['zona'], "Default") !== false) || (strpos($datos[$i]['area'], "Default") !== false)) {

        } else {
            $fecha = date('Y-m-d');
            $mes   = mesEspanol($fecha);

            $stmt = $conn->prepare("INSERT INTO historico (area1, mes, categoriacalculada, region, fecha, sistema, area, categoria, task_type, asignados, abiertas)
                                                                    VALUES (:area1, :mes, :categoriacalculada, :zona, :fecha, :sistema, :area, :proceso, :tasktype, :numerador, :denominador)");

            $stmt->execute([
                ':area1'              => 'NACIONAL',
                ':mes'                => $mes,
                ':categoriacalculada' => $categoriacalculada,
                ':zona'               => $datos[$i]['zona'],
                ':fecha'              => date('Y-m-d'),
                ':sistema'            => $datos[$i]['sistema'],
                ':area'               => $datos[$i]['area'],
                ':proceso'            => $datos[$i]['proceso'],
                ':tasktype'           => $datos[$i]['tasktype'],
                ':numerador'          => $datos[$i]['numerador'],
                ':denominador'        => $datos[$i]['denominador'],
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
}



