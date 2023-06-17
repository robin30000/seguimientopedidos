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
//$name     = $_FILES['fileUpload']['name'];
$tname = $_FILES['fileUpload']['tmp_name'];
$type = $_FILES['fileUpload']['type'];

//$login   = $this->_request['user'];
$fecha = date("Y-m-d H:i:s");
$tname1 = basename($_FILES["fileUpload"]["name"]);
$guardar = "";

//$target_file = basename($_FILES["fileUpload"]["name"]);
$uploadOk = 1;
// Check if $uploadOk is set to 0 by an error
/*if ($uploadOk == 0) {
          echo "<script>alert('El archivo no se ha subido intentalo de nuevo)')</script>";
          die();
          // if everything is ok, try to upload file
      } else {
          if (move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $target_file)) {
              $c = 1;
          } else {
              $c = 0;
          }
      }*/

move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $target_file);

$tname1 = basename($_FILES["fileUpload"]["name"]);

if ($type == 'application/vnd.ms-excel') {
    // Extension excel 97
    $ext = 'xls';
} elseif ($type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    // Extension excel 2007 y 2010
    $ext = 'xlsx';
} else {
    // Extension no valida
    echo -1;
    exit();
}

$xlsx = 'Excel2007';
$xls = 'Excel5';

$objPHPExcel2 = PHPExcel_IOFactory::load($target_file);
$Total_Sheet = $objPHPExcel2->getSheetCount();
$Sheet = $objPHPExcel2->getSheet(0)->toArray(null, true, true, true);
//var_dump($Sheet);exit();
foreach ($Sheet as $key => $value) {
    if ($key == 1) {
        continue;
    }

    $pedido = trim($value['A']);
    $id_tecnico = trim($value['B']);
    $empresa = trim($value['C']);
    $despacho = trim($value['D']);
    $observaciones = trim($value['E']);
    $accion = trim($value['F']);
    $sub_accion = trim($value['G']);
    $proceso = trim($value['H']);

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
        $counter = 0;


        $stmt = $con->prepare("SELECT * FROM registros WHERE pedido = '$pedido' AND id_tecnico = '$id_tecnico' AND empresa = '$empresa' AND asesor = 'CARGAMASIVA' AND
         despacho = '$despacho' AND observaciones = '$observaciones' AND accion = '$accion' AND tipo_pendiente = '$sub_accion' AND proceso = '$proceso'");
        $stmt->execute();

        if ($stmt->rowCount()) {
            $response = array('state' => 1, 'msj' => 'Estos datos ya existen en la base de datos');
            exit();
        } else {
            $sql = "INSERT INTO registros " .
                "(pedido, id_tecnico, empresa, asesor, despacho, observaciones, " .
                "accion, tipo_pendiente, fecha, proceso) " .
                "VALUES " .
                "('$pedido','$id_tecnico','$empresa','CARGAMASIVA', " .
                "'$despacho','$observaciones','$accion', " .
                "'$sub_accion', NOW(),'$proceso'); ";

            $rst = $con->query($sql);

            $counter++;
        }


    }
}

if ($counter) {
    $response = array('state' => 1, 'msj' => 'Datos guardados correctamente');
} else {
    $response = array('state' => 0, 'msj' => 'Ha ocurrido un error interno inténtalo nuevamente en unos minutos');
}
echo json_encode($response);