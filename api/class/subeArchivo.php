<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
ini_set('memory_limit', '1024M');
/* error_reporting(E_ALL);
ini_set('display_errors', 1); */
//require_once "../Phpexcel/Classes/PHPExcel/IOFactory.php";
require_once "../Phpexcel/Classes/PHPExcel/IOFactory.php";
require_once "../Phpexcel/Classes/PHPExcel.php";
require_once 'conection.php';
$con = new Conection();

ini_set('session.gc_maxlifetime', 3600); // 1 hour
session_set_cookie_params(3600);
session_start();


$target_dir = "../../uploads/";
$target_file = $target_dir . basename($_FILES["fileUpload"]["name"]);
move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $target_file);


// Crear un Objeto PHPExcel
$objReader = PHPExcel_IOFactory::createReaderForFile($target_file);
$objReader->setReadDataOnly(true);
$objPHPExcel = $objReader->load($target_file);

// Obtener la hoja activa
$hoja_activa = $objPHPExcel->getActiveSheet();

// Obtener el número de filas y columnas
$num_filas = $hoja_activa->getHighestRow();
$num_columnas = PHPExcel_Cell::columnIndexFromString($hoja_activa->getHighestColumn());
//echo $num_filas;exit();
// Recorrer las filas y guardar los datos en la base de datos
$counter = 0;
$fecha = date('Y-m-d');
for ($i = 2; $i <= $num_filas; $i++) {
    $valores = array();
    for ($j = 0; $j < $num_columnas; $j++) {
        $celda = $hoja_activa->getCellByColumnAndRow($j, $i);
        $valor = $celda->getValue();
        $valores[] = $valor;
    }

    $pedido = trim($valores[0]);
    $id_tecnico = trim($valores[1]);
    $empresa = trim($valores[2]);
    $despacho = trim($valores[3]);
    $observaciones = trim($valores[4]);
    $accion = trim($valores[5]);
    $sub_accion = trim($valores[6]);
    $proceso = trim($valores[7]);

    if ($pedido == '') {
        $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacíos (pedido)' . $pedido . ' ' . $id_tecnico, ' ' . $despacho);
        echo json_encode($data);
        exit();
    } elseif ($id_tecnico == '') {
        $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacíos (doc tecnico)');
        echo json_encode($data);
        exit();
    } elseif ($empresa == '') {
        $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacíos (empresa)');
        echo json_encode($data);
        exit();
    } elseif ($despacho == '') {
        $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacíos (despacho)');
        echo json_encode($data);
        exit();
    } elseif ($observaciones == '') {
        $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacíos (observaciones)');
        echo json_encode($data);
        exit();
    } elseif ($accion == '') {
        $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacíos (accion)');
        echo json_encode($data);
        exit();
    } elseif ($sub_accion == '') {
        $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacíos (sub accion)');
        echo json_encode($data);
        exit();
    } elseif ($proceso == '') {
        $data = array('state' => 0, 'msj' => 'El archivo tiene campos vacíos (proceso)');
        echo json_encode($data);
        exit();
    } else {
        /*          echo "SELECT * FROM registros WHERE pedido = '$pedido' AND id_tecnico = '$id_tecnico' AND empresa = '$empresa' AND asesor = 'CARGAMASIVA' AND
                despacho = '$despacho' AND observaciones = '$observaciones' AND accion = '$accion' AND tipo_pendiente = '$sub_accion' AND proceso = '$proceso'";exit();  */
        $stmt = $con->prepare("SELECT * FROM registros WHERE pedido = '$pedido' AND id_tecnico = '$id_tecnico' AND empresa = '$empresa' AND asesor = 'CARGAMASIVA' AND
         despacho = '$despacho' AND observaciones = '$observaciones' AND accion = '$accion' AND tipo_pendiente = '$sub_accion' AND proceso = '$proceso' 
         AND fecha BETWEEN '$fecha 00:00:00' AND '$fecha 23:59:59'");
        $stmt->execute();

        if ($stmt->rowCount() == 1) {
            $counter--;
            /* $response = array('state' => 0, 'msj' => 'Estos datos ya existen en la base de datos ' . $pedido . ' observaciones' . $observaciones);
            echo json_encode($response);
            exit(); */
        } else {
            $sql = "INSERT INTO registros " .
                "(pedido, id_tecnico, empresa, asesor, despacho, observaciones, " .
                "accion, tipo_pendiente, fecha, proceso) " .
                "VALUES " .
                "('$pedido','$id_tecnico','$empresa','CARGAMASIVA', " .
                "'$despacho','$observaciones','$accion', " .
                "'$sub_accion', NOW(),'$proceso'); ";

            $rst = $con->query($sql);
            if ($rst->rowCount()) {
                $counter++;
            }
        }
    }
}

if ($counter) {
    $response = array('state' => 1, 'msj' => 'Datos guardados correctamente, se ingresaron ' . $counter . ' registros');
} else {
    $response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos');
}
echo json_encode($response);
